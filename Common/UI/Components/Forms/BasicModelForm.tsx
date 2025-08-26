import { ButtonStyleType } from "../Button/Button";
import BasicForm, {
  DefaultValidateFunction,
  FormErrors,
  FormProps,
  FormSummaryConfig,
} from "./BasicForm";
import Fields from "./Types/Fields";
import { FormStep } from "./Types/FormStep";
import FormValues from "./Types/FormValues";
import BaseModel from "../../../Models/DatabaseModels/DatabaseBaseModel/DatabaseBaseModel";
import React, {
  MutableRefObject,
  ReactElement,
  useEffect,
  useState,
} from "react";

export interface ComponentProps<TBaseModel extends BaseModel> {
  model: TBaseModel;
  id: string;
  onSubmit: (
    values: FormValues<TBaseModel>,
    onSubmitSuccessful: () => void,
  ) => void;
  onChange?:
    | undefined
    | ((
        values: FormValues<TBaseModel>,
        setNewFormValues: (newValues: FormValues<TBaseModel>) => void,
      ) => void);
  onValidate?:
    | undefined
    | ((values: FormValues<TBaseModel>) => FormErrors<FormValues<TBaseModel>>);
  fields: Fields<TBaseModel>;
  submitButtonText?: undefined | string;
  submitButtonStyleType?: ButtonStyleType | undefined;
  name?: string | undefined;
  steps?: undefined | Array<FormStep<TBaseModel>>;
  onIsLastFormStep?: undefined | ((isLastFormStep: boolean) => void);
  onFormStepChange?: undefined | ((stepId: string) => void);
  title?: undefined | string;
  description?: undefined | string;
  showAsColumns?: undefined | number;
  disableAutofocus?: undefined | boolean;
  footer?: ReactElement | undefined;
  isLoading?: undefined | boolean;
  onCancel?: undefined | (() => void);
  cancelButtonText?: undefined | string;
  maxPrimaryButtonWidth?: undefined | boolean;
  error: string | null;
  hideSubmitButton?: undefined | boolean;
  formRef?: undefined | MutableRefObject<FormProps<FormValues<TBaseModel>>>;
  initialValues?: FormValues<TBaseModel> | undefined;
  summary?: FormSummaryConfig | undefined;
  values?: FormValues<TBaseModel> | undefined;
}

const BasicModelForm: <TBaseModel extends BaseModel>(
  props: ComponentProps<TBaseModel>,
) => ReactElement = <TBaseModel extends BaseModel>(
  props: ComponentProps<TBaseModel>,
): ReactElement => {
  const [formFields, setFormFields] = useState<Fields<TBaseModel>>([]);

  let initialValues: FormValues<TBaseModel> = {};

  if (props.initialValues) {
    initialValues = { ...props.initialValues };
  }

  useEffect(() => {
    const fields: Fields<TBaseModel> = [];
    // Prep
    for (const field of props.fields) {
      if (Object.keys(field.field || {}).length > 0) {
        if (
          props.model.getDisplayColumnTitleAs(
            Object.keys(field.field || {})[0] as string,
          ) &&
          !field.title
        ) {
          field.title = props.model.getDisplayColumnTitleAs(
            Object.keys(field.field || {})[0] as string,
          ) as string;
        }

        if (
          props.model.getDisplayColumnDescriptionAs(
            Object.keys(field.field || {})[0] as string,
          ) &&
          !field.description
        ) {
          field.description = props.model.getDisplayColumnDescriptionAs(
            Object.keys(field.field || {})[0] as string,
          ) as string;
        }
      }

      fields.push(field);
    }

    setFormFields(fields);
  }, [props.fields]);

  return (
    <BasicForm
      values={props.values}
      isLoading={props.isLoading || false}
      fields={formFields}
      id={props.id}
      onChange={props.onChange}
      onValidate={props.onValidate ? props.onValidate : DefaultValidateFunction}
      disableAutofocus={props.disableAutofocus}
      steps={props.steps}
      name={props.name}
      onFormStepChange={props.onFormStepChange}
      submitButtonStyleType={props.submitButtonStyleType}
      onSubmit={props.onSubmit}
      initialValues={initialValues}
      submitButtonText={props.submitButtonText || "Save"}
      title={props.title || ""}
      description={props.description || ""}
      footer={props.footer}
      showAsColumns={props.showAsColumns || 1}
      onCancel={props.onCancel}
      cancelButtonText={props.cancelButtonText}
      maxPrimaryButtonWidth={props.maxPrimaryButtonWidth || false}
      error={props.error}
      onIsLastFormStep={props.onIsLastFormStep}
      hideSubmitButton={props.hideSubmitButton}
      ref={props.formRef}
      summary={props.summary}
    ></BasicForm>
  );
};

export default BasicModelForm;
