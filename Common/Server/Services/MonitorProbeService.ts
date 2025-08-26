import ObjectID from "../../Types/ObjectID";
import CreateBy from "../Types/Database/CreateBy";
import { OnCreate, OnUpdate } from "../Types/Database/Hooks";
import DatabaseService from "./DatabaseService";
import OneUptimeDate from "../../Types/Date";
import BadDataException from "../../Types/Exception/BadDataException";
import MonitorProbe from "../../Models/DatabaseModels/MonitorProbe";
import QueryHelper from "../Types/Database/QueryHelper";
import { LIMIT_PER_PROJECT } from "../../Types/Database/LimitMax";
import MonitorService from "./MonitorService";
import CronTab from "../Utils/CronTab";
import logger from "../Utils/Logger";

export class Service extends DatabaseService<MonitorProbe> {
  public constructor() {
    super(MonitorProbe);
  }

  public async updateNextPingAtForMonitor(data: {
    monitorId: ObjectID;
  }): Promise<void> {
    const monitorProbes: Array<MonitorProbe> = await this.findBy({
      query: {
        monitorId: data.monitorId,
      },
      select: {
        nextPingAt: true,
        probeId: true,
        monitor: {
          monitoringInterval: true,
        },
      },
      limit: LIMIT_PER_PROJECT,
      skip: 0,
      props: {
        isRoot: true,
      },
    });

    for (const monitorProbe of monitorProbes) {
      if (!monitorProbe.probeId) {
        continue;
      }

      let nextPing: Date = OneUptimeDate.addRemoveMinutes(
        OneUptimeDate.getCurrentDate(),
        1,
      );

      try {
        nextPing = CronTab.getNextExecutionTime(
          monitorProbe?.monitor?.monitoringInterval as string,
        );
      } catch (err) {
        logger.error(err);
      }

      if (nextPing && monitorProbe.id) {
        await this.updateOneById({
          id: monitorProbe.id,
          data: {
            nextPingAt: nextPing,
          },
          props: {
            isRoot: true,
          },
        });
      }
    }
  }

  protected override async onBeforeCreate(
    createBy: CreateBy<MonitorProbe>,
  ): Promise<OnCreate<MonitorProbe>> {
    if (
      (createBy.data.monitorId || createBy.data.monitor) &&
      (createBy.data.probeId || createBy.data.probe)
    ) {
      const monitorProbe: MonitorProbe | null = await this.findOneBy({
        query: {
          monitorId: createBy.data.monitorId! || createBy.data.monitor?.id,
          probeId: createBy.data.probeId! || createBy.data.probe?.id,
        },
        select: {
          _id: true,
        },
        props: {
          isRoot: true,
        },
      });

      if (monitorProbe) {
        throw new BadDataException("Probe is already added to this monitor.");
      }
    }

    if (!createBy.data.nextPingAt) {
      createBy.data.nextPingAt = OneUptimeDate.getCurrentDate();
    }

    if (!createBy.data.lastPingAt) {
      createBy.data.lastPingAt = OneUptimeDate.getCurrentDate();
    }

    return { createBy, carryForward: null };
  }

  protected override async onCreateSuccess(
    _onCreate: OnCreate<MonitorProbe>,
    createdItem: MonitorProbe,
  ): Promise<MonitorProbe> {
    if (createdItem.probeId) {
      await MonitorService.refreshProbeStatus(createdItem.probeId);
    }

    return Promise.resolve(createdItem);
  }

  protected override async onUpdateSuccess(
    onUpdate: OnUpdate<MonitorProbe>,
    updatedItemIds: ObjectID[],
  ): Promise<OnUpdate<MonitorProbe>> {
    // if isEnabled is updated, refresh the probe status
    if (onUpdate.updateBy.data.isEnabled !== undefined) {
      const monitorProbes: Array<MonitorProbe> = await this.findBy({
        query: {
          _id: QueryHelper.any(updatedItemIds),
        },
        select: {
          monitorId: true,
          probeId: true,
          nextPingAt: true,
        },
        limit: LIMIT_PER_PROJECT,
        skip: 0,
        props: {
          isRoot: true,
        },
      });

      for (const monitorProbe of monitorProbes) {
        if (!monitorProbe.probeId) {
          continue;
        }

        await MonitorService.refreshProbeStatus(monitorProbe.probeId);
      }
    }

    return onUpdate;
  }
}

export default new Service();
