import {
  IsBillingEnabled,
  getAllEnvVars,
} from "../../../../Server/EnvironmentConfig";
import DatabaseRequestType from "../../BaseDatabase/DatabaseRequestType";
import BaseModel, {
  DatabaseBaseModelType,
} from "../../../../Models/DatabaseModels/DatabaseBaseModel/DatabaseBaseModel";
import DatabaseCommonInteractionProps from "../../../../Types/BaseDatabase/DatabaseCommonInteractionProps";
import SubscriptionPlan from "../../../../Types/Billing/SubscriptionPlan";
import PaymentRequiredException from "../../../../Types/Exception/PaymentRequiredException";
import CaptureSpan from "../../../Utils/Telemetry/CaptureSpan";

export default class BillingPermissions {
  @CaptureSpan()
  public static checkBillingPermissions(
    modelType: DatabaseBaseModelType,
    props: DatabaseCommonInteractionProps,
    type: DatabaseRequestType,
  ): void {
    /// Check billing permissions.

    if (IsBillingEnabled && props.currentPlan) {
      const model: BaseModel = new modelType();

      if (
        props.isSubscriptionUnpaid &&
        !model.allowAccessIfSubscriptionIsUnpaid
      ) {
        throw new PaymentRequiredException(
          "Your current subscription is in an unpaid state. Looks like your payment method failed. Please add a new payment method in Project Settings > Invoices to pay unpaid invoices.",
        );
      }

      if (type === DatabaseRequestType.Create && model.createBillingPlan) {
        if (
          !SubscriptionPlan.isFeatureAccessibleOnCurrentPlan(
            model.createBillingPlan,
            props.currentPlan,
            getAllEnvVars(),
          )
        ) {
          throw new PaymentRequiredException(
            "Please upgrade your plan to " +
              model.createBillingPlan +
              " to access this feature",
          );
        }
      }

      if (type === DatabaseRequestType.Update && model.updateBillingPlan) {
        if (
          !SubscriptionPlan.isFeatureAccessibleOnCurrentPlan(
            model.updateBillingPlan,
            props.currentPlan,
            getAllEnvVars(),
          )
        ) {
          throw new PaymentRequiredException(
            "Please upgrade your plan to " +
              model.createBillingPlan +
              " to access this feature",
          );
        }
      }

      if (type === DatabaseRequestType.Delete && model.deleteBillingPlan) {
        if (
          !SubscriptionPlan.isFeatureAccessibleOnCurrentPlan(
            model.deleteBillingPlan,
            props.currentPlan,
            getAllEnvVars(),
          )
        ) {
          throw new PaymentRequiredException(
            "Please upgrade your plan to " +
              model.createBillingPlan +
              " to access this feature",
          );
        }
      }

      if (type === DatabaseRequestType.Read && model.readBillingPlan) {
        if (
          !SubscriptionPlan.isFeatureAccessibleOnCurrentPlan(
            model.readBillingPlan,
            props.currentPlan,
            getAllEnvVars(),
          )
        ) {
          throw new PaymentRequiredException(
            "Please upgrade your plan to " +
              model.createBillingPlan +
              " to access this feature",
          );
        }
      }
    }
  }
}
