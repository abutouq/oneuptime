import NotImplementedException from "Common/Types/Exception/NotImplementedException";
import LlmType from "../../Types/LlmType";
import CopilotActionType from "Common/Types/Copilot/CopilotActionType";
import LLM from "../LLM/LLM";
import { GetLlmType } from "../../Config";
import Text from "Common/Types/Text";
import { CopilotPromptResult } from "../LLM/LLMBase";
import BadDataException from "Common/Types/Exception/BadDataException";
import logger from "Common/Server/Utils/Logger";
import CodeRepositoryUtil, { RepoScriptType } from "../../Utils/CodeRepository";
import CopilotActionProp from "Common/Types/Copilot/CopilotActionProps/Index";
import ObjectID from "Common/Types/ObjectID";
import {
  CopilotActionPrompt,
  CopilotProcess,
  CopilotProcessStart,
} from "./Types";

export default class CopilotActionBase {
  public llmType: LlmType = LlmType.ONEUPTIME_LLM; // temp value which will be overridden in the constructor

  public copilotActionType: CopilotActionType =
    CopilotActionType.IMPROVE_COMMENTS; // temp value which will be overridden in the constructor

  public acceptFileExtentions: string[] = [];

  public constructor() {
    this.llmType = GetLlmType();
  }

  protected async isActionRequired(_data: {
    serviceCatalogId: ObjectID;
    serviceRepositoryId: ObjectID;
    copilotActionProp: CopilotActionProp;
  }): Promise<boolean> {
    throw new NotImplementedException();
  }

  public async getActionPropsToQueue(_data: {
    serviceCatalogId: ObjectID;
    serviceRepositoryId: ObjectID;
    maxActionsToQueue: number;
  }): Promise<Array<CopilotActionProp>> {
    throw new NotImplementedException();
  }

  protected async validateExecutionStep(
    _data: CopilotProcess,
  ): Promise<boolean> {
    if (!this.copilotActionType) {
      throw new BadDataException("Copilot Action Type is not set");
    }

    // validate by default.
    return true;
  }

  protected async onAfterExecute(
    data: CopilotProcess,
  ): Promise<CopilotProcess> {
    // do nothing
    return data;
  }

  protected async onBeforeExecute(
    data: CopilotProcess,
  ): Promise<CopilotProcess> {
    // do nothing
    return data;
  }

  public async getBranchName(): Promise<string> {
    const randomText: string = Text.generateRandomText(5);
    const bracnhName: string = `${Text.pascalCaseToDashes(this.copilotActionType).toLowerCase()}-${randomText}`;
    // replace -- with - in the branch name
    return Text.replaceAll(bracnhName, "--", "-");
  }

  public async getPullRequestTitle(_data: CopilotProcess): Promise<string> {
    throw new NotImplementedException();
  }

  public async getPullRequestBody(_data: CopilotProcess): Promise<string> {
    throw new NotImplementedException();
  }

  protected async getDefaultPullRequestBody(): Promise<string> {
    return `
    
#### Warning
This PR is generated by OneUptime Copilot. OneUptime Copilot is an AI tool that improves your code. Please do not rely on it completely. Always review the changes before merging. 

#### Feedback
If you have  any feedback or suggestions, please let us know. We would love to hear from you. Please contact us at copilot@oneuptime.com.

    `;
  }

  public async getCommitMessage(_data: CopilotProcess): Promise<string> {
    throw new NotImplementedException();
  }

  protected async onExecutionStep(
    data: CopilotProcess,
  ): Promise<CopilotProcess> {
    return Promise.resolve(data);
  }

  protected async isActionComplete(_data: CopilotProcess): Promise<boolean> {
    return true; // by default the action is completed
  }

  protected async getNextFilePath(
    _data: CopilotProcess,
  ): Promise<string | null> {
    return null;
  }

  public async execute(
    data: CopilotProcessStart,
  ): Promise<CopilotProcess | null> {
    logger.info(
      "Executing Copilot Action (this will take several minutes to complete): " +
        this.copilotActionType,
    );

    logger.info(data.actionProp)

    const onBeforeExecuteActionScript: string | null =
      await CodeRepositoryUtil.getRepoScript({
        scriptType: RepoScriptType.OnBeforeCodeChange,
      });

    if (!onBeforeExecuteActionScript) {
      logger.debug(
        "No on-before-copilot-action script found for this repository.",
      );
    } else {
      logger.info("Executing on-before-copilot-action script.");
      await CodeRepositoryUtil.executeScript({
        script: onBeforeExecuteActionScript,
      });
      logger.info("on-before-copilot-action script executed successfully");
    }

    const processData: CopilotProcess = await this.onBeforeExecute({
      ...data,
      result: {
        files: {},
        statusMessage: "",
        logs: [],
      },
    });

    if (!processData.result) {
      processData.result = {
        files: {},
        statusMessage: "",
        logs: [],
      };
    }

    if (!processData.result.files) {
      processData.result.files = {};
    }

    let isActionComplete: boolean = false;

    while (!isActionComplete) {
      if (!(await this.validateExecutionStep(processData))) {
        // execution step not valid
        // return data as it is

        return processData;
      }

      data = await this.onExecutionStep(processData);

      isActionComplete = await this.isActionComplete(processData);
    }

    data = await this.onAfterExecute(processData);

    // write to disk.
    await this.writeToDisk({ data: processData });

    const onAfterExecuteActionScript: string | null =
      await CodeRepositoryUtil.getRepoScript({
        scriptType: RepoScriptType.OnAfterCodeChange,
      });

    if (!onAfterExecuteActionScript) {
      logger.debug(
        "No on-after-copilot-action script found for this repository.",
      );
    }

    if (onAfterExecuteActionScript) {
      logger.info("Executing on-after-copilot-action script.");
      await CodeRepositoryUtil.executeScript({
        script: onAfterExecuteActionScript,
      });
      logger.info("on-after-copilot-action script executed successfully");
    }

    return processData;
  }

  protected async _getPrompt(
    data: CopilotProcess,
    inputCode: string,
  ): Promise<CopilotActionPrompt | null> {
    const prompt: CopilotActionPrompt | null = await this._getPrompt(
      data,
      inputCode,
    );

    if (!prompt) {
      return null;
    }

    return prompt;
  }

  protected async getPrompt(
    _data: CopilotProcess,
    _inputCode: string,
  ): Promise<CopilotActionPrompt | null> {
    throw new NotImplementedException();
  }

  protected async askCopilot(
    prompt: CopilotActionPrompt,
  ): Promise<CopilotPromptResult> {
    return await LLM.getResponse(prompt);
  }

  protected async writeToDisk(data: { data: CopilotProcess }): Promise<void> {
    // write all the modified files.

    const processResult: CopilotProcess = data.data;

    for (const filePath in processResult.result.files) {
      logger.info(`Writing file: ${filePath}`);
      logger.info(`File content: `);
      logger.info(`${processResult.result.files[filePath]!.fileContent}`);

      const code: string = processResult.result.files[filePath]!.fileContent;

      await CodeRepositoryUtil.writeToFile({
        filePath: filePath,
        content: code,
      });
    }
  }

  protected async discardAllChanges(): Promise<void> {
    await CodeRepositoryUtil.discardAllChangesOnCurrentBranch();
  }

  protected async splitInputCode(data: {
    code: string;
    itemSize: number;
  }): Promise<string[]> {
    const inputCode: string = data.code;

    const items: Array<string> = [];

    const linesInInputCode: Array<string> = inputCode.split("\n");

    let currentItemSize: number = 0;
    const maxItemSize: number = data.itemSize;

    let currentItem: string = "";

    for (const line of linesInInputCode) {
      const words: Array<string> = line.split(" ");

      // check if the current item size is less than the max item size
      if (currentItemSize + words.length < maxItemSize) {
        currentItem += line + "\n";
        currentItemSize += words.length;
      } else {
        // start a new item
        items.push(currentItem);
        currentItem = line + "\n";
        currentItemSize = words.length;
      }
    }

    if (currentItem) {
      items.push(currentItem);
    }

    return items;
  }
}
