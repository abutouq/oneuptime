import { IsBillingEnabled } from "../EnvironmentConfig";
import ProjectService from "../Services/ProjectService";
import { ExpressRequest, OneUptimeRequest } from "../Utils/Express";
import DatabaseCommonInteractionProps from "../../Types/BaseDatabase/DatabaseCommonInteractionProps";
import { PlanType } from "../../Types/Billing/SubscriptionPlan";
import UserType from "../../Types/UserType";
import CaptureSpan from "../Utils/Telemetry/CaptureSpan";

export default class CommonAPI {
  @CaptureSpan()
  public static async getDatabaseCommonInteractionProps(
    req: ExpressRequest,
  ): Promise<DatabaseCommonInteractionProps> {
    const props: DatabaseCommonInteractionProps = {
      tenantId: undefined,
      userGlobalAccessPermission: undefined,
      userTenantAccessPermission: undefined,
      userId: undefined,
      userType: (req as OneUptimeRequest).userType,
      isMultiTenantRequest: undefined,
    };

    if (
      (req as OneUptimeRequest).userAuthorization &&
      (req as OneUptimeRequest).userAuthorization?.userId
    ) {
      props.userId = (req as OneUptimeRequest).userAuthorization!.userId;
    }

    if ((req as OneUptimeRequest).userGlobalAccessPermission) {
      props.userGlobalAccessPermission = (
        req as OneUptimeRequest
      ).userGlobalAccessPermission;
    }

    if ((req as OneUptimeRequest).userTenantAccessPermission) {
      props.userTenantAccessPermission = (
        req as OneUptimeRequest
      ).userTenantAccessPermission;
    }

    if ((req as OneUptimeRequest).tenantId) {
      props.tenantId = (req as OneUptimeRequest).tenantId || undefined;
    }

    if (req.headers["is-multi-tenant-query"]) {
      props.isMultiTenantRequest = true;
    }

    if (IsBillingEnabled && props.tenantId) {
      const plan: {
        plan: PlanType | null;
        isSubscriptionUnpaid: boolean;
      } = await ProjectService.getCurrentPlan(props.tenantId!);
      props.currentPlan = plan.plan || undefined;
      props.isSubscriptionUnpaid = plan.isSubscriptionUnpaid;
    }

    // check for root permissions.

    if (props.userType === UserType.MasterAdmin) {
      props.isMasterAdmin = true;
    }

    return props;
  }
}
