import CreateBy from "../Types/Database/CreateBy";
import { OnCreate, OnUpdate } from "../Types/Database/Hooks";
import UpdateBy from "../Types/Database/UpdateBy";
import Domain from "../Types/Domain";
import DatabaseService from "./DatabaseService";
import BadDataException from "../../Types/Exception/BadDataException";
import Text from "../../Types/Text";
import Model from "../../Models/DatabaseModels/Domain";
import CaptureSpan from "../Utils/Telemetry/CaptureSpan";
export class Service extends DatabaseService<Model> {
  public constructor() {
    super(Model);
  }

  @CaptureSpan()
  protected override async onBeforeCreate(
    createBy: CreateBy<Model>,
  ): Promise<OnCreate<Model>> {
    if (createBy.data.domain) {
      let domain: string | undefined = undefined;

      if (createBy.data.domain instanceof Domain) {
        domain = createBy.data.domain.toString();
      } else if (typeof createBy.data.domain === "string") {
        domain = createBy.data.domain;
      } else {
        throw new BadDataException(
          "Domain must be a string or an instance of Domain.",
        );
      }

      createBy.data.domain = new Domain(domain.trim().toLowerCase());
    }

    createBy.data.domainVerificationText =
      "oneuptime-verification-" + Text.generateRandomText(20);
    return Promise.resolve({ createBy, carryForward: null });
  }

  @CaptureSpan()
  protected override async onBeforeUpdate(
    updateBy: UpdateBy<Model>,
  ): Promise<OnUpdate<Model>> {
    if (
      updateBy.data.isVerified &&
      updateBy.query._id &&
      !updateBy.props.isRoot
    ) {
      // check the verification of the domain.

      const items: Array<Model> = await this.findBy({
        query: {
          _id: updateBy.query._id as string,
          projectId: updateBy.props.tenantId!,
        },
        select: {
          domain: true,
          domainVerificationText: true,
        },

        limit: 1,
        skip: 0,
        props: {
          isRoot: true,
        },
      });

      if (items.length === 0) {
        throw new BadDataException(
          "Domain with id " + updateBy.query._id + " not found.",
        );
      }

      const domain: string | undefined = items[0]?.domain?.toString();
      const verificationText: string | undefined =
        items[0]?.domainVerificationText?.toString();

      if (!domain) {
        throw new BadDataException(
          "Domain with id " + updateBy.query._id + " not found.",
        );
      }

      if (!verificationText) {
        throw new BadDataException(
          "Domain verification text with id " +
            updateBy.query._id +
            " not found.",
        );
      }

      const isVerified: boolean = await Domain.verifyTxtRecord(
        domain,
        verificationText,
      );

      if (!isVerified) {
        throw new BadDataException(
          "Verification TXT record " +
            verificationText +
            " not found in domain " +
            domain +
            ". Please add a TXT record to verify the domain. If you have already added the TXT record, please wait for few hours to let DNS to propagate.",
        );
      }
    }

    return { carryForward: null, updateBy };
  }
}
export default new Service();
