import BaseModel from "../../../Models/DatabaseModels/DatabaseBaseModel/DatabaseBaseModel";

export type SelectPropertyOptions<T> = boolean | SelectOptions<T> | undefined;

/**
 * Select find options.
 */

export declare type SelectOptions<Entity> = {
  [P in keyof Entity]?: SelectPropertyOptions<any>;
};

type Select<TBaseModel extends BaseModel> = SelectOptions<TBaseModel>;
export default Select;
