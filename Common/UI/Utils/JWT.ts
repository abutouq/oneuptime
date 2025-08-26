import { JSONObject } from "../../Types/JSON";
import { jwtDecode } from "jwt-decode";

export default class JWTToken {
  public static decodeToken(token: string): JSONObject {
    return jwtDecode(token);
  }
}
