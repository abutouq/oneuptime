import { FindWhereProperty } from "../../../Types/BaseDatabase/Query";
import StartAndEndDate, { StartAndEndDateType } from "../Date/StartAndEndDate";
import FieldType from "../Types/FieldType";
import Filter from "./Types/Filter";
import FilterData from "./Types/FilterData";
import InBetween from "../../../Types/BaseDatabase/InBetween";
import GenericObject from "../../../Types/GenericObject";
import React, { ReactElement } from "react";

export interface ComponentProps<T extends GenericObject> {
  filter: Filter<T>;
  onFilterChanged?: undefined | ((filterData: FilterData<T>) => void);
  filterData: FilterData<T>;
}

type DateFilterFunction = <T extends GenericObject>(
  props: ComponentProps<T>,
) => ReactElement;

const DateFilter: DateFilterFunction = <T extends GenericObject>(
  props: ComponentProps<T>,
): ReactElement => {
  const filter: Filter<T> = props.filter;
  const filterData: FilterData<T> = { ...props.filterData };

  if (filter.type !== FieldType.Date && filter.type !== FieldType.DateTime) {
    return <></>;
  }

  return (
    <StartAndEndDate
      value={filterData[filter.key] as InBetween<Date>}
      onValueChanged={(inBetween: InBetween<Date> | null) => {
        filterData[filter.key] = inBetween as FindWhereProperty<
          NonNullable<T[keyof T]>
        >;

        if (!filterData[filter.key]) {
          delete filterData[filter.key];
        }

        if (props.onFilterChanged) {
          props.onFilterChanged(filterData);
        }
      }}
      type={
        filter.type === FieldType.DateTime
          ? StartAndEndDateType.DateTime
          : StartAndEndDateType.Date
      }
    />
  );
};

export default DateFilter;
