import ModelTable from "Common/UI/Components/ModelTable/ModelTable";
import PageMap from "../../../Utils/PageMap";
import RouteMap, { RouteUtil } from "../../../Utils/RouteMap";
import PageComponentProps from "../../PageComponentProps";
import SideMenu from "./SideMenu";
import Route from "Common/Types/API/Route";
import Page from "Common/UI/Components/Page/Page";
import React, { FunctionComponent, ReactElement } from "react";
import UserUtil from "Common/UI/Utils/User";
import UserTwoFactorAuth from "Common/Models/DatabaseModels/UserTwoFactorAuth";
import { ButtonStyleType } from "Common/UI/Components/Button/Button";
import IconProp from "Common/Types/Icon/IconProp";
import FieldType from "Common/UI/Components/Types/FieldType";
import FormFieldSchemaType from "Common/UI/Components/Forms/Types/FormFieldSchemaType";
import BasicFormModal from "Common/UI/Components/FormModal/BasicFormModal";
import QRCodeElement from "Common/UI/Components/QR/QR";
import { JSONObject } from "Common/Types/JSON";
import HTTPResponse from "Common/Types/API/HTTPResponse";
import EmptyResponseData from "Common/Types/API/EmptyResponse";
import HTTPErrorResponse from "Common/Types/API/HTTPErrorResponse";
import API from "Common/UI/Utils/API/API";
import { APP_API_URL } from "Common/UI/Config";
import URL from "Common/Types/API/URL";
import FormValues from "Common/UI/Components/Forms/Types/FormValues";
import { CustomElementProps } from "Common/UI/Components/Forms/Types/Field";
import CardModelDetail from "Common/UI/Components/ModelDetail/CardModelDetail";
import User from "Common/Models/DatabaseModels/User";
import OneUptimeDate from "Common/Types/Date";

const Home: FunctionComponent<PageComponentProps> = (): ReactElement => {
  const [selectedTwoFactorAuth, setSelectedTwoFactorAuth] =
    React.useState<UserTwoFactorAuth | null>(null);
  const [showVerificationModal, setShowVerificationModal] =
    React.useState<boolean>(false);
  const [verificationError, setVerificationError] = React.useState<
    string | null
  >(null);
  const [verificationLoading, setVerificationLoading] =
    React.useState<boolean>(false);

  const [tableRefreshToggle, setTableRefreshToggle] = React.useState<string>(
    OneUptimeDate.getCurrentDate().toString(),
  );

  return (
    <Page
      title={"User Profile"}
      breadcrumbLinks={[
        {
          title: "Home",
          to: RouteUtil.populateRouteParams(RouteMap[PageMap.HOME] as Route),
        },
        {
          title: "User Profile",
          to: RouteUtil.populateRouteParams(
            RouteMap[PageMap.USER_PROFILE_OVERVIEW] as Route,
          ),
        },
        {
          title: "Two Factor Authentication",
          to: RouteUtil.populateRouteParams(
            RouteMap[PageMap.USER_TWO_FACTOR_AUTH] as Route,
          ),
        },
      ]}
      sideMenu={<SideMenu />}
    >
      <div>
        <ModelTable<UserTwoFactorAuth>
          modelType={UserTwoFactorAuth}
          name="Two Factor Authentication"
          id="two-factor-auth-table"
          userPreferencesKey="user-two-factor-auth-table"
          isDeleteable={true}
          refreshToggle={tableRefreshToggle}
          filters={[]}
          query={{
            userId: UserUtil.getUserId(),
          }}
          isEditable={true}
          showRefreshButton={true}
          isCreateable={true}
          isViewable={false}
          cardProps={{
            title: "Two Factor Authentication",
            description: "Manage your two factor authentication settings here.",
          }}
          noItemsMessage={"No two factor authentication found."}
          singularName="Two Factor Authentication"
          pluralName="Two Factor Authentications"
          actionButtons={[
            {
              title: "Verify",
              buttonStyleType: ButtonStyleType.NORMAL,
              icon: IconProp.Check,
              isVisible: (item: UserTwoFactorAuth) => {
                return !item.isVerified;
              },
              onClick: async (
                item: UserTwoFactorAuth,
                onCompleteAction: VoidFunction,
              ) => {
                setSelectedTwoFactorAuth(item);
                setShowVerificationModal(true);
                onCompleteAction();
              },
            },
          ]}
          formFields={[
            {
              field: {
                name: true,
              },
              title: "Name",
              placeholder: "Google Authenticator",
              fieldType: FormFieldSchemaType.Text,
              required: true,
            },
          ]}
          selectMoreFields={{
            twoFactorOtpUrl: true,
          }}
          columns={[
            {
              field: {
                name: true,
              },
              title: "Name",
              type: FieldType.Text,
            },
            {
              field: {
                isVerified: true,
              },
              title: "Is Verified?",
              type: FieldType.Boolean,
            },
          ]}
        />
        {showVerificationModal && selectedTwoFactorAuth ? (
          <BasicFormModal
            title={`Verify ${selectedTwoFactorAuth.name}`}
            description={`Please scan this QR code with your authenticator app and enter the code below. This code works with Google Authenticator.`}
            formProps={{
              error: verificationError || undefined,
              fields: [
                {
                  field: {
                    qr: true,
                  },
                  title: "",
                  required: true,
                  fieldType: FormFieldSchemaType.CustomComponent,
                  getCustomElement: (
                    value: FormValues<JSONObject>,
                    props: CustomElementProps,
                  ) => {
                    if (value && !value["qr"]) {
                      if (props?.onChange) {
                        props.onChange("code"); // set temporary value to trigger validation. This is a hack to make the form valid.
                      }
                    }
                    return (
                      <QRCodeElement
                        text={selectedTwoFactorAuth.twoFactorOtpUrl || ""}
                      />
                    );
                  },
                },
                {
                  field: {
                    code: true,
                  },
                  title: "Code",
                  description:
                    "Please enter the code from your authenticator app.",
                  fieldType: FormFieldSchemaType.Text,
                  required: true,
                },
              ],
            }}
            submitButtonText={"Validate"}
            onClose={() => {
              setShowVerificationModal(false);
              setVerificationError(null);
              setSelectedTwoFactorAuth(null);
            }}
            isLoading={verificationLoading}
            onSubmit={async (values: JSONObject) => {
              try {
                setVerificationLoading(true);
                setVerificationError("");

                // test CallSMS config
                const response:
                  | HTTPResponse<EmptyResponseData>
                  | HTTPErrorResponse = await API.post(
                  URL.fromString(APP_API_URL.toString()).addRoute(
                    `/user-two-factor-auth/validate`,
                  ),
                  {
                    code: values["code"],
                    id: selectedTwoFactorAuth.id?.toString(),
                  },
                );
                if (response.isSuccess()) {
                  setShowVerificationModal(false);
                  setVerificationError(null);
                  setSelectedTwoFactorAuth(null);
                  setVerificationLoading(false);
                }

                if (response instanceof HTTPErrorResponse) {
                  throw response;
                }

                setTableRefreshToggle(
                  OneUptimeDate.getCurrentDate().toString(),
                );
              } catch (err) {
                setVerificationError(API.getFriendlyMessage(err));
                setVerificationLoading(false);
              }

              setVerificationLoading(false);
            }}
          />
        ) : (
          <></>
        )}
      </div>
      <CardModelDetail<User>
        cardProps={{
          title: "Enable Two Factor Authentication",
          description: "Enable two factor authentication for your account.",
        }}
        name="User Profile > Enable Two Factor Authentication"
        isEditable={true}
        editButtonText="Edit"
        formFields={[
          {
            field: {
              enableTwoFactorAuth: true,
            },
            fieldType: FormFieldSchemaType.Toggle,
            placeholder: "No",
            required: true,
            title: "Enable Two Factor Authentication",
            description: "Enable two factor authentication for your account.",
          },
        ]}
        modelDetailProps={{
          showDetailsInNumberOfColumns: 1,
          modelType: User,
          id: "user-profile",
          fields: [
            {
              field: {
                enableTwoFactorAuth: true,
              },
              fieldType: FieldType.Boolean,
              title: "Enable Two Factor Authentication",
              placeholder: "No",
            },
          ],

          modelId: UserUtil.getUserId(),
        }}
      />
    </Page>
  );
};

export default Home;
