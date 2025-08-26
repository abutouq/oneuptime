import CreateBy from "../Types/Database/CreateBy";
import DeleteBy from "../Types/Database/DeleteBy";
import { OnCreate, OnDelete } from "../Types/Database/Hooks";
import logger from "../Utils/Logger";
import DatabaseService from "./DatabaseService";
import MailService from "./MailService";
import UserNotificationRuleService from "./UserNotificationRuleService";
import LIMIT_MAX from "../../Types/Database/LimitMax";
import EmailTemplateType from "../../Types/Email/EmailTemplateType";
import BadDataException from "../../Types/Exception/BadDataException";
import ObjectID from "../../Types/ObjectID";
import Text from "../../Types/Text";
import Model from "../../Models/DatabaseModels/UserEmail";
import CaptureSpan from "../Utils/Telemetry/CaptureSpan";

export class Service extends DatabaseService<Model> {
  public constructor() {
    super(Model);
  }

  @CaptureSpan()
  protected override async onBeforeDelete(
    deleteBy: DeleteBy<Model>,
  ): Promise<OnDelete<Model>> {
    const itemsToDelete: Array<Model> = await this.findBy({
      query: deleteBy.query,
      select: {
        _id: true,
        projectId: true,
      },
      skip: 0,
      limit: LIMIT_MAX,
      props: {
        isRoot: true,
      },
    });

    for (const item of itemsToDelete) {
      await UserNotificationRuleService.deleteBy({
        query: {
          userEmailId: item.id!,
          projectId: item.projectId!,
        },
        limit: LIMIT_MAX,
        skip: 0,
        props: {
          isRoot: true,
        },
      });
    }

    return {
      deleteBy,
      carryForward: null,
    };
  }

  @CaptureSpan()
  protected override async onBeforeCreate(
    createBy: CreateBy<Model>,
  ): Promise<OnCreate<Model>> {
    if (!createBy.props.isRoot && createBy.data.isVerified) {
      throw new BadDataException("isVerified cannot be set to true");
    }

    return {
      createBy,
      carryForward: null,
    };
  }

  @CaptureSpan()
  protected override async onCreateSuccess(
    _onCreate: OnCreate<Model>,
    createdItem: Model,
  ): Promise<Model> {
    if (!createdItem.isVerified) {
      // send verification code
      this.sendVerificationCode(createdItem);
    }

    return createdItem;
  }

  @CaptureSpan()
  public async resendVerificationCode(itemId: ObjectID): Promise<void> {
    const item: Model | null = await this.findOneById({
      id: itemId,
      props: {
        isRoot: true,
      },
      select: {
        email: true,
        verificationCode: true,
        isVerified: true,
        projectId: true,
      },
    });

    if (!item) {
      throw new BadDataException(
        "Item with ID " + itemId.toString() + " not found",
      );
    }

    if (item.isVerified) {
      throw new BadDataException("Email already verified");
    }

    // generate new verification code
    item.verificationCode = Text.generateRandomNumber(6);

    await this.updateOneById({
      id: item.id!,
      props: {
        isRoot: true,
      },
      data: {
        verificationCode: item.verificationCode,
      },
    });

    this.sendVerificationCode(item);
  }

  public sendVerificationCode(item: Model): void {
    MailService.sendMail(
      {
        toEmail: item.email!,
        templateType: EmailTemplateType.VerificationCode,
        vars: {
          code: item.verificationCode!,
          subject: "Verify this email address",
        },
        subject: "Verify this email address",
      },
      {
        projectId: item.projectId!,
        userId: item.userId!,
      },
    ).catch((err: Error) => {
      logger.error(err);
    });
  }
}
export default new Service();
