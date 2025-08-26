import { LogLevel } from "../EnvironmentConfig";
import OneUptimeTelemetry, { TelemetryLogger } from "./Telemetry";
import { SeverityNumber } from "@opentelemetry/api-logs";
import Exception from "../../Types/Exception/Exception";
import { JSONObject } from "../../Types/JSON";
import ConfigLogLevel from "../Types/ConfigLogLevel";

export type LogBody = string | JSONObject | Exception | Error | unknown;

export default class logger {
  public static getLogLevel(): ConfigLogLevel {
    if (!LogLevel) {
      return ConfigLogLevel.INFO;
    }

    return LogLevel;
  }

  public static serializeLogBody(body: LogBody): string {
    if (typeof body === "string") {
      return body;
    } else if (body instanceof Exception || body instanceof Error) {
      return body.message;
    }
    return JSON.stringify(body);
  }

  public static info(message: LogBody): void {
    const logLevel: ConfigLogLevel = this.getLogLevel();

    if (logLevel === ConfigLogLevel.DEBUG || logLevel === ConfigLogLevel.INFO) {
      // eslint-disable-next-line no-console
      console.info(message);

      this.emit({
        body: message,
        severityNumber: SeverityNumber.INFO,
      });
    }
  }

  public static error(message: LogBody): void {
    const logLevel: ConfigLogLevel = this.getLogLevel();

    if (
      logLevel === ConfigLogLevel.DEBUG ||
      logLevel === ConfigLogLevel.INFO ||
      logLevel === ConfigLogLevel.WARN ||
      logLevel === ConfigLogLevel.ERROR
    ) {
      // eslint-disable-next-line no-console
      console.error(message);

      this.emit({
        body: message,
        severityNumber: SeverityNumber.ERROR,
      });
    }
  }

  public static warn(message: LogBody): void {
    const logLevel: ConfigLogLevel = this.getLogLevel();

    if (
      logLevel === ConfigLogLevel.DEBUG ||
      logLevel === ConfigLogLevel.INFO ||
      logLevel === ConfigLogLevel.WARN
    ) {
      // eslint-disable-next-line no-console
      console.warn(message);

      this.emit({
        body: message,
        severityNumber: SeverityNumber.WARN,
      });
    }
  }

  public static debug(message: LogBody): void {
    const logLevel: ConfigLogLevel = this.getLogLevel();

    if (logLevel === ConfigLogLevel.DEBUG) {
      // eslint-disable-next-line no-console
      console.debug(message);

      this.emit({
        body: message,
        severityNumber: SeverityNumber.DEBUG,
      });
    }
  }

  public static emit(data: {
    body: LogBody;
    severityNumber: SeverityNumber;
  }): void {
    const logger: TelemetryLogger | null = OneUptimeTelemetry.getLogger();

    if (logger === null) {
      return;
    }

    logger.emit({
      body: this.serializeLogBody(data.body),
      severityNumber: data.severityNumber,
    });
  }

  public static trace(message: LogBody): void {
    const logLevel: ConfigLogLevel = this.getLogLevel();

    if (logLevel === ConfigLogLevel.DEBUG) {
      // eslint-disable-next-line no-console
      console.trace(message);

      this.emit({
        body: message,
        severityNumber: SeverityNumber.DEBUG,
      });
    }
  }
}
