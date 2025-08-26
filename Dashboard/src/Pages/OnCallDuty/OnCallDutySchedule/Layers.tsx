import Layers from "../../../Components/OnCallPolicy/OnCallScheduleLayer/Layers";
import PageComponentProps from "../../PageComponentProps";
import URL from "Common/Types/API/URL";
import ObjectID from "Common/Types/ObjectID";
import Banner from "Common/UI/Components/Banner/Banner";
import Navigation from "Common/UI/Utils/Navigation";
import ProjectUtil from "Common/UI/Utils/Project";
import React, { Fragment, FunctionComponent, ReactElement } from "react";

const OnCallScheduleDelete: FunctionComponent<
  PageComponentProps
> = (): ReactElement => {
  const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

  return (
    <Fragment>
      <Banner
        openInNewTab={true}
        title="Learn how on-call policy works"
        description="Watch this video to learn how to build effective on-call policies for your team."
        link={URL.fromString("https://youtu.be/HzhKmCryYdc")}
        hideOnMobile={true}
      />
      <Layers
        onCallDutyPolicyScheduleId={modelId}
        projectId={ProjectUtil.getCurrentProjectId()!}
      />
    </Fragment>
  );
};

export default OnCallScheduleDelete;
