import NotificationMethodView from "../../Components/NotificationMethods/NotificationMethod";
import ProjectUtil from "Common/UI/Utils/Project";
import PageComponentProps from "../PageComponentProps";
import { Green, Red, Yellow } from "Common/Types/BrandColors";
import { ErrorFunction, VoidFunction } from "Common/Types/FunctionTypes";
import ObjectID from "Common/Types/ObjectID";
import UserNotificationStatus from "Common/Types/UserNotification/UserNotificationStatus";
import { ButtonStyleType } from "Common/UI/Components/Button/Button";
import ConfirmModal from "Common/UI/Components/Modal/ConfirmModal";
import ModelTable from "Common/UI/Components/ModelTable/ModelTable";
import Pill from "Common/UI/Components/Pill/Pill";
import FieldType from "Common/UI/Components/Types/FieldType";
import { GetReactElementFunction } from "Common/UI/Types/FunctionTypes";
import DropdownUtil from "Common/UI/Utils/Dropdown";
import Navigation from "Common/UI/Utils/Navigation";
import User from "Common/UI/Utils/User";
import UserOnCallLogTimeline from "Common/Models/DatabaseModels/UserOnCallLogTimeline";
import React, {
  Fragment,
  FunctionComponent,
  ReactElement,
  useState,
} from "react";

const Settings: FunctionComponent<PageComponentProps> = (): ReactElement => {
  const modelId: ObjectID = Navigation.getLastParamAsObjectID();

  const [showViewStatusMessageModal, setShowViewStatusMessageModal] =
    useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const getModelTable: GetReactElementFunction = (): ReactElement => {
    return (
      <ModelTable<UserOnCallLogTimeline>
        modelType={UserOnCallLogTimeline}
        query={{
          projectId: ProjectUtil.getCurrentProjectId()!,
          userNotificationLogId: modelId.toString(),
          userId: User.getUserId()?.toString(),
        }}
        userPreferencesKey="user-notification-logs-timeline-table"
        id="notification-logs-timeline-table"
        name="User Settings > Notification Logs > Timeline"
        isDeleteable={false}
        isEditable={false}
        isCreateable={false}
        cardProps={{
          title: "Notification Timeline",
          description:
            "Here are all the timeline events. This will help you to debug any notification issues that you may face.",
        }}
        selectMoreFields={{
          statusMessage: true,
          userEmail: {
            email: true,
          },
          userSms: {
            phone: true,
          },
          userPush: {
            deviceName: true,
          },
        }}
        noItemsMessage={"No notifications sent out so far."}
        showRefreshButton={true}
        showViewIdButton={true}
        actionButtons={[
          {
            title: "View Status Message",
            buttonStyleType: ButtonStyleType.NORMAL,
            onClick: async (
              item: UserOnCallLogTimeline,
              onCompleteAction: VoidFunction,
              onError: ErrorFunction,
            ) => {
              try {
                setStatusMessage(item["statusMessage"] as string);
                setShowViewStatusMessageModal(true);

                onCompleteAction();
              } catch (err) {
                onCompleteAction();
                onError(err as Error);
              }
            },
          },
        ]}
        filters={[
          {
            field: {
              createdAt: true,
            },
            title: "Notification Sent At",
            type: FieldType.DateTime,
          },

          {
            field: {
              status: true,
            },
            title: "Status",
            type: FieldType.Element,

            filterDropdownOptions: DropdownUtil.getDropdownOptionsFromEnum(
              UserNotificationStatus,
            ),
          },
        ]}
        columns={[
          {
            field: {
              userCall: {
                phone: true,
              },
            },
            title: "Notification Method",
            type: FieldType.Element,
            getElement: (item: UserOnCallLogTimeline): ReactElement => {
              return (
                <NotificationMethodView
                  item={item}
                  modelType={UserOnCallLogTimeline}
                />
              );
            },
          },
          {
            field: {
              createdAt: true,
            },
            title: "Notification Sent At",
            type: FieldType.DateTime,
            hideOnMobile: true,
          },
          {
            field: {
              status: true,
            },
            title: "Status",
            type: FieldType.Element,

            getElement: (item: UserOnCallLogTimeline): ReactElement => {
              if (item["status"] === UserNotificationStatus.Sent) {
                return (
                  <Pill color={Green} text={UserNotificationStatus.Sent} />
                );
              } else if (
                item["status"] === UserNotificationStatus.Acknowledged
              ) {
                return (
                  <Pill
                    color={Green}
                    text={UserNotificationStatus.Acknowledged}
                  />
                );
              } else if (item["status"] === UserNotificationStatus.Error) {
                return (
                  <Pill color={Yellow} text={UserNotificationStatus.Error} />
                );
              } else if (item["status"] === UserNotificationStatus.Sending) {
                return (
                  <Pill color={Yellow} text={UserNotificationStatus.Sending} />
                );
              } else if (item["status"] === UserNotificationStatus.Skipped) {
                return (
                  <Pill color={Yellow} text={UserNotificationStatus.Skipped} />
                );
              }

              return <Pill color={Red} text={UserNotificationStatus.Error} />;
            },
          },
        ]}
      />
    );
  };

  return (
    <Fragment>
      {getModelTable()}

      {showViewStatusMessageModal ? (
        <ConfirmModal
          title={"Status Message"}
          description={statusMessage}
          submitButtonText={"Close"}
          onSubmit={async () => {
            setShowViewStatusMessageModal(false);
          }}
        />
      ) : (
        <></>
      )}
    </Fragment>
  );
};

export default Settings;
