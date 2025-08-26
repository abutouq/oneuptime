import Includes from "Common/Types/BaseDatabase/Includes";
import IncidentsTable from "../../../Components/Incident/IncidentsTable";
import DisabledWarning from "../../../Components/Monitor/DisabledWarning";
import PageComponentProps from "../../PageComponentProps";
import ObjectID from "Common/Types/ObjectID";
import Navigation from "Common/UI/Utils/Navigation";
import React, { Fragment, FunctionComponent, ReactElement } from "react";
import Incident from "Common/Models/DatabaseModels/Incident";
import Query from "Common/Types/BaseDatabase/Query";
import ProjectUtil from "Common/UI/Utils/Project";

const MonitorIncidents: FunctionComponent<
  PageComponentProps
> = (): ReactElement => {
  const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

  const query: Query<Incident> = {
    projectId: ProjectUtil.getCurrentProjectId()!,
  };

  if (modelId) {
    query.monitors = new Includes([modelId]);
  }

  return (
    <Fragment>
      <DisabledWarning monitorId={modelId} />
      <IncidentsTable query={query} />
    </Fragment>
  );
};

export default MonitorIncidents;
