import WorkflowService from "../../../Services/WorkflowService";
import QueryHelper from "../../Database/QueryHelper";
import { RunOptions, RunReturnType } from "../ComponentCode";
import TriggerCode, {
  ExecuteWorkflowType,
  InitProps,
  UpdateProps,
} from "../TriggerCode";
import LIMIT_MAX from "../../../../Types/Database/LimitMax";
import BadDataException from "../../../../Types/Exception/BadDataException";
import { JSONObject } from "../../../../Types/JSON";
import ObjectID from "../../../../Types/ObjectID";
import ComponentMetadata, { Port } from "../../../../Types/Workflow/Component";
import ComponentID from "../../../../Types/Workflow/ComponentID";
import ScheduleComponents from "../../../../Types/Workflow/Components/Schedule";
import Workflow from "../../../../Models/DatabaseModels/Workflow";
import CaptureSpan from "../../../Utils/Telemetry/CaptureSpan";

export default class WebhookTrigger extends TriggerCode {
  public constructor() {
    const component: ComponentMetadata | undefined = ScheduleComponents.find(
      (i: ComponentMetadata) => {
        return i.id === ComponentID.Schedule;
      },
    );

    if (!component) {
      throw new BadDataException("Trigger not found.");
    }
    super();
    this.setMetadata(component);
  }

  @CaptureSpan()
  public override async init(props: InitProps): Promise<void> {
    const workflows: Array<Workflow> = await WorkflowService.findBy({
      query: {
        triggerId: ComponentID.Schedule as string,
        triggerArguments: QueryHelper.notNull(),
      },
      select: {
        _id: true,
        triggerArguments: true,
        isEnabled: true,
      },
      props: {
        isRoot: true,
      },
      limit: LIMIT_MAX,
      skip: 0,
    });

    // query all workflows.
    for (const workflow of workflows) {
      const executeWorkflow: ExecuteWorkflowType = {
        workflowId: new ObjectID(workflow._id!),
        returnValues: {},
      };

      if (
        workflow.triggerArguments &&
        workflow.triggerArguments["schedule"] &&
        workflow.isEnabled
      ) {
        await props.scheduleWorkflow(
          executeWorkflow,
          workflow.triggerArguments["schedule"] as string,
        );
      }

      if (!workflow.isEnabled) {
        await props.removeWorkflow(workflow.id!);
      }
    }
  }

  @CaptureSpan()
  public override async run(
    args: JSONObject,
    options: RunOptions,
  ): Promise<RunReturnType> {
    const successPort: Port | undefined = this.getMetadata().outPorts.find(
      (p: Port) => {
        return p.id === "execute";
      },
    );

    if (!successPort) {
      throw options.onError(new BadDataException("Execute port not found"));
    }

    return {
      returnValues: {
        ...args,
      },
      executePort: successPort,
    };
  }

  @CaptureSpan()
  public override async update(props: UpdateProps): Promise<void> {
    const workflow: Workflow | null = await WorkflowService.findOneBy({
      query: {
        triggerId: ComponentID.Schedule,
        _id: props.workflowId.toString(),
        triggerArguments: QueryHelper.notNull(),
      },
      select: {
        _id: true,
        triggerArguments: true,
        isEnabled: true,
      },
      props: {
        isRoot: true,
      },
    });

    if (!workflow) {
      return;
    }

    if (!this.scheduleWorkflow) {
      return;
    }

    const executeWorkflow: ExecuteWorkflowType = {
      workflowId: new ObjectID(workflow._id!),
      returnValues: {},
    };

    if (
      workflow.triggerArguments &&
      workflow.triggerArguments["schedule"] &&
      workflow.isEnabled
    ) {
      await this.scheduleWorkflow(
        executeWorkflow,
        workflow.triggerArguments["schedule"] as string,
      );
    }

    if (!this.removeWorkflow) {
      return;
    }

    if (!workflow.isEnabled) {
      await this.removeWorkflow(workflow.id!);
    }
  }
}
