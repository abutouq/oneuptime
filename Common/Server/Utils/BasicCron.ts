import logger from "./Logger";
import { PromiseVoidFunction } from "../../Types/FunctionTypes";
import cron from "node-cron";

type BasicCronProps = {
  jobName: string;
  options: {
    schedule: string;
    runOnStartup: boolean;
  };
  runFunction: PromiseVoidFunction;
};

type BasicCronFunction = (props: BasicCronProps) => void;

const BasicCron: BasicCronFunction = async (
  props: BasicCronProps,
): Promise<void> => {
  const { jobName, options, runFunction } = props;

  cron.schedule(options.schedule, async () => {
    try {
      logger.debug(`Job ${jobName} Start`);
      await runFunction();
      logger.debug(`Job ${jobName} End`);
    } catch (e) {
      logger.debug(`Job ${jobName} Error`);
      logger.error(e);
    }
  });

  if (options.runOnStartup) {
    logger.debug(`Job ${jobName} - Start on Startup`);
    await runFunction();
  }
};

export default BasicCron;
