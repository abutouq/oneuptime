import ActionButtonSchema from "../ActionButton/ActionButtonSchema";
import TableRow from "./TableRow";
import Columns from "./Types/Columns";
import GenericObject from "../../../Types/GenericObject";
import React, { ReactElement } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";

export interface ComponentProps<T extends GenericObject> {
  data: Array<T>;
  id: string;
  columns: Columns<T>;
  actionButtons?: undefined | Array<ActionButtonSchema<T>> | undefined;
  enableDragAndDrop?: undefined | boolean;
  dragAndDropScope?: string | undefined;
  dragDropIdField?: keyof T | undefined;
  dragDropIndexField?: keyof T | undefined;

  // bulk actions
  isBulkActionsEnabled?: undefined | boolean;
  onItemSelected?: undefined | ((item: T) => void);
  onItemDeselected?: undefined | ((item: T) => void);
  selectedItems: Array<T>;
  matchBulkSelectedItemByField: keyof T | undefined; // which field to use to match selected items. For exmaple this could be '_id'

  // responsive
  isMobile?: boolean;
}

type TableBodyFunction = <T extends GenericObject>(
  props: ComponentProps<T>,
) => ReactElement;

const TableBody: TableBodyFunction = <T extends GenericObject>(
  props: ComponentProps<T>,
): ReactElement => {
  type GetBodyFunction = (provided?: DroppableProvided) => ReactElement;

  const getBody: GetBodyFunction = (
    provided?: DroppableProvided,
  ): ReactElement => {
    // Mobile view: render as list
    if (props.isMobile) {
      return (
        <div
          id={props.id}
          ref={provided?.innerRef}
          {...provided?.droppableProps}
          className="divide-y divide-gray-200 bg-white"
        >
          {props.data &&
            props.data.map((item: T, i: number) => {
              return (
                <TableRow
                  isBulkActionsEnabled={props.isBulkActionsEnabled}
                  onItemSelected={props.onItemSelected}
                  onItemDeselected={props.onItemDeselected}
                  isItemSelected={
                    props.selectedItems?.filter((selectedItem: T) => {
                      if (props.matchBulkSelectedItemByField === undefined) {
                        return false;
                      }

                      return (
                        selectedItem[
                          props.matchBulkSelectedItemByField
                        ]?.toString() ===
                        item[props.matchBulkSelectedItemByField]?.toString()
                      );
                    }).length > 0 || false
                  }
                  dragAndDropScope={props.dragAndDropScope}
                  enableDragAndDrop={props.enableDragAndDrop}
                  key={i}
                  item={item}
                  columns={props.columns}
                  actionButtons={props.actionButtons}
                  dragDropIdField={props.dragDropIdField}
                  dragDropIndexField={props.dragDropIndexField}
                  isMobile={true}
                />
              );
            })}
          {provided?.placeholder}
        </div>
      );
    }

    // Desktop view: render as table
    return (
      <tbody
        id={props.id}
        ref={provided?.innerRef}
        {...provided?.droppableProps}
        className="divide-y divide-gray-200 bg-white"
      >
        {props.data &&
          props.data.map((item: T, i: number) => {
            return (
              <TableRow
                isBulkActionsEnabled={props.isBulkActionsEnabled}
                onItemSelected={props.onItemSelected}
                onItemDeselected={props.onItemDeselected}
                isItemSelected={
                  props.selectedItems?.filter((selectedItem: T) => {
                    if (props.matchBulkSelectedItemByField === undefined) {
                      return false;
                    }

                    return (
                      selectedItem[
                        props.matchBulkSelectedItemByField
                      ]?.toString() ===
                      item[props.matchBulkSelectedItemByField]?.toString()
                    );
                  }).length > 0 || false
                }
                dragAndDropScope={props.dragAndDropScope}
                enableDragAndDrop={props.enableDragAndDrop}
                key={i}
                item={item}
                columns={props.columns}
                actionButtons={props.actionButtons}
                dragDropIdField={props.dragDropIdField}
                dragDropIndexField={props.dragDropIndexField}
                isMobile={false}
              />
            );
          })}
        {provided?.placeholder}
      </tbody>
    );
  };

  if (props.enableDragAndDrop) {
    return (
      <Droppable droppableId={props.dragAndDropScope || ""}>
        {(provided: DroppableProvided) => {
          return getBody(provided);
        }}
      </Droppable>
    );
  }
  return getBody();
};

export default TableBody;
