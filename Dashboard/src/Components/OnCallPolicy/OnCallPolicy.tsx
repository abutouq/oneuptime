import PageMap from "../../Utils/PageMap";
import RouteMap, { RouteUtil } from "../../Utils/RouteMap";
import Route from "Common/Types/API/Route";
import ObjectID from "Common/Types/ObjectID";
import AppLink from "../AppLink/AppLink";
import OnCallDutyPolicy from "Common/Models/DatabaseModels/OnCallDutyPolicy";
import React, { FunctionComponent, ReactElement } from "react";

export interface ComponentProps {
  onCallPolicy: OnCallDutyPolicy;
  onNavigateComplete?: (() => void) | undefined;
}

const OnCallPolicyView: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  if (props.onCallPolicy._id) {
    return (
      <AppLink
        onNavigateComplete={props.onNavigateComplete}
        className="hover:underline"
        to={RouteUtil.populateRouteParams(
          RouteMap[PageMap.ON_CALL_DUTY_POLICY_VIEW] as Route,
          {
            modelId: new ObjectID(props.onCallPolicy._id as string),
          },
        )}
      >
        <span>{props.onCallPolicy.name}</span>
      </AppLink>
    );
  }

  return <span>{props.onCallPolicy.name}</span>;
};

export default OnCallPolicyView;
