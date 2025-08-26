import {
  CategoryCheckboxOption,
  CheckboxCategory,
} from "../Components/CategoryCheckbox/CategoryCheckboxTypes";
import { CategoryCheckboxOptionsAndCategories } from "../Components/CategoryCheckbox/Index";
import ModelAPI, { ListResult } from "../Utils/ModelAPI/ModelAPI";
import URL from "../../Types/API/URL";
import { LIMIT_PER_PROJECT } from "../../Types/Database/LimitMax";
import ObjectID from "../../Types/ObjectID";
import StatusPageGroup from "../../Models/DatabaseModels/StatusPageGroup";
import StatusPageResource from "../../Models/DatabaseModels/StatusPageResource";
import DropdownUtil from "./Dropdown";
import StatusPageEventType from "../../Types/StatusPage/StatusPageEventType";
import { DropdownOption } from "../Components/Dropdown/Dropdown";

export default class StatusPageUtil {
  public static getDropdownPropsBasedOnEventTypes(): Array<DropdownOption> {
    return DropdownUtil.getDropdownOptionsFromEnum(StatusPageEventType);
  }

  public static async getCategoryCheckboxPropsBasedOnResources(
    statusPageId: ObjectID,
    overrideRequestUrl?: URL,
  ): Promise<CategoryCheckboxOptionsAndCategories> {
    const categories: Array<CheckboxCategory> = [];
    const options: Array<CategoryCheckboxOption> = [];

    let resources: Array<StatusPageResource> =
      await StatusPageUtil.getResources(statusPageId, overrideRequestUrl);

    let resourceGroups: Array<StatusPageGroup> = resources
      .map((resource: StatusPageResource) => {
        return resource.statusPageGroup;
      })
      .filter((group: StatusPageGroup | undefined) => {
        return Boolean(group);
      }) as Array<StatusPageGroup>;

    // now sort by order.

    resourceGroups = resourceGroups.sort(
      (a: StatusPageGroup, b: StatusPageGroup) => {
        return a.order! - b.order!;
      },
    );

    // add categories.

    resourceGroups.forEach((group: StatusPageGroup) => {
      //before we add make sure it doesn't already exist.

      if (
        categories.find((category: CheckboxCategory) => {
          return category.id === group._id;
        })
      ) {
        return;
      }

      categories.push({
        id: group._id!,
        title: group.name!,
      });
    });

    // sort resources by order.

    resources = resources.sort(
      (a: StatusPageResource, b: StatusPageResource) => {
        return a.order! - b.order!;
      },
    );

    // add options.

    resources.forEach((resource: StatusPageResource) => {
      options.push({
        value: resource._id!,
        label: resource.displayName!,
        categoryId: resource.statusPageGroup?._id || "",
      });
    });

    return {
      categories,
      options,
    };
  }

  public static async getResources(
    statusPageId: ObjectID,
    overrideRequestUrl?: URL,
  ): Promise<Array<StatusPageResource>> {
    const resources: ListResult<StatusPageResource> =
      await ModelAPI.getList<StatusPageResource>({
        modelType: StatusPageResource,
        query: {
          statusPageId: statusPageId,
        },
        limit: LIMIT_PER_PROJECT,
        skip: 0,
        select: {
          _id: true,
          displayName: true,
          order: true,
          statusPageGroup: {
            _id: true,
            name: true,
            order: true,
          },
        },
        sort: {},
        requestOptions: overrideRequestUrl
          ? {
              overrideRequestUrl: overrideRequestUrl,
            }
          : undefined,
      });

    return resources.data;
  }
}
