import API from "../../Utils/API/API";
import ModelAPI from "../../Utils/ModelAPI/ModelAPI";
import Page from "./Page";
import BaseModel from "../../../Models/DatabaseModels/DatabaseBaseModel/DatabaseBaseModel";
import { PromiseVoidFunction } from "../../../Types/FunctionTypes";
import Link from "../../../Types/Link";
import ObjectID from "../../../Types/ObjectID";
import React, { ReactElement, useState } from "react";
import useAsyncEffect from "use-async-effect";

export interface ComponentProps<TBaseModel extends BaseModel> {
  title?: string | undefined;
  breadcrumbLinks?: Array<Link> | undefined;
  children: Array<ReactElement> | ReactElement;
  sideMenu?: undefined | ReactElement;
  className?: string | undefined;
  modelType: { new (): TBaseModel };
  modelId: ObjectID;
  modelNameField: string;
}

const ModelPage: <TBaseModel extends BaseModel>(
  props: ComponentProps<TBaseModel>,
) => ReactElement = <TBaseModel extends BaseModel>(
  props: ComponentProps<TBaseModel>,
): ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  const fetchItem: PromiseVoidFunction = async (): Promise<void> => {
    // get item.
    setIsLoading(true);

    setError("");
    try {
      const item: TBaseModel | null = await ModelAPI.getItem({
        modelType: props.modelType,
        id: props.modelId,
        select: {
          [props.modelNameField]: true,
        } as any,
        requestOptions: {},
      });

      if (!item) {
        setError(
          `Cannot load ${(
            new props.modelType()?.singularName || "item"
          ).toLowerCase()}. It could be because you don't have enough permissions to read this ${(
            new props.modelType()?.singularName || "item"
          ).toLowerCase()}.`,
        );

        return;
      }

      setTitle(
        `${props.title || ""} - ${
          (item as any)[props.modelNameField] as string
        }`,
      );
    } catch (err) {
      setError(API.getFriendlyMessage(err));
    }
    setIsLoading(false);
  };

  const [title, setTitle] = useState<string | undefined>(props.title);

  useAsyncEffect(async () => {
    // fetch the model
    await fetchItem();
  }, []);

  return <Page {...props} isLoading={isLoading} error={error} title={title} />;
};

export default ModelPage;
