import StatusPageElement from "./StatusPageElement";
import TableColumnListComponent from "Common/UI/Components/TableColumnList/TableColumnListComponent";
import StatusPage from "Common/Models/DatabaseModels/StatusPage";
import React, { FunctionComponent, ReactElement } from "react";

export interface ComponentProps {
  statusPages: Array<StatusPage>;
  onNavigateComplete?: (() => void) | undefined;
}

const StatusPagesElement: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  return (
    <TableColumnListComponent
      items={props.statusPages}
      getEachElement={(statusPage: StatusPage) => {
        return (
          <StatusPageElement
            statusPage={statusPage}
            onNavigateComplete={props.onNavigateComplete}
          />
        );
      }}
      noItemsMessage="No Status Page."
    />
  );
};

export default StatusPagesElement;
