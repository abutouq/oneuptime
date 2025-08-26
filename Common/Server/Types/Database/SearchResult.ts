import BaseModel from "../../../Models/DatabaseModels/DatabaseBaseModel/DatabaseBaseModel";
import PositiveNumber from "../../../Types/PositiveNumber";

export default interface SearchResult<TBaseModel extends BaseModel> {
  items: Array<TBaseModel>;
  count: PositiveNumber;
}
