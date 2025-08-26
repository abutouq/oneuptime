import OneUptimeDate from "../../Types/Date";
import CodeRepositoryAuthorization from "../Middleware/CodeRepositoryAuthorization";
import CopilotCodeRepositoryService, {
  Service as CopilotCodeRepositoryServiceType,
} from "../Services/CopilotCodeRepositoryService";
import ServiceCopilotCodeRepositoryService from "../Services/ServiceCopilotCodeRepositoryService";
import {
  ExpressRequest,
  ExpressResponse,
  NextFunction,
} from "../Utils/Express";
import Response from "../Utils/Response";
import BaseAPI from "./BaseAPI";
import { LIMIT_PER_PROJECT } from "../../Types/Database/LimitMax";
import BadDataException from "../../Types/Exception/BadDataException";
import ObjectID from "../../Types/ObjectID";
import CopilotCodeRepository from "../../Models/DatabaseModels/CopilotCodeRepository";
import ServiceCopilotCodeRepository from "../../Models/DatabaseModels/ServiceCopilotCodeRepository";

export default class CopilotCodeRepositoryAPI extends BaseAPI<
  CopilotCodeRepository,
  CopilotCodeRepositoryServiceType
> {
  public constructor() {
    super(CopilotCodeRepository, CopilotCodeRepositoryService);

    this.router.get(
      `${new this.entityType()
        .getCrudApiPath()
        ?.toString()}/is-valid/:secretkey`,
      CodeRepositoryAuthorization.isAuthorizedRepository,
      async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
        try {
          return Response.sendEmptySuccessResponse(req, res);
        } catch (err) {
          next(err);
        }
      },
    );

    this.router.get(
      `${new this.entityType()
        .getCrudApiPath()
        ?.toString()}/get-code-repository/:secretkey`,
      CodeRepositoryAuthorization.isAuthorizedRepository,
      async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
        try {
          const secretkey: string = req.params["secretkey"]!;

          if (!secretkey) {
            throw new BadDataException("Secret key is required");
          }

          const codeRepository: CopilotCodeRepository | null =
            await CopilotCodeRepositoryService.findOneBy({
              query: {
                secretToken: new ObjectID(secretkey),
              },
              select: {
                name: true,
                mainBranchName: true,
                organizationName: true,
                repositoryHostedAt: true,
                repositoryName: true,
              },
              props: {
                isRoot: true,
              },
            });

          if (!codeRepository) {
            throw new BadDataException(
              "Code repository not found. Secret key is invalid.",
            );
          }

          // update last run time.

          await CopilotCodeRepositoryService.updateOneById({
            id: codeRepository.id!,
            data: {
              lastCopilotRunDateTime: OneUptimeDate.getCurrentDate(),
            },
            props: {
              isRoot: true,
            },
          });

          const servicesRepository: Array<ServiceCopilotCodeRepository> =
            await ServiceCopilotCodeRepositoryService.findBy({
              query: {
                codeRepositoryId: codeRepository.id!,
                enablePullRequests: true,
              },
              select: {
                serviceCatalog: {
                  name: true,
                  _id: true,
                  techStack: true,
                },
                servicePathInRepository: true,
                limitNumberOfOpenPullRequestsCount: true,
              },
              limit: LIMIT_PER_PROJECT,
              skip: 0,
              props: {
                isRoot: true,
              },
            });

          return Response.sendJsonObjectResponse(req, res, {
            codeRepository: CopilotCodeRepository.toJSON(
              codeRepository,
              CopilotCodeRepository,
            ),
            servicesRepository: ServiceCopilotCodeRepository.toJSONArray(
              servicesRepository,
              ServiceCopilotCodeRepository,
            ),
          });
        } catch (err) {
          next(err);
        }
      },
    );
  }
}
