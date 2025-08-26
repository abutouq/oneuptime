import MonitorTable from "../../Components/Monitor/MonitorTable";
import ProjectUtil from "Common/UI/Utils/Project";
import PageMap from "../../Utils/PageMap";
import RouteMap, { RouteUtil } from "../../Utils/RouteMap";
import PageComponentProps from "../PageComponentProps";
import DashboardSideMenu from "./SideMenu";
import Route from "Common/Types/API/Route";
import Page from "Common/UI/Components/Page/Page";
import React, { FunctionComponent, ReactElement } from "react";

const NotOperationalMonitors: FunctionComponent<PageComponentProps> = (
  props: PageComponentProps,
): ReactElement => {
  return (
    <Page
      title={"Home"}
      breadcrumbLinks={[
        {
          title: "Project",
          to: RouteUtil.populateRouteParams(RouteMap[PageMap.HOME] as Route),
        },
        {
          title: "Home",
          to: RouteUtil.populateRouteParams(RouteMap[PageMap.HOME] as Route),
        },
        {
          title: "Inoperational Monitors ",
          to: RouteMap[PageMap.HOME_NOT_OPERATIONAL_MONITORS] as Route,
        },
      ]}
      sideMenu={
        <DashboardSideMenu project={props.currentProject || undefined} />
      }
    >
      <MonitorTable
        query={{
          projectId: ProjectUtil.getCurrentProjectId()!,
          currentMonitorStatus: {
            isOperationalState: false,
          },
        }}
        noItemsMessage="All monitors in operational state."
        title="Inoperational Monitors"
        description="Here is a list of all the monitors which are not in operational state."
      />
    </Page>
  );
};

export default NotOperationalMonitors;
