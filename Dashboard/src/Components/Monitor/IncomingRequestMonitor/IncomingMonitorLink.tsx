import URL from "Common/Types/API/URL";
import ObjectID from "Common/Types/ObjectID";
import Card from "Common/UI/Components/Card/Card";
import { HOST, HTTP_PROTOCOL } from "Common/UI/Config";
import React, { FunctionComponent, ReactElement } from "react";
import Link from "Common/UI/Components/Link/Link";

export interface ComponentProps {
  secretKey: ObjectID;
}

const IncomingMonitorLink: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  return (
    <>
      <Card
        title={`Incoming Request URL / Heartbeat URL`}
        description={
          <span>
            Please send inbound heartbeat GET or POST requests to this URL{" "}
            <Link
              openInNewTab={true}
              to={new URL(HTTP_PROTOCOL, HOST)
                .addRoute("/heartbeat")
                .addRoute(`/${props.secretKey.toString()}`)}
            >
              <span>
                {new URL(HTTP_PROTOCOL, HOST)
                  .addRoute("/heartbeat")
                  .addRoute(`/${props.secretKey.toString()}`)
                  .toString()}
              </span>
            </Link>
          </span>
        }
      />
    </>
  );
};

export default IncomingMonitorLink;
