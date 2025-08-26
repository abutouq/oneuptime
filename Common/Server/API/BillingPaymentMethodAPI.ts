import { IsBillingEnabled } from "../EnvironmentConfig";
import UserMiddleware from "../Middleware/UserAuthorization";
import BillingPaymentMethodService, {
  Service as BillingPaymentMethodServiceType,
} from "../Services/BillingPaymentMethodService";
import BillingService from "../Services/BillingService";
import ProjectService from "../Services/ProjectService";
import {
  ExpressRequest,
  ExpressResponse,
  NextFunction,
} from "../Utils/Express";
import Response from "../Utils/Response";
import BaseAPI from "./BaseAPI";
import BadDataException from "../../Types/Exception/BadDataException";
import Permission, { UserPermission } from "../../Types/Permission";
import BillingPaymentMethod from "../../Models/DatabaseModels/BillingPaymentMethod";
import Project from "../../Models/DatabaseModels/Project";

export default class UserAPI extends BaseAPI<
  BillingPaymentMethod,
  BillingPaymentMethodServiceType
> {
  public constructor() {
    super(BillingPaymentMethod, BillingPaymentMethodService);

    this.router.post(
      `${new this.entityType().getCrudApiPath()?.toString()}/setup`,
      UserMiddleware.getUserMiddleware,
      async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
        try {
          if (!IsBillingEnabled) {
            throw new BadDataException(
              "Billing is not enabled for this server",
            );
          }

          if (req.body["projectId"]) {
            throw new BadDataException("projectId is required in request body");
          }

          const userPermissions: Array<UserPermission> = (
            await this.getPermissionsForTenant(req)
          ).filter((permission: UserPermission) => {
            return (
              permission.permission.toString() ===
                Permission.ProjectOwner.toString() ||
              permission.permission.toString() ===
                Permission.CreateBillingPaymentMethod.toString()
            );
          });

          if (userPermissions.length === 0) {
            throw new BadDataException(
              "Only Project owner can add payment methods.",
            );
          }

          const project: Project | null = await ProjectService.findOneById({
            id: this.getTenantId(req)!,
            props: {
              isRoot: true,
            },
            select: {
              _id: true,
              paymentProviderCustomerId: true,
            },
          });

          if (!project) {
            throw new BadDataException("Project not found");
          }

          if (!project) {
            throw new BadDataException("Project not found");
          }

          if (!project.paymentProviderCustomerId) {
            throw new BadDataException("Payment Provider customer not found");
          }

          const setupIntent: string = await BillingService.getSetupIntentSecret(
            project.paymentProviderCustomerId,
          );

          return Response.sendJsonObjectResponse(req, res, {
            setupIntent: setupIntent,
          });
        } catch (err) {
          next(err);
        }
      },
    );
  }
}
