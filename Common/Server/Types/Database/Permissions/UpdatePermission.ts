import DatabaseRequestType from "../../BaseDatabase/DatabaseRequestType";
import Query from "../Query";
import AccessControlUtil from "./AccessControlPermission";
import BasePermission, { CheckPermissionBaseInterface } from "./BasePermission";
import ColumnPermissions from "./ColumnPermission";
import TablePermission from "./TablePermission";
import BaseModel from "../../../../Models/DatabaseModels/DatabaseBaseModel/DatabaseBaseModel";
import DatabaseCommonInteractionProps from "../../../../Types/BaseDatabase/DatabaseCommonInteractionProps";
import QueryDeepPartialEntity from "../../../../Types/Database/PartialEntity";
import CaptureSpan from "../../../Utils/Telemetry/CaptureSpan";

export default class UpdatePermission {
  @CaptureSpan()
  public static async checkUpdatePermissionByModel<
    TBaseModel extends BaseModel,
  >(data: {
    fetchModelWithAccessControlIds: () => Promise<TBaseModel | null>;
    modelType: { new (): TBaseModel };
    props: DatabaseCommonInteractionProps;
  }): Promise<void> {
    await AccessControlUtil.checkAccessControlBlockPermissionByModel<TBaseModel>(
      { ...data, type: DatabaseRequestType.Update },
    );

    await AccessControlUtil.checkAccessControlPermissionByModel<TBaseModel>({
      ...data,
      type: DatabaseRequestType.Update,
    });
  }

  @CaptureSpan()
  public static async checkUpdatePermissions<TBaseModel extends BaseModel>(
    modelType: { new (): TBaseModel },
    query: Query<TBaseModel>,
    data: QueryDeepPartialEntity<TBaseModel>,
    props: DatabaseCommonInteractionProps,
  ): Promise<Query<TBaseModel>> {
    if (props.isRoot || props.isMasterAdmin) {
      // If system is making this query then let the query run!
      return query;
    }

    TablePermission.checkTableLevelPermissions(
      modelType,
      props,
      DatabaseRequestType.Update,
    );

    const checkBasePermission: CheckPermissionBaseInterface<TBaseModel> =
      await BasePermission.checkPermissions(
        modelType,
        query,
        null,
        props,
        DatabaseRequestType.Update,
      );

    query = checkBasePermission.query;

    ColumnPermissions.checkDataColumnPermissions(
      modelType,
      data as any,
      props,
      DatabaseRequestType.Update,
    );

    return query;
  }
}
