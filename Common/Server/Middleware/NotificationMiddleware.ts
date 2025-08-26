import {
  ExpressRequest,
  ExpressResponse,
  NextFunction,
  OneUptimeRequest,
} from "../Utils/Express";
import JSONWebToken from "../Utils/JsonWebToken";
import Response from "../Utils/Response";
import logger from "../Utils/Logger";
import { OnCallInputRequest } from "../../Types/Call/CallRequest";
import BadDataException from "../../Types/Exception/BadDataException";
import JSONFunctions from "../../Types/JSONFunctions";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import CaptureSpan from "../Utils/Telemetry/CaptureSpan";

export default class NotificationMiddleware {
  @CaptureSpan()
  public static async sendResponse(
    req: ExpressRequest,
    res: ExpressResponse,
    onCallInputRequest: OnCallInputRequest,
  ): Promise<void> {
    const response: VoiceResponse = new VoiceResponse();

    if (onCallInputRequest[req.body["Digits"]]) {
      response.say(onCallInputRequest[req.body["Digits"]]!.sayMessage);
    } else {
      response.say(onCallInputRequest["default"]!.sayMessage);
    }

    return Response.sendXmlResponse(req, res, response.toString());
  }

  @CaptureSpan()
  public static async isValidCallNotificationRequest(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction,
  ): Promise<void> {
    req = req as OneUptimeRequest;

    if (!req.body["Digits"]) {
      return Response.sendErrorResponse(
        req,
        res,
        new BadDataException("Invalid input"),
      );
    }

    if (!req.query["token"]) {
      return Response.sendErrorResponse(
        req,
        res,
        new BadDataException("Invalid token"),
      );
    }

    const token: string = req.query["token"] as string;

    try {
      (req as any).callTokenData = JSONFunctions.deserialize(
        JSONWebToken.decodeJsonPayload(token),
      );
    } catch (e) {
      logger.error(e);
      return Response.sendErrorResponse(
        req,
        res,
        new BadDataException("Invalid token"),
      );
    }

    return next();
  }
}
