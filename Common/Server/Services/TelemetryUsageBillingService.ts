import { MeteredPlanUtil } from "../Types/Billing/MeteredPlan/AllMeteredPlans";
import TelemetryMeteredPlan from "../Types/Billing/MeteredPlan/TelemetryMeteredPlan";
import QueryHelper from "../Types/Database/QueryHelper";
import DatabaseService from "./DatabaseService";
import SortOrder from "../../Types/BaseDatabase/SortOrder";
import LIMIT_MAX from "../../Types/Database/LimitMax";
import OneUptimeDate from "../../Types/Date";
import Decimal from "../../Types/Decimal";
import BadDataException from "../../Types/Exception/BadDataException";
import ProductType from "../../Types/MeteredPlan/ProductType";
import ObjectID from "../../Types/ObjectID";
import Model from "../../Models/DatabaseModels/TelemetryUsageBilling";
import { IsBillingEnabled } from "../EnvironmentConfig";
import CaptureSpan from "../Utils/Telemetry/CaptureSpan";

export class Service extends DatabaseService<Model> {
  public constructor() {
    super(Model);
    if (IsBillingEnabled) {
      this.hardDeleteItemsOlderThanInDays("createdAt", 120);
    }
  }

  @CaptureSpan()
  public async getUnreportedUsageBilling(data: {
    projectId: ObjectID;
    productType: ProductType;
  }): Promise<Model[]> {
    return await this.findBy({
      query: {
        projectId: data.projectId,
        productType: data.productType,
        isReportedToBillingProvider: false,
        createdAt: QueryHelper.lessThan(
          OneUptimeDate.addRemoveDays(OneUptimeDate.getCurrentDate(), -1),
        ), // we need to get everything that's not today.
      },
      skip: 0,
      limit: LIMIT_MAX, /// because a project can have MANY telemetry services.
      select: {
        _id: true,
        totalCostInUSD: true,
      },
      props: {
        isRoot: true,
      },
    });
  }

  @CaptureSpan()
  public async updateUsageBilling(data: {
    projectId: ObjectID;
    productType: ProductType;
    telemetryServiceId: ObjectID;
    dataIngestedInGB: number;
    retentionInDays: number;
  }): Promise<void> {
    if (
      data.productType !== ProductType.Traces &&
      data.productType !== ProductType.Metrics &&
      data.productType !== ProductType.Logs
    ) {
      throw new BadDataException(
        "This product type is not a telemetry product type.",
      );
    }

    const serverMeteredPlan: TelemetryMeteredPlan =
      MeteredPlanUtil.getMeteredPlanByProductType(
        data.productType,
      ) as TelemetryMeteredPlan;

    const totalCostOfThisOperationInUSD: number =
      serverMeteredPlan.getTotalCostInUSD({
        dataIngestedInGB: data.dataIngestedInGB,
        retentionInDays: data.retentionInDays,
      });

    const usageBilling: Model | null = await this.findOneBy({
      query: {
        projectId: data.projectId,
        productType: data.productType,
        telemetryServiceId: data.telemetryServiceId,
        isReportedToBillingProvider: false,
        createdAt: QueryHelper.inBetween(
          OneUptimeDate.addRemoveDays(OneUptimeDate.getCurrentDate(), -1),
          OneUptimeDate.getCurrentDate(),
        ),
      },
      select: {
        _id: true,
        dataIngestedInGB: true,
        totalCostInUSD: true,
      },
      props: {
        isRoot: true,
      },
      sort: {
        createdAt: SortOrder.Descending,
      },
    });

    if (usageBilling && usageBilling.id) {
      let totalCostInUSD: number = usageBilling.totalCostInUSD?.value || 0;

      if (
        isNaN(totalCostInUSD) ||
        totalCostInUSD === undefined ||
        totalCostInUSD === null ||
        (typeof totalCostInUSD === "string" && totalCostInUSD === "NaN")
      ) {
        totalCostInUSD = 0;
      }

      await this.updateOneById({
        id: usageBilling.id,
        data: {
          dataIngestedInGB: new Decimal(
            (usageBilling.dataIngestedInGB?.value || 0) + data.dataIngestedInGB,
          ),
          totalCostInUSD: new Decimal(
            totalCostInUSD + totalCostOfThisOperationInUSD,
          ),
          retainTelemetryDataForDays: data.retentionInDays,
        },
        props: {
          isRoot: true,
        },
      });
    } else {
      const usageBilling: Model = new Model();
      usageBilling.projectId = data.projectId;
      usageBilling.productType = data.productType;
      usageBilling.dataIngestedInGB = new Decimal(data.dataIngestedInGB);
      usageBilling.telemetryServiceId = data.telemetryServiceId;
      usageBilling.retainTelemetryDataForDays = data.retentionInDays;
      usageBilling.isReportedToBillingProvider = false;
      usageBilling.createdAt = OneUptimeDate.getCurrentDate();

      usageBilling.day = OneUptimeDate.getDateString(
        OneUptimeDate.getCurrentDate(),
      );

      usageBilling.totalCostInUSD = new Decimal(totalCostOfThisOperationInUSD);

      await this.create({
        data: usageBilling,
        props: {
          isRoot: true,
        },
      });
    }
  }
}

export default new Service();
