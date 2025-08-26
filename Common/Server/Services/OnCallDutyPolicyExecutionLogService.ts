import CreateBy from "../Types/Database/CreateBy";
import { OnCreate, OnUpdate } from "../Types/Database/Hooks";
import DatabaseService from "./DatabaseService";
import OnCallDutyPolicyEscalationRuleService from "./OnCallDutyPolicyEscalationRuleService";
import OnCallDutyPolicyStatus from "../../Types/OnCallDutyPolicy/OnCallDutyPolicyStatus";
import UserNotificationEventType from "../../Types/UserNotification/UserNotificationEventType";
import OnCallDutyPolicyEscalationRule from "../../Models/DatabaseModels/OnCallDutyPolicyEscalationRule";
import Model from "../../Models/DatabaseModels/OnCallDutyPolicyExecutionLog";
import { IsBillingEnabled } from "../EnvironmentConfig";
import CaptureSpan from "../Utils/Telemetry/CaptureSpan";
import IncidentFeedService from "./IncidentFeedService";
import { IncidentFeedEventType } from "../../Models/DatabaseModels/IncidentFeed";
import { Blue500, Green500, Red500, Yellow500 } from "../../Types/BrandColors";
import OnCallDutyPolicy from "../../Models/DatabaseModels/OnCallDutyPolicy";
import OnCallDutyPolicyService from "./OnCallDutyPolicyService";
import ObjectID from "../../Types/ObjectID";
import Color from "../../Types/Color";
import AlertFeedService from "./AlertFeedService";
import { AlertFeedEventType } from "../../Models/DatabaseModels/AlertFeed";
import BadDataException from "../../Types/Exception/BadDataException";
import IncidentService from "./IncidentService";
import AlertService from "./AlertService";

export class Service extends DatabaseService<Model> {
  public constructor() {
    super(Model);
    if (IsBillingEnabled) {
      this.hardDeleteItemsOlderThanInDays("createdAt", 30);
    }
  }

  @CaptureSpan()
  protected override async onBeforeCreate(
    createBy: CreateBy<Model>,
  ): Promise<OnCreate<Model>> {
    if (!createBy.data.status) {
      createBy.data.status = OnCallDutyPolicyStatus.Scheduled;
    }

    if (!createBy.data.statusMessage) {
      createBy.data.statusMessage = "Scheduled.";
    }

    if (createBy.props.userId) {
      createBy.data.triggeredByUserId = createBy.props.userId;
    }

    createBy.data.onCallPolicyExecutionRepeatCount = 1;

    return { createBy, carryForward: null };
  }

  @CaptureSpan()
  protected override async onCreateSuccess(
    _onCreate: OnCreate<Model>,
    createdItem: Model,
  ): Promise<Model> {
    if (createdItem.triggeredByIncidentId || createdItem.triggeredByAlertId) {
      const onCallPolicy: OnCallDutyPolicy | null =
        await OnCallDutyPolicyService.findOneById({
          id: createdItem.onCallDutyPolicyId!,
          select: {
            _id: true,
            projectId: true,
            name: true,
          },
          props: {
            isRoot: true,
          },
        });

      if (onCallPolicy && onCallPolicy.id) {
        let incidentOrAlertLink: string = "";

        if (createdItem.triggeredByIncidentId) {
          const projectId: ObjectID | undefined = createdItem.projectId;
          const incidentId: ObjectID | undefined =
            createdItem.triggeredByIncidentId;
          const incidentNumber: number | null =
            await IncidentService.getIncidentNumber({
              incidentId: incidentId,
            });
          incidentOrAlertLink = `[Incident ${incidentNumber}](${(await IncidentService.getIncidentLinkInDashboard(projectId!, incidentId!)).toString()})`;
        }

        if (createdItem.triggeredByAlertId) {
          const alertNumber: number | null = await AlertService.getAlertNumber({
            alertId: createdItem.triggeredByAlertId,
          });
          incidentOrAlertLink = `[Alert ${alertNumber}](${(await AlertService.getAlertLinkInDashboard(createdItem.projectId!, createdItem.triggeredByAlertId)).toString()})`;
        }

        const feedInfoInMarkdown: string = `**📞 On Call Policy Started Executing:** On Call Policy **${onCallPolicy.name}** started executing for ${incidentOrAlertLink}. Users on call on this policy will now be notified.`;

        if (
          onCallPolicy &&
          onCallPolicy.id &&
          createdItem.triggeredByIncidentId
        ) {
          await IncidentFeedService.createIncidentFeedItem({
            incidentId: createdItem.triggeredByIncidentId,
            projectId: createdItem.projectId!,
            incidentFeedEventType: IncidentFeedEventType.OnCallPolicy,
            displayColor: Yellow500,
            feedInfoInMarkdown: feedInfoInMarkdown,
            workspaceNotification: {
              sendWorkspaceNotification: true,
            },
          });
        }

        if (onCallPolicy && onCallPolicy.id && createdItem.triggeredByAlertId) {
          await AlertFeedService.createAlertFeedItem({
            alertId: createdItem.triggeredByAlertId,
            projectId: createdItem.projectId!,
            alertFeedEventType: AlertFeedEventType.OnCallPolicy,
            displayColor: Yellow500,
            feedInfoInMarkdown: feedInfoInMarkdown,
          });
        }
      }
    }

    // get execution rules in this policy adn execute the first rule.
    const executionRule: OnCallDutyPolicyEscalationRule | null =
      await OnCallDutyPolicyEscalationRuleService.findOneBy({
        query: {
          projectId: createdItem.projectId!,
          onCallDutyPolicyId: createdItem.onCallDutyPolicyId!,
          order: 1,
        },
        props: {
          isRoot: true,
        },
        select: {
          _id: true,
        },
      });

    if (executionRule) {
      await this.updateOneById({
        id: createdItem.id!,
        data: {
          status: OnCallDutyPolicyStatus.Started,
          statusMessage: "Execution started...",
        },
        props: {
          isRoot: true,
        },
      });

      let userNotificationEventType: UserNotificationEventType | null = null;

      if (createdItem.triggeredByIncidentId) {
        userNotificationEventType = UserNotificationEventType.IncidentCreated;
      }

      if (createdItem.triggeredByAlertId) {
        userNotificationEventType = UserNotificationEventType.AlertCreated;
      }

      if (!userNotificationEventType) {
        throw new BadDataException("Invalid userNotificationEventType");
      }

      await OnCallDutyPolicyEscalationRuleService.startRuleExecution(
        executionRule.id!,
        {
          projectId: createdItem.projectId!,
          triggeredByIncidentId: createdItem.triggeredByIncidentId,
          triggeredByAlertId: createdItem.triggeredByAlertId,
          userNotificationEventType: userNotificationEventType,
          onCallPolicyExecutionLogId: createdItem.id!,
          onCallPolicyId: createdItem.onCallDutyPolicyId!,
        },
      );

      await this.updateOneById({
        id: createdItem.id!,
        data: {
          status: OnCallDutyPolicyStatus.Executing,
          statusMessage: "First escalation rule executed...",
        },
        props: {
          isRoot: true,
        },
      });
    } else {
      await this.updateOneById({
        id: createdItem.id!,
        data: {
          status: OnCallDutyPolicyStatus.Error,
          statusMessage:
            "No Escalation Rules in Policy. Please add escalation rules to this policy.",
        },
        props: {
          isRoot: true,
        },
      });
    }

    return createdItem;
  }

  public getDisplayColorByStatus(status: OnCallDutyPolicyStatus): Color {
    switch (status) {
      case OnCallDutyPolicyStatus.Scheduled:
        return Blue500;
      case OnCallDutyPolicyStatus.Started:
        return Yellow500;
      case OnCallDutyPolicyStatus.Executing:
        return Yellow500;
      case OnCallDutyPolicyStatus.Completed:
        return Green500;
      case OnCallDutyPolicyStatus.Error:
        return Red500;
      default:
        return Blue500;
    }
  }

  public getEmojiByStatus(status: OnCallDutyPolicyStatus | undefined): string {
    switch (status) {
      case OnCallDutyPolicyStatus.Scheduled:
        return "📅";
      case OnCallDutyPolicyStatus.Started:
        return "🚀";
      case OnCallDutyPolicyStatus.Executing:
        return "▶️";
      case OnCallDutyPolicyStatus.Completed:
        return "🏁";
      case OnCallDutyPolicyStatus.Error:
        return "❌";
      default:
        return "📅";
    }
  }

  @CaptureSpan()
  protected override async onUpdateSuccess(
    onUpdate: OnUpdate<Model>,
    _updatedItemIds: Array<ObjectID>,
  ): Promise<OnUpdate<Model>> {
    // if status is updtaed then check if this on-call is related to the incident, if yes, then add to incident feed.
    if (onUpdate.updateBy.data.status && onUpdate.updateBy.query._id) {
      const id: ObjectID = onUpdate.updateBy.query._id! as ObjectID;

      const onCalldutyPolicyExecutionLog: Model | null = await this.findOneById(
        {
          id: id,
          select: {
            _id: true,
            projectId: true,
            onCallDutyPolicyId: true,
            status: true,
            statusMessage: true,
            triggeredByIncidentId: true,
            triggeredByAlertId: true,
          },
          props: {
            isRoot: true,
          },
        },
      );

      if (
        onCalldutyPolicyExecutionLog &&
        (onCalldutyPolicyExecutionLog.triggeredByIncidentId ||
          onCalldutyPolicyExecutionLog.triggeredByAlertId)
      ) {
        const onCallPolicy: OnCallDutyPolicy | null =
          await OnCallDutyPolicyService.findOneById({
            id: onCalldutyPolicyExecutionLog.onCallDutyPolicyId!,
            select: {
              _id: true,
              projectId: true,
              name: true,
            },
            props: {
              isRoot: true,
            },
          });

        if (onCallPolicy && onCallPolicy.id) {
          const moreInformationInMarkdown: string = `**Status:** ${onCalldutyPolicyExecutionLog.status}

**Message:** ${onCalldutyPolicyExecutionLog.statusMessage}`;

          let incidentOrAlertLink: string = "";

          if (onCalldutyPolicyExecutionLog.triggeredByIncidentId) {
            const projectId: ObjectID | undefined =
              onCalldutyPolicyExecutionLog.projectId;
            const incidentId: ObjectID | undefined =
              onCalldutyPolicyExecutionLog.triggeredByIncidentId;
            const incidentNumber: number | null =
              await IncidentService.getIncidentNumber({
                incidentId: incidentId,
              });
            incidentOrAlertLink = `[Incident ${incidentNumber}](${(await IncidentService.getIncidentLinkInDashboard(projectId!, incidentId!)).toString()})`;
          }

          if (onCalldutyPolicyExecutionLog.triggeredByAlertId) {
            const alertNumber: number | null =
              await AlertService.getAlertNumber({
                alertId: onCalldutyPolicyExecutionLog.triggeredByAlertId,
              });
            incidentOrAlertLink = `[Alert ${alertNumber}](${(await AlertService.getAlertLinkInDashboard(onCalldutyPolicyExecutionLog.projectId!, onCalldutyPolicyExecutionLog.triggeredByAlertId)).toString()})`;
          }

          const feedInfoInMarkdown: string = `**${this.getEmojiByStatus(onCalldutyPolicyExecutionLog.status)} On Call Policy Status Updated for ${incidentOrAlertLink}:**

 On-call policy **[${onCallPolicy.name?.toString()}](${(await OnCallDutyPolicyService.getOnCallDutyPolicyLinkInDashboard(onCallPolicy.projectId!, onCallPolicy.id!)).toString()})** status updated to **${onCalldutyPolicyExecutionLog.status}**`;

          if (onCalldutyPolicyExecutionLog.triggeredByIncidentId) {
            await IncidentFeedService.createIncidentFeedItem({
              incidentId: onCalldutyPolicyExecutionLog.triggeredByIncidentId,
              projectId: onCalldutyPolicyExecutionLog.projectId!,
              incidentFeedEventType: IncidentFeedEventType.OnCallPolicy,
              displayColor: onCalldutyPolicyExecutionLog.status
                ? this.getDisplayColorByStatus(
                    onCalldutyPolicyExecutionLog.status,
                  )
                : Blue500,
              moreInformationInMarkdown: moreInformationInMarkdown,
              feedInfoInMarkdown: feedInfoInMarkdown,
              workspaceNotification: {
                sendWorkspaceNotification: true,
              },
            });
          }

          if (onCalldutyPolicyExecutionLog.triggeredByAlertId) {
            await AlertFeedService.createAlertFeedItem({
              alertId: onCalldutyPolicyExecutionLog.triggeredByAlertId,
              projectId: onCalldutyPolicyExecutionLog.projectId!,
              alertFeedEventType: AlertFeedEventType.OnCallPolicy,
              displayColor: onCalldutyPolicyExecutionLog.status
                ? this.getDisplayColorByStatus(
                    onCalldutyPolicyExecutionLog.status,
                  )
                : Blue500,
              moreInformationInMarkdown: moreInformationInMarkdown,
              feedInfoInMarkdown: feedInfoInMarkdown,
            });
          }
        }
      }
    }

    return onUpdate;
  }
}
export default new Service();
