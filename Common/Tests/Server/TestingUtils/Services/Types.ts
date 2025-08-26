import { PaymentMethod } from "../../../../Server/Services/BillingService";
import ServerMeteredPlan from "../../../../Server/Types/Billing/MeteredPlan/ServerMeteredPlan";
import SubscriptionPlan from "../../../../Types/Billing/SubscriptionPlan";
import Dictionary from "../../../../Types/Dictionary";
import Email from "../../../../Types/Email";
import ObjectID from "../../../../Types/ObjectID";

export type CustomerData = {
  id: ObjectID;
  name: string;
  email: Email;
};

export type CouponData = {
  name: string;
  metadata?: Dictionary<string> | undefined;
  percentOff: number;
  durationInMonths: number;
  maxRedemptions: number;
};

export type Subscription = {
  projectId: ObjectID;
  customerId: string;
  serverMeteredPlans: Array<ServerMeteredPlan>;
  promoCode?: string;
  defaultPaymentMethodId?: string;
  trialDate: Date;
};

export type MeteredSubscription = {
  projectId: ObjectID;
  customerId: string;
  serverMeteredPlans: Array<ServerMeteredPlan>;
  plan: SubscriptionPlan;
  quantity: number;
  isYearly: boolean;
  trial: boolean | Date | undefined;
  defaultPaymentMethodId?: string | undefined;
  promoCode?: string | undefined;
};

export type ChangePlan = {
  projectId: ObjectID;
  subscriptionId: string;
  meteredSubscriptionId: string;
  serverMeteredPlans: Array<ServerMeteredPlan>;
  newPlan: SubscriptionPlan;
  quantity: number;
  isYearly: boolean;
  endTrialAt?: Date | undefined;
};

export type PaymentMethodsResponse = {
  data: PaymentMethod[];
  defaultPaymentMethodId?: string | undefined;
};
