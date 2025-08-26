import ProbeAPI from "../../../Server/API/ProbeAPI";
import ProbeService from "../../../Server/Services/ProbeService";
import {
  ExpressRequest,
  ExpressResponse,
  NextFunction,
} from "../../../Server/Utils/Express";
import Response from "../../../Server/Utils/Response";
import { mockRouter } from "./Helpers";
import { describe, expect, it } from "@jest/globals";
import LIMIT_MAX from "../../../Types/Database/LimitMax";
import PositiveNumber from "../../../Types/PositiveNumber";
import Probe from "../../../Models/DatabaseModels/Probe";

jest.mock("../../../Server/Utils/Express", () => {
  return {
    getRouter: () => {
      return mockRouter;
    },
  };
});

jest.mock("../../../Server/Utils/Response", () => {
  return {
    sendEntityArrayResponse: jest.fn().mockImplementation((...args: []) => {
      return args;
    }),
    sendJsonObjectResponse: jest.fn().mockImplementation((...args: []) => {
      return args;
    }),
    sendEmptySuccessResponse: jest.fn(),
    sendEntityResponse: jest.fn().mockImplementation((...args: []) => {
      return args;
    }),
  };
});

jest.mock("../../../Server/Services/ProbeService");

describe("ProbeAPI", () => {
  let mockRequest: ExpressRequest;
  let mockResponse: ExpressResponse;
  let nextFunction: NextFunction;

  beforeEach(() => {
    new ProbeAPI();
    mockRequest = {} as ExpressRequest;
    mockResponse = {
      send: jest.fn(),
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as ExpressResponse;
    nextFunction = jest.fn();
  });

  it("should correctly handle global probes request", async () => {
    // eslint-disable-next-line @typescript-eslint/typedef
    const mockProbes = [{ id: "probe" }];
    ProbeService.findBy = jest.fn().mockResolvedValue(mockProbes);
    await mockRouter
      .match("post", "/probe/global-probes")
      .handlerFunction(mockRequest, mockResponse, nextFunction);

    expect(ProbeService.findBy).toHaveBeenCalledWith({
      query: {
        isGlobalProbe: true,
      },
      select: {
        name: true,
        description: true,
        connectionStatus: true,
        lastAlive: true,
        iconFileId: true,
      },
      props: {
        isRoot: true,
      },
      skip: 0,
      limit: LIMIT_MAX,
    });

    const response: jest.SpyInstance = jest.spyOn(
      Response,
      "sendEntityArrayResponse",
    );
    expect(response).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      mockProbes,
      expect.any(PositiveNumber),
      Probe,
    );
  });

  it("should call next with an error if findBy throws", async () => {
    const testError: Error = new Error("Test error");
    ProbeService.findBy = jest.fn().mockRejectedValue(testError);
    await mockRouter
      .match("post", "/probe/global-probes")
      .handlerFunction(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith(testError);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
