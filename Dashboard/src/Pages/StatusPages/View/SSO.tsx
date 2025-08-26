import PageComponentProps from "../../PageComponentProps";
import URL from "Common/Types/API/URL";
import BadDataException from "Common/Types/Exception/BadDataException";
import { VoidFunction } from "Common/Types/FunctionTypes";
import ObjectID from "Common/Types/ObjectID";
import DigestMethod from "Common/Types/SSO/DigestMethod";
import SignatureMethod from "Common/Types/SSO/SignatureMethod";
import Banner from "Common/UI/Components/Banner/Banner";
import { ButtonStyleType } from "Common/UI/Components/Button/Button";
import Card from "Common/UI/Components/Card/Card";
import FormFieldSchemaType from "Common/UI/Components/Forms/Types/FormFieldSchemaType";
import ConfirmModal from "Common/UI/Components/Modal/ConfirmModal";
import CardModelDetail from "Common/UI/Components/ModelDetail/CardModelDetail";
import ModelTable from "Common/UI/Components/ModelTable/ModelTable";
import FieldType from "Common/UI/Components/Types/FieldType";
import {
  HOST,
  HTTP_PROTOCOL,
  IDENTITY_URL,
  STATUS_PAGE_URL,
} from "Common/UI/Config";
import DropdownUtil from "Common/UI/Utils/Dropdown";
import Navigation from "Common/UI/Utils/Navigation";
import StatusPage from "Common/Models/DatabaseModels/StatusPage";
import StatusPageSSO from "Common/Models/DatabaseModels/StatusPageSso";
import React, {
  Fragment,
  FunctionComponent,
  ReactElement,
  useState,
} from "react";
import Link from "Common/UI/Components/Link/Link";
import ProjectUtil from "Common/UI/Utils/Project";

const SSOPage: FunctionComponent<PageComponentProps> = (
  props: PageComponentProps,
): ReactElement => {
  const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

  const [showSingleSignOnUrlId, setShowSingleSignOnUrlId] =
    useState<string>("");
  return (
    <Fragment>
      <>
        <Banner
          openInNewTab={true}
          title="Need help with configuring SSO?"
          description="Watch this 10 minute video which will help you get set up"
          link={URL.fromString("https://youtu.be/F_h74p38SU0")}
          hideOnMobile={true}
        />

        <ModelTable<StatusPageSSO>
          modelType={StatusPageSSO}
          userPreferencesKey={"status-page-sso-table"}
          query={{
            projectId: ProjectUtil.getCurrentProjectId()!,
            statusPageId: modelId.toString(),
          }}
          onBeforeCreate={(item: StatusPageSSO): Promise<StatusPageSSO> => {
            if (!props.currentProject || !props.currentProject._id) {
              throw new BadDataException("Project ID cannot be null");
            }

            item.statusPageId = modelId;
            item.projectId = new ObjectID(props.currentProject._id);

            return Promise.resolve(item);
          }}
          id="sso-table"
          name="Status Pages > Status Page View > Project SSO"
          isDeleteable={true}
          isEditable={true}
          isCreateable={true}
          cardProps={{
            title: "Single Sign On (SSO)",
            description:
              "Single sign-on is an authentication scheme that allows a user to log in with a single ID to any of several related, yet independent, software systems.",
          }}
          noItemsMessage={"No SSO configuration found."}
          viewPageRoute={Navigation.getCurrentRoute()}
          formSteps={[
            {
              title: "Basic Info",
              id: "basic",
            },
            {
              title: "Sign On",
              id: "sign-on",
            },
            {
              title: "Certificate",
              id: "certificate",
            },
            {
              title: "More",
              id: "more",
            },
          ]}
          formFields={[
            {
              field: {
                name: true,
              },
              title: "Name",
              fieldType: FormFieldSchemaType.Text,
              required: true,
              description: "Friendly name to help you remember.",
              placeholder: "Okta",
              stepId: "basic",
              validation: {
                minLength: 2,
              },
            },
            {
              field: {
                description: true,
              },
              title: "Description",
              fieldType: FormFieldSchemaType.LongText,
              required: true,
              stepId: "basic",
              description: "Friendly description to help you remember.",
              placeholder: "Sign in with Okta",
              validation: {
                minLength: 2,
              },
            },
            {
              field: {
                signOnURL: true,
              },
              title: "Sign On URL",
              fieldType: FormFieldSchemaType.URL,
              required: true,
              description:
                "Members will be forwarded here when signing in to your organization",
              placeholder: "https://yourapp.example.com/apps/appId",
              stepId: "sign-on",
              disableSpellCheck: true,
            },
            {
              field: {
                issuerURL: true,
              },
              title: "Issuer",
              description:
                "Typically a unique URL generated by your SAML identity provider",
              fieldType: FormFieldSchemaType.URL,
              required: true,
              placeholder: "https://example.com",
              stepId: "sign-on",
              disableSpellCheck: true,
            },
            {
              field: {
                publicCertificate: true,
              },
              title: "Public Certificate",
              description: "Paste in your x509 certificate here.",
              fieldType: FormFieldSchemaType.LongText,
              required: true,
              placeholder: "Paste in your x509 certificate here.",
              stepId: "certificate",
            },
            {
              field: {
                signatureMethod: true,
              },
              title: "Signature Method",
              description:
                "If you do not know what this is, please leave this to RSA-SHA256",
              fieldType: FormFieldSchemaType.Dropdown,
              dropdownOptions:
                DropdownUtil.getDropdownOptionsFromEnum(SignatureMethod),
              required: true,
              placeholder: "RSA-SHA256",
              stepId: "certificate",
            },
            {
              field: {
                digestMethod: true,
              },
              title: "Digest Method",
              description:
                "If you do not know what this is, please leave this to SHA256",
              fieldType: FormFieldSchemaType.Dropdown,
              dropdownOptions:
                DropdownUtil.getDropdownOptionsFromEnum(DigestMethod),
              required: true,
              placeholder: "SHA256",
              stepId: "certificate",
            },
            {
              field: {
                isEnabled: true,
              },
              description:
                "You can test this first, before enabling it. To test, please save the config.",
              title: "Enabled",
              fieldType: FormFieldSchemaType.Toggle,
              stepId: "more",
            },
          ]}
          showRefreshButton={true}
          actionButtons={[
            {
              title: "View SSO Config",
              buttonStyleType: ButtonStyleType.NORMAL,
              onClick: async (
                item: StatusPageSSO,
                onCompleteAction: VoidFunction,
              ) => {
                setShowSingleSignOnUrlId((item["_id"] as string) || "");
                onCompleteAction();
              },
            },
          ]}
          filters={[
            {
              field: {
                name: true,
              },
              title: "Name",
              type: FieldType.Text,
            },
            {
              field: {
                description: true,
              },
              title: "Description",
              type: FieldType.Text,
            },
            {
              field: {
                isEnabled: true,
              },
              title: "Enabled",
              type: FieldType.Boolean,
            },
          ]}
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
                description: true,
              },
              title: "Description",
              type: FieldType.Text,
              hideOnMobile: true,
            },

            {
              field: {
                isEnabled: true,
              },
              title: "Enabled",
              type: FieldType.Boolean,
              hideOnMobile: true,
            },
          ]}
        />

        <Card
          title={`Test Single Sign On (SSO)`}
          description={
            <span>
              Here&apos;s a link which will help you test SSO integration before
              you force it on your organization:{" "}
              <Link
                openInNewTab={true}
                to={URL.fromString(
                  `${STATUS_PAGE_URL.toString()}/${modelId}/sso`,
                )}
              >
                <span>{`${STATUS_PAGE_URL.toString()}/${modelId}/sso`}</span>
              </Link>
            </span>
          }
        />

        {/* API Key View  */}
        <CardModelDetail
          name="SSO Settings"
          editButtonText={"Edit Settings"}
          cardProps={{
            title: "SSO Settings",
            description: "Configure settings for SSO.",
          }}
          isEditable={true}
          formFields={[
            {
              field: {
                requireSsoForLogin: true,
              },
              title: "Force SSO for Login",
              description:
                "Please test SSO before you you enable this feature. If SSO is not tested properly then you will be locked out of the project.",
              fieldType: FormFieldSchemaType.Toggle,
            },
          ]}
          modelDetailProps={{
            modelType: StatusPage,
            id: "sso-settings",
            fields: [
              {
                field: {
                  requireSsoForLogin: true,
                },
                fieldType: FieldType.Boolean,
                title: "Force SSO for Login",
                description:
                  "Please test SSO before you enable this feature. If SSO is not tested properly then you will be locked out of the status page.",
              },
            ],
            modelId: modelId,
          }}
        />

        {showSingleSignOnUrlId && (
          <ConfirmModal
            title={`SSO Configuration`}
            description={
              <div>
                <div>
                  <div className="font-semibold">Identifier (Entity ID):</div>

                  <div>{`${HTTP_PROTOCOL}${HOST}/${modelId.toString()}/${showSingleSignOnUrlId}`}</div>
                  <br />
                </div>
                <div>
                  <div className="font-semibold">
                    Reply URL (Assertion Consumer Service URL):
                  </div>
                  <div>
                    {`${URL.fromString(IDENTITY_URL.toString()).addRoute(
                      `/status-page-idp-login/${modelId.toString()}/${showSingleSignOnUrlId}`,
                    )}`}
                  </div>
                  <br />
                </div>
              </div>
            }
            submitButtonText={"Close"}
            onSubmit={() => {
              setShowSingleSignOnUrlId("");
            }}
            submitButtonType={ButtonStyleType.NORMAL}
          />
        )}
      </>
    </Fragment>
  );
};

export default SSOPage;
