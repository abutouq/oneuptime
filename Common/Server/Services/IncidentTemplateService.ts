import { OnCreate } from "../Types/Database/Hooks";
import DatabaseService from "./DatabaseService";
import IncidentTemplateOwnerTeamService from "./IncidentTemplateOwnerTeamService";
import IncidentTemplateOwnerUserService from "./IncidentTemplateOwnerUserService";
import DatabaseCommonInteractionProps from "../../Types/BaseDatabase/DatabaseCommonInteractionProps";
import ObjectID from "../../Types/ObjectID";
import Typeof from "../../Types/Typeof";
import Model from "../../Models/DatabaseModels/IncidentTemplate";
import IncidentTemplateOwnerTeam from "../../Models/DatabaseModels/IncidentTemplateOwnerTeam";
import IncidentTemplateOwnerUser from "../../Models/DatabaseModels/IncidentTemplateOwnerUser";
import CaptureSpan from "../Utils/Telemetry/CaptureSpan";

export class Service extends DatabaseService<Model> {
  public constructor() {
    super(Model);
  }

  @CaptureSpan()
  protected override async onCreateSuccess(
    onCreate: OnCreate<Model>,
    createdItem: Model,
  ): Promise<Model> {
    // add owners.

    if (
      createdItem.projectId &&
      createdItem.id &&
      onCreate.createBy.miscDataProps &&
      (onCreate.createBy.miscDataProps["ownerTeams"] ||
        onCreate.createBy.miscDataProps["ownerUsers"])
    ) {
      await this.addOwners(
        createdItem.projectId,
        createdItem.id,
        (onCreate.createBy.miscDataProps["ownerUsers"] as Array<ObjectID>) ||
          [],
        (onCreate.createBy.miscDataProps["ownerTeams"] as Array<ObjectID>) ||
          [],
        false,
        onCreate.createBy.props,
      );
    }

    return createdItem;
  }

  @CaptureSpan()
  public async addOwners(
    projectId: ObjectID,
    incidentTemplateId: ObjectID,
    userIds: Array<ObjectID>,
    teamIds: Array<ObjectID>,
    notifyOwners: boolean,
    props: DatabaseCommonInteractionProps,
  ): Promise<void> {
    for (let teamId of teamIds) {
      if (typeof teamId === Typeof.String) {
        teamId = new ObjectID(teamId.toString());
      }

      const teamOwner: IncidentTemplateOwnerTeam =
        new IncidentTemplateOwnerTeam();
      teamOwner.incidentTemplateId = incidentTemplateId;
      teamOwner.projectId = projectId;
      teamOwner.teamId = teamId;
      teamOwner.isOwnerNotified = !notifyOwners;

      await IncidentTemplateOwnerTeamService.create({
        data: teamOwner,
        props: props,
      });
    }

    for (let userId of userIds) {
      if (typeof userId === Typeof.String) {
        userId = new ObjectID(userId.toString());
      }
      const teamOwner: IncidentTemplateOwnerUser =
        new IncidentTemplateOwnerUser();
      teamOwner.incidentTemplateId = incidentTemplateId;
      teamOwner.projectId = projectId;
      teamOwner.userId = userId;
      teamOwner.isOwnerNotified = !notifyOwners;
      await IncidentTemplateOwnerUserService.create({
        data: teamOwner,
        props: props,
      });
    }
  }
}
export default new Service();
