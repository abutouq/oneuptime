import CompareCriteria from "./CompareCriteria";
import {
  CheckOn,
  CriteriaFilter,
} from "../../../../Types/Monitor/CriteriaFilter";
import CustomCodeMonitorResponse from "../../../../Types/Monitor/CustomCodeMonitor/CustomCodeMonitorResponse";
import logger from "../../Logger";
import CaptureSpan from "../../Telemetry/CaptureSpan";

export default class CustomCodeMonitoringCriteria {
  @CaptureSpan()
  public static async isMonitorInstanceCriteriaFilterMet(input: {
    monitorResponse: CustomCodeMonitorResponse;
    criteriaFilter: CriteriaFilter;
  }): Promise<string | null> {
    // Server Monitoring Checks

    let threshold: number | string | undefined | null =
      input.criteriaFilter.value;

    const syntheticMonitorResponse: CustomCodeMonitorResponse =
      input.monitorResponse;

    if (input.criteriaFilter.checkOn === CheckOn.ExecutionTime) {
      threshold = CompareCriteria.convertToNumber(threshold);

      const currentExecutionTime: number =
        syntheticMonitorResponse.executionTimeInMS || 0;

      return CompareCriteria.compareCriteriaNumbers({
        value: currentExecutionTime,
        threshold: threshold as number,
        criteriaFilter: input.criteriaFilter,
      });
    }

    if (input.criteriaFilter.checkOn === CheckOn.Error) {
      const emptyNotEmptyResult: string | null =
        CompareCriteria.compareEmptyAndNotEmpty({
          value: syntheticMonitorResponse.scriptError,
          criteriaFilter: input.criteriaFilter,
        });

      if (emptyNotEmptyResult) {
        return emptyNotEmptyResult;
      }

      if (
        threshold &&
        typeof syntheticMonitorResponse.scriptError === "string"
      ) {
        const result: string | null = CompareCriteria.compareCriteriaStrings({
          value: syntheticMonitorResponse.scriptError!,
          threshold: threshold.toString(),
          criteriaFilter: input.criteriaFilter,
        });

        if (result) {
          return result;
        }
      }
    }

    if (input.criteriaFilter.checkOn === CheckOn.ResultValue) {
      const emptyNotEmptyResult: string | null =
        CompareCriteria.compareEmptyAndNotEmpty({
          value: syntheticMonitorResponse.result,
          criteriaFilter: input.criteriaFilter,
        });

      if (emptyNotEmptyResult) {
        return emptyNotEmptyResult;
      }

      let thresholdAsNumber: number | null = null;

      try {
        if (threshold) {
          thresholdAsNumber = parseFloat(threshold.toString());
        }
      } catch (err) {
        logger.error(err);
        thresholdAsNumber = null;
      }

      if (
        thresholdAsNumber !== null &&
        typeof syntheticMonitorResponse.result === "number"
      ) {
        const result: string | null = CompareCriteria.compareCriteriaNumbers({
          value: syntheticMonitorResponse.result,
          threshold: thresholdAsNumber as number,
          criteriaFilter: input.criteriaFilter,
        });

        if (result) {
          return result;
        }
      }

      if (threshold && typeof syntheticMonitorResponse.result === "string") {
        const result: string | null = CompareCriteria.compareCriteriaStrings({
          value: syntheticMonitorResponse.result,
          threshold: threshold.toString(),
          criteriaFilter: input.criteriaFilter,
        });

        if (result) {
          return result;
        }
      }
    }

    return null;
  }
}
