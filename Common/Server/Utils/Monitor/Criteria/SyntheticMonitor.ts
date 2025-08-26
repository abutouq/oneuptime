import CaptureSpan from "../../Telemetry/CaptureSpan";
import CompareCriteria from "./CompareCriteria";
import CustomCodeMonitoringCriteria from "./CustomCodeMonitorCriteria";
import {
  CheckOn,
  CriteriaFilter,
} from "../../../../Types/Monitor/CriteriaFilter";
import SyntheticMonitorResponse from "../../../../Types/Monitor/SyntheticMonitors/SyntheticMonitorResponse";

export default class SyntheticMonitoringCriteria {
  @CaptureSpan()
  public static async isMonitorInstanceCriteriaFilterMet(input: {
    monitorResponse: Array<SyntheticMonitorResponse>;
    criteriaFilter: CriteriaFilter;
  }): Promise<string | null> {
    for (const syntheticMonitorResponse of input.monitorResponse) {
      const threshold: number | string | undefined | null =
        input.criteriaFilter.value;

      // check custom code monitoring criteria first
      const result: string | null =
        await CustomCodeMonitoringCriteria.isMonitorInstanceCriteriaFilterMet({
          monitorResponse: syntheticMonitorResponse,
          criteriaFilter: input.criteriaFilter,
        });

      if (result) {
        return result;
      }

      // check browser type and screen type.

      if (CheckOn.ScreenSizeType === input.criteriaFilter.checkOn) {
        return CompareCriteria.checkEqualToOrNotEqualTo({
          value: syntheticMonitorResponse.screenSizeType,
          threshold: threshold as number,
          criteriaFilter: input.criteriaFilter,
        });
      }

      if (CheckOn.BrowserType === input.criteriaFilter.checkOn) {
        return CompareCriteria.checkEqualToOrNotEqualTo({
          value: syntheticMonitorResponse.browserType,
          threshold: threshold as number,
          criteriaFilter: input.criteriaFilter,
        });
      }
    }

    return null;
  }
}
