import { LOGIN_API_URL } from "../../Utils/ApiPaths";
import LoginUtil from "../../Utils/Login";
import PageMap from "../../Utils/PageMap";
import RouteMap, { RouteUtil } from "../../Utils/RouteMap";
import StatusPageUtil from "../../Utils/StatusPage";
import UserUtil from "../../Utils/User";
import Route from "Common/Types/API/Route";
import URL from "Common/Types/API/URL";
import BadDataException from "Common/Types/Exception/BadDataException";
import { JSONObject } from "Common/Types/JSON";
import ObjectID from "Common/Types/ObjectID";
import ModelForm, { FormType } from "Common/UI/Components/Forms/ModelForm";
import FormFieldSchemaType from "Common/UI/Components/Forms/Types/FormFieldSchemaType";
import Link from "Common/UI/Components/Link/Link";
import { FILE_URL } from "Common/UI/Config";
import Navigation from "Common/UI/Utils/Navigation";
import StatusPagePrivateUser from "Common/Models/DatabaseModels/StatusPagePrivateUser";
import React, { FunctionComponent, useEffect } from "react";

export interface ComponentProps {
  statusPageName: string;
  logoFileId: ObjectID;
  forceSSO: boolean;
  hasEnabledSSOConfig: boolean;
}

const LoginPage: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
) => {
  useEffect(() => {
    if (props.forceSSO && StatusPageUtil.getStatusPageId()) {
      if (Navigation.getQueryStringByName("redirectUrl")) {
        // forward redirect url to sso page

        const navRoute: Route = new Route(
          (!StatusPageUtil.isPreviewPage()
            ? RouteUtil.populateRouteParams(
                RouteMap[PageMap.SSO]!,
                StatusPageUtil.getStatusPageId()!,
              )
            : RouteUtil.populateRouteParams(
                RouteMap[PageMap.PREVIEW_SSO]!,
                StatusPageUtil.getStatusPageId()!,
              )
          ).toString() +
            `?redirectUrl=${Navigation.getQueryStringByName("redirectUrl")}`,
        );

        Navigation.navigate(navRoute);
      } else {
        const navRoute: Route = !StatusPageUtil.isPreviewPage()
          ? RouteUtil.populateRouteParams(
              RouteMap[PageMap.SSO]!,
              StatusPageUtil.getStatusPageId()!,
            )
          : RouteUtil.populateRouteParams(
              RouteMap[PageMap.PREVIEW_SSO]!,
              StatusPageUtil.getStatusPageId()!,
            );

        Navigation.navigate(navRoute);
      }
    }
  }, [props.forceSSO, StatusPageUtil.getStatusPageId()]);

  const apiUrl: URL = LOGIN_API_URL;

  if (!StatusPageUtil.getStatusPageId()) {
    return <></>;
  }

  if (!StatusPageUtil.isPrivateStatusPage()) {
    const navRoute: Route = new Route(
      StatusPageUtil.isPreviewPage()
        ? `/status-page/${StatusPageUtil.getStatusPageId()?.toString()}`
        : "/",
    );

    Navigation.navigate(navRoute);
  }

  if (
    StatusPageUtil.getStatusPageId() &&
    UserUtil.isLoggedIn(StatusPageUtil.getStatusPageId()!)
  ) {
    if (Navigation.getQueryStringByName("redirectUrl")) {
      Navigation.navigate(
        new Route(Navigation.getQueryStringByName("redirectUrl")!),
      );
    } else {
      const navRoute: Route = new Route(
        StatusPageUtil.isPreviewPage()
          ? `/status-page/${StatusPageUtil.getStatusPageId()?.toString()}`
          : "/",
      );

      Navigation.navigate(navRoute);
    }
  }

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {props.logoFileId && props.logoFileId.toString() ? (
          <img
            style={{ height: "70px", margin: "auto" }}
            src={`${URL.fromString(FILE_URL.toString()).addRoute(
              "/image/" + props.logoFileId.toString(),
            )}`}
          />
        ) : (
          <></>
        )}
        <h2 className="mt-6 text-center text-2xl  tracking-tight text-gray-900">
          Welcome back!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please login to view {props.statusPageName || "Status Page"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ModelForm<StatusPagePrivateUser>
            modelType={StatusPagePrivateUser}
            id="login-form"
            name="Status Page Login"
            fields={[
              {
                field: {
                  email: true,
                },
                showEvenIfPermissionDoesNotExist: true,
                title: "Email",
                fieldType: FormFieldSchemaType.Email,
                required: true,
                disableSpellCheck: true,
              },
              {
                field: {
                  password: true,
                },
                title: "Password",
                required: true,
                showEvenIfPermissionDoesNotExist: true,
                validation: {
                  minLength: 6,
                },
                fieldType: FormFieldSchemaType.Password,
                sideLink: {
                  text: "Forgot password?",
                  url: new Route(
                    StatusPageUtil.isPreviewPage()
                      ? `/status-page/${StatusPageUtil.getStatusPageId()?.toString()}/forgot-password`
                      : "/forgot-password",
                  ),
                  openLinkInNewTab: false,
                },
              },
            ]}
            createOrUpdateApiUrl={apiUrl}
            formType={FormType.Create}
            submitButtonText={"Login"}
            onSuccess={(
              value: StatusPagePrivateUser,
              miscData: JSONObject | undefined,
            ) => {
              LoginUtil.login({
                user: value,
                token: miscData ? miscData["token"] : undefined,
              });

              if (Navigation.getQueryStringByName("redirectUrl")) {
                Navigation.navigate(
                  new Route(Navigation.getQueryStringByName("redirectUrl")!),
                );
              } else {
                Navigation.navigate(
                  new Route(
                    StatusPageUtil.isPreviewPage()
                      ? `/status-page/${StatusPageUtil.getStatusPageId()?.toString()}/`
                      : "/",
                  ),
                );
              }
            }}
            onBeforeCreate={(
              item: StatusPagePrivateUser,
            ): Promise<StatusPagePrivateUser> => {
              if (!StatusPageUtil.getStatusPageId()) {
                throw new BadDataException("Status Page ID not found");
              }

              item.statusPageId = StatusPageUtil.getStatusPageId()!;
              return Promise.resolve(item);
            }}
            maxPrimaryButtonWidth={true}
            footer={
              <div className="actions pointer text-center mt-4 hover:underline fw-semibold">
                {props.hasEnabledSSOConfig ? (
                  <p>
                    <Link
                      to={
                        new Route(
                          StatusPageUtil.isPreviewPage()
                            ? `/status-page/${StatusPageUtil.getStatusPageId()?.toString()}/sso`
                            : "/sso",
                        )
                      }
                      className="text-indigo-500 hover:text-indigo-900 cursor-pointer text-sm"
                    >
                      Use single sign-on (SSO) instead
                    </Link>
                  </p>
                ) : (
                  <></>
                )}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
