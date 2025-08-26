import CompareBase, { CompareType } from "../Database/CompareBase";
import OneUptimeDate from "../Date";
import BadDataException from "../Exception/BadDataException";
import { JSONObject, ObjectType } from "../JSON";

export default class LessThanOrEqual<
  T extends CompareType,
> extends CompareBase<T> {
  public constructor(value: T) {
    super(value);
  }

  public override toJSON(): JSONObject {
    return {
      _type: ObjectType.LessThanOrEqual,
      value: (this as LessThanOrEqual<T>).toString(),
    };
  }

  public override toString(): string {
    let value: T = this.value;

    if (value instanceof Date) {
      value = OneUptimeDate.asDateForDatabaseQuery(value) as T;
    }

    return value.toString();
  }

  public static override fromJSON<T extends CompareType>(
    json: JSONObject,
  ): LessThanOrEqual<T> {
    if (json["_type"] === ObjectType.LessThanOrEqual) {
      return new LessThanOrEqual<T>(json["value"] as T);
    }

    throw new BadDataException("Invalid JSON: " + JSON.stringify(json));
  }
}
