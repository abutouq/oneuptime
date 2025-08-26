import { JSONObject } from "../../Types/JSON";
import JSONFunctions from "../../Types/JSONFunctions";

export default class JsonWebToken {
  public static decode(token: string): JSONObject | null {
    if (token && token.includes(".")) {
      return JSONFunctions.parseJSONObject(
        window.atob(token.split(".")[1] as string),
      );
    }

    return null;
  }
}
