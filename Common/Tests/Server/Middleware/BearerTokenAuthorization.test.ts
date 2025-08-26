import BearerTokenAuthorization from "../../../Server/Middleware/BearerTokenAuthorization";
import {
  ExpressResponse,
  OneUptimeRequest,
} from "../../../Server/Utils/Express";
import JSONWebToken from "../../../Server/Utils/JsonWebToken";
import { describe, expect, it } from "@jest/globals";
import { JSONObject } from "../../../Types/JSON";
import getJestMockFunction, { MockFunction } from "../../../Tests/MockType";

describe("BearerTokenAuthorization", () => {
  describe("isAuthorizedBearerToken", () => {
    it("adds decoded token data to request", () => {
      const jsonObj: JSONObject = { test: "test" };
      const req: OneUptimeRequest = {
        headers: {
          authorization: `Bearer ${JSONWebToken.signJsonPayload(jsonObj, 5)}`,
        },
      } as OneUptimeRequest;
      const res: ExpressResponse = {} as ExpressResponse;
      const next: MockFunction = getJestMockFunction();
      void BearerTokenAuthorization.isAuthorizedBearerToken(req, res, next);
      const jsonObjResult: JSONObject = req.bearerTokenData as JSONObject;
      expect(jsonObjResult["test"]).toMatchInlineSnapshot(`"test"`);
    });
    it("calls next without arguments if token is valid", () => {
      const jsonObj: JSONObject = { test: "test" };
      const req: OneUptimeRequest = {
        headers: {
          authorization: `Bearer ${JSONWebToken.signJsonPayload(jsonObj, 5)}`,
        },
      } as OneUptimeRequest;
      const res: ExpressResponse = {} as ExpressResponse;
      const next: MockFunction = getJestMockFunction();
      void BearerTokenAuthorization.isAuthorizedBearerToken(req, res, next);
      expect(next.mock.calls[0][0]).toMatchInlineSnapshot(`undefined`);
    });
    it("calls next with exception if token is empty", () => {
      const req: OneUptimeRequest = {
        headers: {
          authorization: "",
        },
      } as OneUptimeRequest;
      const res: ExpressResponse = {} as ExpressResponse;
      const next: MockFunction = getJestMockFunction();
      void BearerTokenAuthorization.isAuthorizedBearerToken(req, res, next);
      expect(next.mock.calls[0][0]).toMatchInlineSnapshot(
        `[Error: Invalid bearer token, or bearer token not provided.]`,
      );
    });
    it("calls next with exception if token is invalid", () => {
      const req: OneUptimeRequest = {
        headers: {
          authorization: "Bearer ",
        },
      } as OneUptimeRequest;
      const res: ExpressResponse = {} as ExpressResponse;
      const next: MockFunction = getJestMockFunction();
      void BearerTokenAuthorization.isAuthorizedBearerToken(req, res, next);
      expect(next.mock.calls[0][0]).toMatchInlineSnapshot(
        `[Error: Invalid bearer token, or bearer token not provided.]`,
      );
    });
    it("calls next with exception if token header is not present", () => {
      const req: OneUptimeRequest = {} as OneUptimeRequest;
      const res: ExpressResponse = {} as ExpressResponse;
      const next: MockFunction = getJestMockFunction();
      void BearerTokenAuthorization.isAuthorizedBearerToken(req, res, next);
      expect(next.mock.calls[0][0]).toMatchInlineSnapshot(
        `[Error: Invalid bearer token, or bearer token not provided.]`,
      );
    });
  });
});
