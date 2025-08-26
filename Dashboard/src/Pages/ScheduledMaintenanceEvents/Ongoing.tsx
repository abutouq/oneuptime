import ScheduledMaintenanceTable from "../../Components/ScheduledMaintenance/ScheduledMaintenanceTable";
import ProjectUtil from "Common/UI/Utils/Project";
import PageMap from "../../Utils/PageMap";
import RouteMap from "../../Utils/RouteMap";
import PageComponentProps from "../PageComponentProps";
import Route from "Common/Types/API/Route";
import React, { FunctionComponent, ReactElement } from "react";

const ScheduledMaintenancesPage: FunctionComponent<
  PageComponentProps
> = (): ReactElement => {
  return (
    <ScheduledMaintenanceTable
      viewPageRoute={RouteMap[PageMap.SCHEDULED_MAINTENANCE_EVENTS] as Route}
      query={{
        projectId: ProjectUtil.getCurrentProjectId()!,
        currentScheduledMaintenanceState: {
          isOngoingState: true,
        },
      }}
      noItemsMessage="No ongoing events so far."
      title="Ongoing Scheduled Maintenances"
      description="Here is a list of all the ongoing events for this project."
    />
  );
};

export default ScheduledMaintenancesPage;
