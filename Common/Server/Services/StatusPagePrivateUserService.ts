import DatabaseConfig from "../DatabaseConfig";
import CreateBy from "../Types/Database/CreateBy";
import { OnCreate } from "../Types/Database/Hooks";
import logger from "../Utils/Logger";
import DatabaseService from "./DatabaseService";
import MailService from "./MailService";
import StatusPageService from "./StatusPageService";
import { FileRoute } from "../../ServiceRoute";
import CaptureSpan from "../Utils/Telemetry/CaptureSpan";
import Hostname from "../../Types/API/Hostname";
import Protocol from "../../Types/API/Protocol";
import URL from "../../Types/API/URL";
import OneUptimeDate from "../../Types/Date";
import EmailTemplateType from "../../Types/Email/EmailTemplateType";
import BadDataException from "../../Types/Exception/BadDataException";
import ObjectID from "../../Types/ObjectID";
import StatusPage from "../../Models/DatabaseModels/StatusPage";
import Model from "../../Models/DatabaseModels/StatusPagePrivateUser";

export class Service extends DatabaseService<Model> {
  public constructor() {
    super(Model);
  }

  @CaptureSpan()
  protected override async onBeforeCreate(
    createBy: CreateBy<Model>,
  ): Promise<OnCreate<Model>> {
    // check if this user is already invited.
    if (createBy.data.statusPageId && createBy.data.email) {
      const statusPageUser: Model | null = await this.findOneBy({
        query: {
          email: createBy.data.email,
          statusPageId: createBy.data.statusPageId,
        },
        props: {
          isRoot: true,
        },
        select: {
          _id: true,
        },
      });

      if (statusPageUser) {
        throw new BadDataException(
          "This user is already invited to this status page.",
        );
      }
    }

    return {
      createBy: createBy,
      carryForward: null,
    };
  }

  @CaptureSpan()
  protected override async onCreateSuccess(
    _onCreate: OnCreate<Model>,
    createdItem: Model,
  ): Promise<Model> {
    // send email to the user.
    const token: string = ObjectID.generate().toString();
    await this.updateOneById({
      id: createdItem.id!,
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: OneUptimeDate.getOneDayAfter(),
      },
      props: {
        isRoot: true,
        ignoreHooks: true,
      },
    });

    if (createdItem.isSsoUser) {
      return createdItem;
    }

    const statusPage: StatusPage | null = await StatusPageService.findOneById({
      id: createdItem.statusPageId!,
      props: {
        isRoot: true,
        ignoreHooks: true,
      },
      select: {
        _id: true,
        name: true,
        pageTitle: true,
        logoFileId: true,
        projectId: true,
      },
    });

    if (!statusPage) {
      throw new BadDataException("Status Page not found");
    }

    const statusPageName: string | undefined =
      statusPage.pageTitle || statusPage.name;

    const statusPageURL: string = await StatusPageService.getStatusPageURL(
      statusPage.id!,
    );

    const host: Hostname = await DatabaseConfig.getHost();

    const httpProtocol: Protocol = await DatabaseConfig.getHttpProtocol();

    MailService.sendMail(
      {
        toEmail: createdItem.email!,
        subject: "You have been invited to " + statusPageName,
        templateType: EmailTemplateType.StatusPageWelcomeEmail,
        vars: {
          statusPageName: statusPageName!,
          statusPageUrl: statusPageURL,
          logoUrl: statusPage.logoFileId
            ? new URL(httpProtocol, host)
                .addRoute(FileRoute)
                .addRoute("/image/" + statusPage.logoFileId)
                .toString()
            : "",
          homeURL: statusPageURL,
          tokenVerifyUrl: URL.fromString(statusPageURL)
            .addRoute("/reset-password/" + token)
            .toString(),
        },
      },
      {
        projectId: statusPage.projectId,
        statusPageId: statusPage.id!,
      },
    ).catch((err: Error) => {
      logger.error(err);
    });

    return createdItem;
  }
}
export default new Service();
