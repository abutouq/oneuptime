import FiltersForm from "Common/UI/Components/Filters/FiltersForm";
import FieldType from "Common/UI/Components/Types/FieldType";
import React, { Fragment, FunctionComponent, ReactElement } from "react";
import DropdownUtil from "Common/UI/Utils/Dropdown";
import MetricsAggregationType from "Common/Types/Metrics/MetricsAggregationType";
import Query from "Common/Types/BaseDatabase/Query";
import MetricsQuery from "Common/Types/Metrics/MetricsQuery";
import MetricQueryData from "Common/Types/Metrics/MetricQueryData";
import MetricType from "Common/Models/DatabaseModels/MetricType";

export interface ComponentProps {
  data: MetricQueryData;
  onDataChanged: (filterData: MetricQueryData) => void;
  metricTypes: Array<MetricType>;
  telemetryAttributes: string[];
}

const MetricFilter: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  return (
    <Fragment>
      <div>
        <FiltersForm<MetricsQuery>
          showFilter={true}
          id="metrics-filter"
          filterData={props.data.filterData}
          onFilterChanged={(filterData: Query<MetricsQuery>) => {
            props.onDataChanged({
              ...props.data,
              filterData,
            });
          }}
          filters={[
            {
              key: "metricName",
              title: "Metric Name",
              type: FieldType.Dropdown,
              filterDropdownOptions: DropdownUtil.getDropdownOptionsFromArray(
                props.metricTypes.map((metricType: MetricType) => {
                  return metricType.name || "";
                }), // metricType is an array of MetricType
              ),
            },
            {
              key: "attributes",
              type: FieldType.JSON,
              title: "Filter by Attributes",
              jsonKeys: props.telemetryAttributes,
            },
            {
              key: "aggegationType",
              type: FieldType.Dropdown,
              title: "Aggregation Type",
              filterDropdownOptions: DropdownUtil.getDropdownOptionsFromEnum(
                MetricsAggregationType,
              ),
            },
          ]}
        />
      </div>
    </Fragment>
  );
};

export default MetricFilter;
