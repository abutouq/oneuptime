import EventName from "../../Utils/EventName";
import PageMap from "../../Utils/PageMap";
import RouteMap, { RouteUtil } from "../../Utils/RouteMap";
import PageComponentProps from "../PageComponentProps";
import Route from "Common/Types/API/Route";
import { ErrorFunction, VoidFunction } from "Common/Types/FunctionTypes";
import IconProp from "Common/Types/Icon/IconProp";
import ObjectID from "Common/Types/ObjectID";
import { ButtonStyleType } from "Common/UI/Components/Button/Button";
import ModelTable from "Common/UI/Components/ModelTable/ModelTable";
import Page from "Common/UI/Components/Page/Page";
import FieldType from "Common/UI/Components/Types/FieldType";
import GlobalEvents from "Common/UI/Utils/GlobalEvents";
import ModelAPI, { RequestOptions } from "Common/UI/Utils/ModelAPI/ModelAPI";
import Navigation from "Common/UI/Utils/Navigation";
import User from "Common/UI/Utils/User";
import TeamMember from "Common/Models/DatabaseModels/TeamMember";
import React, { FunctionComponent, ReactElement } from "react";

const Home: FunctionComponent<PageComponentProps> = (): ReactElement => {
  return (
    <Page
      title={"Project Invitations"}
      breadcrumbLinks={[
        {
          title: "Home",
          to: RouteUtil.populateRouteParams(RouteMap[PageMap.HOME] as Route),
        },
        {
          title: "Project Invitations",
          to: RouteUtil.populateRouteParams(
            RouteMap[PageMap.PROJECT_INVITATIONS] as Route,
          ),
        },
      ]}
    >
      <ModelTable<TeamMember>
        modelType={TeamMember}
        name="Project Invitations"
        id="team-member-table"
        userPreferencesKey="project-invitations-table"
        isDeleteable={true}
        query={{
          userId: User.getUserId(),
          hasAcceptedInvitation: false,
        }}
        fetchRequestOptions={
          {
            isMultiTenantRequest: true,
          } as RequestOptions
        }
        deleteRequestOptions={
          {
            isMultiTenantRequest: true,
          } as RequestOptions
        }
        isEditable={false}
        showRefreshButton={true}
        isCreateable={false}
        isViewable={false}
        cardProps={{
          title: "Pending Invitations",
          description:
            "Here is a list of projects and teams you have been invited to.",
        }}
        noItemsMessage={"No project or team invitations for you so far."}
        singularName="Project Invitation"
        pluralName="Project Invitations"
        onItemDeleted={() => {
          GlobalEvents.dispatchEvent(EventName.PROJECT_INVITATIONS_REFRESH);
        }}
        actionButtons={[
          {
            title: "Accept",
            buttonStyleType: ButtonStyleType.SUCCESS_OUTLINE,
            icon: IconProp.Check,
            onClick: async (
              item: TeamMember,
              onCompleteAction: VoidFunction,
              onError: ErrorFunction,
            ) => {
              try {
                // accept invite.
                await ModelAPI.updateById({
                  modelType: TeamMember,
                  id: new ObjectID(item["_id"] ? item["_id"].toString() : ""),
                  data: {
                    hasAcceptedInvitation: true,
                    invitationAcceptedAt: new Date(),
                  },

                  requestOptions: {
                    isMultiTenantRequest: true,
                  },
                });

                onCompleteAction();
                Navigation.reload();
              } catch (err) {
                GlobalEvents.dispatchEvent(
                  EventName.PROJECT_INVITATIONS_REFRESH,
                );
                onCompleteAction();
                onError(err as Error);
              }
            },
          },
        ]}
        deleteButtonText="Reject"
        filters={[
          {
            field: {
              project: {
                name: true,
              },
            },
            type: FieldType.Text,
            title: "Project",
          },
          {
            field: {
              team: {
                name: true,
              },
            },
            type: FieldType.Text,
            title: "Team",
          },
        ]}
        columns={[
          {
            field: {
              project: {
                name: true,
              },
            },
            title: "Project Invited to",
            type: FieldType.Text,
            selectedProperty: "name",
          },
          {
            field: {
              team: {
                name: true,
              },
            },
            title: "Team Invited to",
            type: FieldType.Text,
            selectedProperty: "name",
          },
        ]}
      />
    </Page>
  );
};

export default Home;
