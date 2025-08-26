import Faker from "../../../../Utils/Faker";
import Project from "../../../../Models/DatabaseModels/Project";
import SubscriptionPlan, {
  PlanType,
} from "../../../../Types/Billing/SubscriptionPlan";
import DatabaseCommonInteractionProps from "../../../../Types/BaseDatabase/DatabaseCommonInteractionProps";
import ProjectService from "../../../../Server/Services/ProjectService";

export interface ProjectData {
  seatLimit?: number;
}

export default class ProjectTestService {
  public static generateAndSaveRandomProject(
    data: ProjectData | null,
    props: DatabaseCommonInteractionProps,
  ): Promise<Project> {
    const project: Project = ProjectTestService.generateRandomProject(
      data || undefined,
    );

    return ProjectService.create({
      data: project,
      props,
    });
  }

  public static generateRandomProject(data?: ProjectData | undefined): Project {
    const project: Project = new Project();

    // required fields
    project.name = Faker.generateCompanyName();
    project.slug = project.name;
    project.isBlocked = false;
    project.requireSsoForLogin = false;

    if (data && data.seatLimit) {
      project.seatLimit = data.seatLimit;
    }

    project.smsOrCallCurrentBalanceInUSDCents = 0;
    project.autoRechargeSmsOrCallByBalanceInUSD = 0;
    project.autoRechargeSmsOrCallWhenCurrentBalanceFallsInUSD = 0;
    project.enableSmsNotifications = true;
    project.enableCallNotifications = true;
    project.planName = PlanType.Enterprise;
    project.paymentProviderPlanId =
      SubscriptionPlan.getSubscriptionPlans()[0]?.getMonthlyPlanId() || "";
    project.enableAutoRechargeSmsOrCallBalance = true;
    project.lowCallAndSMSBalanceNotificationSentToOwners = true;
    project.failedCallAndSMSBalanceChargeNotificationSentToOwners = true;
    project.notEnabledSmsOrCallNotificationSentToOwners = true;

    return project;
  }
}
