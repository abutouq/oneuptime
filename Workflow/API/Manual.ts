import QueueWorkflow from "../Services/QueueWorkflow";
import BadDataException from "Common/Types/Exception/BadDataException";
import ObjectID from "Common/Types/ObjectID";
import Express, {
  ExpressRequest,
  ExpressResponse,
  ExpressRouter,
  NextFunction,
} from "Common/Server/Utils/Express";
import Response from "Common/Server/Utils/Response";

export default class ManualAPI {
  public router!: ExpressRouter;

  public constructor() {
    this.router = Express.getRouter();

    this.router.get(`/run/:workflowId`, this.manuallyRunWorkflow);

    this.router.post(`/run/:workflowId`, this.manuallyRunWorkflow);
  }

  public async manuallyRunWorkflow(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction,
  ): Promise<void> {
    try {
      // add this workflow to the run queue and return the 200 response.

      if (!req.params["workflowId"]) {
        return Response.sendErrorResponse(
          req,
          res,
          new BadDataException("workflowId not found in URL"),
        );
      }

      await QueueWorkflow.addWorkflowToQueue({
        workflowId: new ObjectID(req.params["workflowId"] as string),
        returnValues: req.body.data || {},
      });

      return Response.sendJsonObjectResponse(req, res, {
        status: "Scheduled",
      });
    } catch (err) {
      next(err);
    }
  }
}
