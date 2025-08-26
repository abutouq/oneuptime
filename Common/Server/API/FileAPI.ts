import FileService, {
  Service as FileServiceType,
} from "../Services/FileService";
import {
  ExpressRequest,
  ExpressResponse,
  NextFunction,
} from "../Utils/Express";
import Response from "../Utils/Response";
import BaseAPI from "./BaseAPI";
import NotFoundException from "../../Types/Exception/NotFoundException";
import ObjectID from "../../Types/ObjectID";
import File from "../../Models/DatabaseModels/File";

export default class FileAPI extends BaseAPI<File, FileServiceType> {
  public constructor() {
    super(File, FileService);

    this.router.get(
      `${new this.entityType().getCrudApiPath()?.toString()}/image/:imageId`,
      async (
        req: ExpressRequest,
        res: ExpressResponse,
        _next: NextFunction,
      ) => {
        const file: File | null = await FileService.findOneById({
          id: new ObjectID(req.params["imageId"]!),
          props: {
            isRoot: true,
            ignoreHooks: true,
          },
          select: {
            file: true,
            fileType: true,
          },
        });

        if (!file || !file.file || !file.fileType) {
          return Response.sendErrorResponse(
            req,
            res,
            new NotFoundException("File not found"),
          );
        }

        return Response.sendFileResponse(req, res, file);
      },
    );
  }
}
