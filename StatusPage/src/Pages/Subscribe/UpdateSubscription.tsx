import Page from "../../Components/Page/Page";
import API from "../../Utils/API";
import { STATUS_PAGE_API_URL } from "../../Utils/Config";
import StatusPageUtil from "../../Utils/StatusPage";
import { SubscribePageProps } from "./SubscribePageUtils";
import URL from "Common/Types/API/URL";
import BadDataException from "Common/Types/Exception/BadDataException";
import { PromiseVoidFunction } from "Common/Types/FunctionTypes";
import ObjectID from "Common/Types/ObjectID";
import Card from "Common/UI/Components/Card/Card";
import { CategoryCheckboxOptionsAndCategories } from "Common/UI/Components/CategoryCheckbox/Index";
import ErrorMessage from "Common/UI/Components/ErrorMessage/ErrorMessage";
import ModelForm, {
  FormType,
  ModelField,
} from "Common/UI/Components/Forms/ModelForm";
import FormFieldSchemaType from "Common/UI/Components/Forms/Types/FormFieldSchemaType";
import FormValues from "Common/UI/Components/Forms/Types/FormValues";
import PageLoader from "Common/UI/Components/Loader/PageLoader";
import LocalStorage from "Common/UI/Utils/LocalStorage";
import Navigation from "Common/UI/Utils/Navigation";
import SubscriberUtil from "Common/UI/Utils/StatusPage";
import StatusPageSubscriber from "Common/Models/DatabaseModels/StatusPageSubscriber";
import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState,
} from "react";

const SubscribePage: FunctionComponent<SubscribePageProps> = (
  props: SubscribePageProps,
): ReactElement => {
  const statusPageSubscriberId: string | undefined =
    Navigation.getLastParamAsObjectID().toString();

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const statusPageId: ObjectID = LocalStorage.getItem(
    "statusPageId",
  ) as ObjectID;

  const updateApiUrl: URL = URL.fromString(
    URL.fromString(STATUS_PAGE_API_URL.toString())
      .addRoute(`/update-subscription/${statusPageId.toString()}`)
      .addRoute("/" + statusPageSubscriberId.toString())
      .toString(),
  );

  const getSubscriptionUrl: URL = URL.fromString(
    URL.fromString(STATUS_PAGE_API_URL.toString())
      .addRoute(`/get-subscription/${statusPageId.toString()}`)
      .addRoute("/" + statusPageSubscriberId.toString())
      .toString(),
  );

  const [
    categoryCheckboxOptionsAndCategories,
    setCategoryCheckboxOptionsAndCategories,
  ] = useState<CategoryCheckboxOptionsAndCategories>({
    categories: [],
    options: [],
  });

  const [isLaoding, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchCheckboxOptionsAndCategories: PromiseVoidFunction =
    async (): Promise<void> => {
      try {
        setIsLoading(true);

        const result: CategoryCheckboxOptionsAndCategories =
          await SubscriberUtil.getCategoryCheckboxPropsBasedOnResources(
            statusPageId,
            URL.fromString(STATUS_PAGE_API_URL.toString()).addRoute(
              `/resources/${statusPageId.toString()}`,
            ),
          );

        setCategoryCheckboxOptionsAndCategories(result);
      } catch (err) {
        setError(API.getFriendlyMessage(err));
      }

      setIsLoading(false);
    };

  useEffect(() => {
    fetchCheckboxOptionsAndCategories().catch((error: Error) => {
      setError(error.message);
    });
  }, []);

  if (!statusPageId) {
    throw new BadDataException("Status Page ID is required");
  }

  if (!statusPageSubscriberId) {
    throw new BadDataException("Status Page Subscriber ID is required");
  }

  StatusPageUtil.checkIfUserHasLoggedIn();

  const fields: Array<ModelField<StatusPageSubscriber>> = [
    {
      field: {
        subscriberEmail: true,
      },
      showEvenIfPermissionDoesNotExist: true,
      title: "Your Email",
      fieldType: FormFieldSchemaType.Email,
      required: (model: FormValues<StatusPageSubscriber>) => {
        return model && Boolean(model.subscriberEmail);
      },
      disabled: true,
      placeholder: "subscriber@company.com",
      showIf: (model: FormValues<StatusPageSubscriber>) => {
        return model && Boolean(model.subscriberEmail);
      },
    },
    {
      field: {
        slackWorkspaceName: true,
      },
      showEvenIfPermissionDoesNotExist: true,
      title: "Slack Workspace Name",
      fieldType: FormFieldSchemaType.Text,
      required: (model: FormValues<StatusPageSubscriber>) => {
        return model && Boolean(model.slackWorkspaceName);
      },
      disabled: true,
      placeholder: "your-slack-workspace-name",
      showIf: (model: FormValues<StatusPageSubscriber>) => {
        return model && Boolean(model.slackWorkspaceName);
      },
    },
    {
      field: {
        subscriberPhone: true,
      },
      showEvenIfPermissionDoesNotExist: true,
      title: "Your Phone Number",
      fieldType: FormFieldSchemaType.Email,
      required: (model: FormValues<StatusPageSubscriber>) => {
        return model && Boolean(model.subscriberPhone);
      },
      placeholder: "+11234567890",
      disabled: true,
      showIf: (model: FormValues<StatusPageSubscriber>) => {
        return model && Boolean(model.subscriberPhone);
      },
    },
  ];

  if (props.allowSubscribersToChooseResources) {
    fields.push({
      field: {
        isSubscribedToAllResources: true,
      },
      showEvenIfPermissionDoesNotExist: true,
      title: "Subscribe to All Resources",
      description:
        "Select this option if you want to subscribe to all resources.",
      fieldType: FormFieldSchemaType.Checkbox,
      required: false,
      defaultValue: true,
    });

    fields.push({
      field: {
        statusPageResources: true,
      },
      showEvenIfPermissionDoesNotExist: true,
      title: "Select Resources to Subscribe",
      description: "Please select the resources you want to subscribe to.",
      fieldType: FormFieldSchemaType.CategoryCheckbox,
      required: false,
      categoryCheckboxProps: categoryCheckboxOptionsAndCategories,
      showIf: (model: FormValues<StatusPageSubscriber>) => {
        return !model || !model.isSubscribedToAllResources;
      },
    });
  }

  if (props.allowSubscribersToChooseEventTypes) {
    fields.push({
      field: {
        isSubscribedToAllEventTypes: true,
      },
      title: "Subscribe to All Event Types",
      description:
        "Select this option if you want to subscribe to all event types.",
      fieldType: FormFieldSchemaType.Checkbox,
      required: false,
      defaultValue: true,
    });

    fields.push({
      field: {
        statusPageEventTypes: true,
      },
      title: "Select Event Types to Subscribe",
      description: "Please select the event types you want to subscribe to.",
      fieldType: FormFieldSchemaType.MultiSelectDropdown,
      required: false,
      dropdownOptions: SubscriberUtil.getDropdownPropsBasedOnEventTypes(),
      showIf: (model: FormValues<StatusPageSubscriber>) => {
        return !model || !model.isSubscribedToAllEventTypes;
      },
    });
  }

  fields.push({
    field: {
      isUnsubscribed: true,
    },
    showEvenIfPermissionDoesNotExist: true,
    title: "Unsubscribe",
    description:
      "Please select this if you would like to unsubscribe from all resources.",
    fieldType: FormFieldSchemaType.Toggle,
    required: false,
  });

  return (
    <Page>
      {isLaoding ? <PageLoader isVisible={isLaoding} /> : <></>}

      {error ? <ErrorMessage message={error} /> : <></>}

      {!isLaoding && !error ? (
        <div className="justify-center">
          <div>
            {isSuccess && (
              <p className="text-center text-gray-400 mb-20 mt-20">
                {" "}
                Your changes have been saved.{" "}
              </p>
            )}

            {!isSuccess ? (
              <div className="">
                <Card
                  title="Update Subscription"
                  description={
                    "You can update your subscription preferences or unsubscribe here."
                  }
                >
                  <ModelForm<StatusPageSubscriber>
                    modelType={StatusPageSubscriber}
                    id="email-form"
                    name="Status Page > Update Subscription"
                    fields={fields}
                    createOrUpdateApiUrl={updateApiUrl}
                    requestHeaders={API.getDefaultHeaders(
                      StatusPageUtil.getStatusPageId()!,
                    )}
                    fetchItemApiUrl={getSubscriptionUrl}
                    formType={FormType.Update}
                    modelIdToEdit={new ObjectID(statusPageSubscriberId)}
                    submitButtonText={"Update Subscription"}
                    onSuccess={() => {
                      setIsSuccess(true);
                    }}
                    maxPrimaryButtonWidth={true}
                  />
                </Card>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </Page>
  );
};

export default SubscribePage;
