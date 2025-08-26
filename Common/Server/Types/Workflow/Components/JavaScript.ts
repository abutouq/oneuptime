import { WorkflowScriptTimeoutInMS } from "../../../../Server/EnvironmentConfig";
import VMUtil from "../../../Utils/VM/VMAPI";
import ComponentCode, { RunOptions, RunReturnType } from "../ComponentCode";
import BadDataException from "../../../../Types/Exception/BadDataException";
import ReturnResult from "../../../../Types/IsolatedVM/ReturnResult";
import { JSONObject, JSONValue } from "../../../../Types/JSON";
import ComponentMetadata, { Port } from "../../../../Types/Workflow/Component";
import ComponentID from "../../../../Types/Workflow/ComponentID";
import JavaScriptComponents from "../../../../Types/Workflow/Components/JavaScript";
import CaptureSpan from "../../../Utils/Telemetry/CaptureSpan";

export default class JavaScriptCode extends ComponentCode {
  public constructor() {
    super();

    const JavaScriptComponent: ComponentMetadata | undefined =
      JavaScriptComponents.find((i: ComponentMetadata) => {
        return i.id === ComponentID.JavaScriptCode;
      });

    if (!JavaScriptComponent) {
      throw new BadDataException("Custom JavaScript Component not found.");
    }

    this.setMetadata(JavaScriptComponent);
  }

  @CaptureSpan()
  public override async run(
    args: JSONObject,
    options: RunOptions,
  ): Promise<RunReturnType> {
    const successPort: Port | undefined = this.getMetadata().outPorts.find(
      (p: Port) => {
        return p.id === "success";
      },
    );

    if (!successPort) {
      throw options.onError(new BadDataException("Success port not found"));
    }

    const errorPort: Port | undefined = this.getMetadata().outPorts.find(
      (p: Port) => {
        return p.id === "error";
      },
    );

    if (!errorPort) {
      throw options.onError(new BadDataException("Error port not found"));
    }

    try {
      // Set timeout
      // Inject args
      // Inject dependencies

      let scriptArgs: JSONObject | string =
        (args["arguments"] as JSONObject | string) || {};

      if (typeof scriptArgs === "string") {
        scriptArgs = JSON.parse(scriptArgs);
      }

      const code: string = (args["code"] as string) || "";

      const returnResult: ReturnResult = await VMUtil.runCodeInSandbox({
        code,
        options: {
          args: scriptArgs as JSONObject,
          timeout: WorkflowScriptTimeoutInMS,
        },
      });

      const logMessages: string[] = returnResult.logMessages;

      // add to option.log
      logMessages.forEach((msg: string) => {
        options.log(msg);
      });

      const returnVal: JSONValue = returnResult.returnValue;

      return {
        returnValues: {
          returnValue: returnVal,
        },
        executePort: successPort,
      };
    } catch (err: any) {
      options.log("Error running script");
      options.log(err.message ? err.message : JSON.stringify(err, null, 2));
      return {
        returnValues: {},
        executePort: errorPort,
      };
    }
  }
}
