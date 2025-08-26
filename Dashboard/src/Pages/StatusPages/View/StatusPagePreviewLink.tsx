import URL from "Common/Types/API/URL";
import ObjectID from "Common/Types/ObjectID";
import Card from "Common/UI/Components/Card/Card";
import { STATUS_PAGE_URL } from "Common/UI/Config";
import React, { FunctionComponent, ReactElement } from "react";
import Link from "Common/UI/Components/Link/Link";

export interface ComponentProps {
  modelId: ObjectID;
}

const StatusPagePreviewLink: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  return (
    <>
      <Card
        title={`Status Page Preview URL`}
        description={
          <span>
            Here&apos;s a link to preview your status page:{" "}
            <Link
              openInNewTab={true}
              to={URL.fromString(
                `${STATUS_PAGE_URL.toString()}/${props.modelId}`,
              )}
            >
              <span>{`${STATUS_PAGE_URL.toString()}/${props.modelId}`}</span>
            </Link>
          </span>
        }
      />
    </>
  );
};

export default StatusPagePreviewLink;
