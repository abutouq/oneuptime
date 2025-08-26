import UserMiddleware from "../Middleware/UserAuthorization";
import NotificationService from "../Services/NotificationService";
import Express, {
  ExpressRequest,
  ExpressResponse,
  ExpressRouter,
  OneUptimeRequest,
} from "../Utils/Express";
import Response from "../Utils/Response";
import BadDataException from "../../Types/Exception/BadDataException";
import Exception from "../../Types/Exception/Exception";
import JSONFunctions from "../../Types/JSONFunctions";
import ObjectID from "../../Types/ObjectID";
import Permission, { UserPermission } from "../../Types/Permission";
import PositiveNumber from "../../Types/PositiveNumber";

const router: ExpressRouter = Express.getRouter();

router.post(
  "/notification/recharge",
  UserMiddleware.getUserMiddleware,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      let amount: number | PositiveNumber = JSONFunctions.deserializeValue(
        req.body.amount,
      ) as number | PositiveNumber;

      if (amount instanceof PositiveNumber) {
        amount = amount.toNumber();
      }

      if (typeof amount === "string") {
        amount = parseInt(amount);
      }

      const projectId: ObjectID = JSONFunctions.deserializeValue(
        req.body.projectId,
      ) as ObjectID;

      if (!amount || typeof amount !== "number") {
        return Response.sendErrorResponse(
          req,
          res,
          new BadDataException("Invalid amount"),
        );
      }

      if (amount > 1000) {
        return Response.sendErrorResponse(
          req,
          res,
          new BadDataException("Amount cannot be greater than 1000"),
        );
      }

      if (amount < 20) {
        return Response.sendErrorResponse(
          req,
          res,
          new BadDataException("Amount cannot be less than 20"),
        );
      }

      if (!projectId || !projectId.toString()) {
        return Response.sendErrorResponse(
          req,
          res,
          new BadDataException("Invalid projectId"),
        );
      }

      // get permissions. if user has permission to recharge, then recharge

      if (
        !(req as OneUptimeRequest).userTenantAccessPermission ||
        !(req as OneUptimeRequest).userTenantAccessPermission![
          projectId.toString()
        ]
      ) {
        return Response.sendErrorResponse(
          req,
          res,
          new BadDataException("Permission for this user not found"),
        );
      }

      const permissions: Array<Permission> = (
        req as OneUptimeRequest
      ).userTenantAccessPermission![projectId.toString()]!.permissions.map(
        (permission: UserPermission) => {
          return permission.permission;
        },
      );

      if (
        permissions.includes(Permission.ProjectOwner) ||
        permissions.includes(Permission.ManageProjectBilling)
      ) {
        await NotificationService.rechargeBalance(projectId, amount);
      } else {
        return Response.sendErrorResponse(
          req,
          res,
          new BadDataException(
            "User does not have permission to recharge. You need any one of these permissions - ProjectOwner, CanManageProjectBilling",
          ),
        );
      }
    } catch (err: any) {
      return Response.sendErrorResponse(req, res, err as Exception);
    }

    return Response.sendEmptySuccessResponse(req, res);
  },
);

export default router;
