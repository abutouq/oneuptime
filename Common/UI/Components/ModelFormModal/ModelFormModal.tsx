import ModelAPI from "../../Utils/ModelAPI/ModelAPI";
import Alert, { AlertType } from "../Alerts/Alert";
import { ButtonStyleType } from "../Button/Button";
import ButtonType from "../Button/ButtonTypes";
import { FormProps } from "../Forms/BasicForm";
import ModelForm, {
  ComponentProps as ModelFormComponentProps,
} from "../Forms/ModelForm";
import FormValues from "../Forms/Types/FormValues";
import Modal, { ModalWidth } from "../Modal/Modal";
import BaseModel from "../../../Models/DatabaseModels/DatabaseBaseModel/DatabaseBaseModel";
import { JSONObject } from "../../../Types/JSON";
import ObjectID from "../../../Types/ObjectID";
import React, { MutableRefObject, ReactElement, useRef, useState } from "react";

export interface ComponentProps<TBaseModel extends BaseModel> {
  title: string;
  description?: string | undefined;
  modelAPI?: typeof ModelAPI | undefined;
  name?: string | undefined;
  modelType: { new (): TBaseModel };
  initialValues?: FormValues<TBaseModel> | undefined;
  onClose?: undefined | (() => void);
  submitButtonText?: undefined | string;
  modalWidth?: ModalWidth | undefined;
  onSuccess?: undefined | ((data: TBaseModel) => void);
  submitButtonStyleType?: undefined | ButtonStyleType;
  formProps: ModelFormComponentProps<TBaseModel>;
  modelIdToEdit?: ObjectID | undefined;
  onBeforeCreate?:
    | ((item: TBaseModel, miscDataProps: JSONObject) => Promise<TBaseModel>)
    | undefined;
  footer?: ReactElement | undefined;
  formRef?: undefined | MutableRefObject<FormProps<FormValues<TBaseModel>>>;
}

const ModelFormModal: <TBaseModel extends BaseModel>(
  props: ComponentProps<TBaseModel>,
) => ReactElement = <TBaseModel extends BaseModel>(
  props: ComponentProps<TBaseModel>,
): ReactElement => {
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false);

  const [submitButtonText, setSubmitButtonText] = useState<string>(
    props.submitButtonText || "Save",
  );

  const formRef: MutableRefObject<FormProps<FormValues<TBaseModel>>> =
    props.formRef ||
    (useRef<FormProps<FormValues<TBaseModel>>>(null) as MutableRefObject<
      FormProps<FormValues<TBaseModel>>
    >);

  const [error, setError] = useState<string>("");

  let modalWidth: ModalWidth = props.modalWidth || ModalWidth.Normal;

  if (props.formProps.steps && props.formProps.steps.length > 0) {
    modalWidth = props.modalWidth || ModalWidth.Medium;
  }

  return (
    <Modal
      {...props}
      submitButtonText={submitButtonText}
      modalWidth={modalWidth}
      submitButtonType={ButtonType.Submit}
      isLoading={isFormLoading}
      description={props.description}
      disableSubmitButton={isFormLoading}
      onSubmit={async () => {
        await formRef.current?.submitForm();
      }}
      error={error}
    >
      {!error ? (
        <>
          <ModelForm<TBaseModel>
            {...props.formProps}
            name={props.name}
            modelAPI={props.modelAPI}
            modelType={props.modelType}
            onIsLastFormStep={(isLastFormStep: boolean) => {
              if (isLastFormStep) {
                setSubmitButtonText(props.submitButtonText || "Save");
              } else {
                setSubmitButtonText("Next");
              }
            }}
            modelIdToEdit={props.modelIdToEdit}
            hideSubmitButton={true}
            formRef={formRef}
            onLoadingChange={(isFormLoading: boolean) => {
              setIsFormLoading(isFormLoading);
            }}
            initialValues={props.initialValues}
            onSuccess={(data: TBaseModel) => {
              if (props.onSuccess) {
                props.onSuccess(
                  BaseModel.fromJSONObject(data as TBaseModel, props.modelType),
                );
              }
            }}
            onError={(error: string) => {
              setError(error);
            }}
            onBeforeCreate={props.onBeforeCreate}
          />

          {props.footer}
        </>
      ) : (
        <></>
      )}

      {error ? <Alert title={error} type={AlertType.DANGER} /> : <></>}
    </Modal>
  );
};

export default ModelFormModal;
