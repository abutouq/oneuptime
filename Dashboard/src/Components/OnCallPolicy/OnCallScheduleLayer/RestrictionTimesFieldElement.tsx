import OneUptimeDate from "Common/Types/Date";
import DayOfWeek from "Common/Types/Day/DayOfWeek";
import IconProp from "Common/Types/Icon/IconProp";
import RestrictionTimes, {
  RestrictionType,
  WeeklyResctriction,
} from "Common/Types/OnCallDutyPolicy/RestrictionTimes";
import Typeof from "Common/Types/Typeof";
import Button, { ButtonStyleType } from "Common/UI/Components/Button/Button";
import FieldLabelElement from "Common/UI/Components/Detail/FieldLabel";
import Dropdown from "Common/UI/Components/Dropdown/Dropdown";
import Input, { InputType } from "Common/UI/Components/Input/Input";
import BasicRadioButtons from "Common/UI/Components/RadioButtons/BasicRadioButtons";
import { GetReactElementFunction } from "Common/UI/Types/FunctionTypes";
import DropdownUtil from "Common/UI/Utils/Dropdown";
import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState,
} from "react";

export interface ComponentProps {
  error?: string | undefined;
  onChange?: ((value: RestrictionTimes) => void) | undefined;
  value?: RestrictionTimes | undefined;
}

const RestrictionTimesFieldElement: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  const [restrictionTimes, setRestrictionTimes] = useState<
    RestrictionTimes | undefined
  >(props.value ? RestrictionTimes.fromJSON(props.value) : undefined);

  useEffect(() => {
    if (props.value) {
      setRestrictionTimes(RestrictionTimes.fromJSON(props.value));
    } else {
      setRestrictionTimes(undefined);
    }
  }, [props.value]);

  const getDailyRestriction: GetReactElementFunction = (): ReactElement => {
    // show start time to end time input fields

    return (
      <div className="flex space-x-3">
        <div>
          <FieldLabelElement title="From:" />
          <Input
            type={InputType.TIME}
            value={OneUptimeDate.toString(
              restrictionTimes?.dayRestrictionTimes?.startTime,
            )}
            onChange={(value: any) => {
              let date: Date = OneUptimeDate.getCurrentDate();

              if (value instanceof Date) {
                date = value;
              }

              if (typeof value === Typeof.String) {
                date = OneUptimeDate.fromString(value);
              }

              let tempRestrictionTimes: RestrictionTimes | undefined =
                restrictionTimes;

              if (!tempRestrictionTimes) {
                tempRestrictionTimes = new RestrictionTimes();
              }

              if (!tempRestrictionTimes.dayRestrictionTimes) {
                tempRestrictionTimes.dayRestrictionTimes = {
                  startTime: date,
                  endTime: date,
                };
              }

              tempRestrictionTimes.dayRestrictionTimes.startTime = date;

              updateRestrictionTimes(tempRestrictionTimes);
            }}
          />
        </div>
        <div>
          <FieldLabelElement title="To:" />
          <Input
            type={InputType.TIME}
            value={OneUptimeDate.toString(
              restrictionTimes?.dayRestrictionTimes?.endTime,
            )}
            onChange={(value: any) => {
              let date: Date = OneUptimeDate.getCurrentDate();

              if (value instanceof Date) {
                date = value;
              }

              if (typeof value === Typeof.String) {
                date = OneUptimeDate.fromString(value);
              }

              let tempRestrictionTimes: RestrictionTimes | undefined =
                restrictionTimes;

              if (!tempRestrictionTimes) {
                tempRestrictionTimes = new RestrictionTimes();
              }

              if (!tempRestrictionTimes.dayRestrictionTimes) {
                tempRestrictionTimes.dayRestrictionTimes = {
                  startTime: date,
                  endTime: date,
                };
              }

              tempRestrictionTimes.dayRestrictionTimes.endTime = date;

              updateRestrictionTimes(tempRestrictionTimes);
            }}
          />
        </div>
      </div>
    );
  };

  const getWeeklyTimeRestrictions: GetReactElementFunction =
    (): ReactElement => {
      return (
        <div>
          <div className="ml-8">
            {/** LIST */}

            {restrictionTimes?.weeklyRestrictionTimes?.map(
              (weeklyRestriction: WeeklyResctriction, i: number) => {
                return (
                  <div key={i} className="flex">
                    <div>
                      {getWeeklyTimeRestriction({
                        weeklyRestriction,
                        onChange: (value: WeeklyResctriction) => {
                          let tempRestrictionTimes:
                            | RestrictionTimes
                            | undefined = restrictionTimes;

                          if (!tempRestrictionTimes) {
                            tempRestrictionTimes = new RestrictionTimes();
                          }

                          if (!tempRestrictionTimes.weeklyRestrictionTimes) {
                            tempRestrictionTimes.weeklyRestrictionTimes = [];
                          }

                          tempRestrictionTimes.weeklyRestrictionTimes[i] =
                            value;

                          updateRestrictionTimes(tempRestrictionTimes);
                        },
                        onDelete: () => {
                          let tempRestrictionTimes:
                            | RestrictionTimes
                            | undefined = restrictionTimes;

                          if (!tempRestrictionTimes) {
                            tempRestrictionTimes = new RestrictionTimes();
                          }

                          if (!tempRestrictionTimes.weeklyRestrictionTimes) {
                            tempRestrictionTimes.weeklyRestrictionTimes = [];
                          }

                          tempRestrictionTimes.weeklyRestrictionTimes.splice(
                            i,
                            1,
                          );

                          updateRestrictionTimes(tempRestrictionTimes);
                        },
                      })}
                    </div>
                  </div>
                );
              },
            )}
          </div>

          <div className="ml-5 mt-3">
            {/** show add button */}
            <Button
              title="Add Restriction Time"
              buttonStyle={ButtonStyleType.NORMAL}
              icon={IconProp.Add}
              onClick={() => {
                let tempRestrictionTimes: RestrictionTimes | undefined =
                  restrictionTimes;

                if (!tempRestrictionTimes) {
                  tempRestrictionTimes = new RestrictionTimes();
                }

                if (!tempRestrictionTimes.weeklyRestrictionTimes) {
                  tempRestrictionTimes.weeklyRestrictionTimes = [];
                }

                tempRestrictionTimes.weeklyRestrictionTimes.push(
                  RestrictionTimes.getDefaultWeeklyRestrictionTIme(),
                );

                updateRestrictionTimes(tempRestrictionTimes);
              }}
            />
          </div>
        </div>
      );
    };

  type GetWeeklyRestrictionFunction = (params: {
    weeklyRestriction: WeeklyResctriction;
    onChange: (value: WeeklyResctriction) => void;
    onDelete: () => void;
  }) => ReactElement;

  const getWeeklyTimeRestriction: GetWeeklyRestrictionFunction = (params: {
    weeklyRestriction: WeeklyResctriction;
    onChange: (value: WeeklyResctriction) => void;
    onDelete: () => void;
  }): ReactElement => {
    // show start time to end time input fields

    return (
      <div className="flex space-x-3 mt-2">
        <div>
          <FieldLabelElement title="From:" />
          <div className="space-x-3 flex">
            <div>
              <Dropdown
                options={DropdownUtil.getDropdownOptionsFromEnum(DayOfWeek)}
                value={DropdownUtil.getDropdownOptionFromEnumForValue(
                  DayOfWeek,
                  params.weeklyRestriction.startDay,
                )}
                onChange={(value: any) => {
                  params.weeklyRestriction.startDay = value;

                  // move start time to the new start day
                  if (params.weeklyRestriction.startTime) {
                    params.weeklyRestriction.startTime =
                      OneUptimeDate.moveDateToTheDayOfWeek(
                        params.weeklyRestriction.startTime,
                        OneUptimeDate.getCurrentDate(),
                        value,
                      );
                  }
                  params.onChange(params.weeklyRestriction);
                }}
              />
            </div>
            <div>
              <Input
                type={InputType.TIME}
                value={OneUptimeDate.toString(
                  params.weeklyRestriction?.startTime,
                )}
                onChange={(value: any) => {
                  let date: Date = OneUptimeDate.getCurrentDate();

                  if (value instanceof Date) {
                    date = value;
                  }

                  if (typeof value === Typeof.String) {
                    date = OneUptimeDate.fromString(value);
                  }

                  // move date to the day of the week from the start day

                  params.weeklyRestriction.startTime =
                    OneUptimeDate.moveDateToTheDayOfWeek(
                      date,
                      OneUptimeDate.getCurrentDate(),
                      params.weeklyRestriction.startDay,
                    );

                  params.onChange(params.weeklyRestriction);
                }}
              />
            </div>
          </div>
        </div>
        <div className="ml-5">
          <FieldLabelElement title="To:" />
          <div className="space-x-3 flex">
            <div>
              <Dropdown
                options={DropdownUtil.getDropdownOptionsFromEnum(DayOfWeek)}
                value={DropdownUtil.getDropdownOptionFromEnumForValue(
                  DayOfWeek,
                  params.weeklyRestriction.endDay,
                )}
                onChange={(value: any) => {
                  params.weeklyRestriction.endDay = value;

                  // move end time to the new end day
                  if (params.weeklyRestriction.endTime) {
                    params.weeklyRestriction.endTime =
                      OneUptimeDate.moveDateToTheDayOfWeek(
                        params.weeklyRestriction.endTime,
                        OneUptimeDate.getCurrentDate(),
                        value,
                      );
                  }
                  params.onChange(params.weeklyRestriction);
                }}
              />
            </div>
            <div>
              <Input
                type={InputType.TIME}
                value={OneUptimeDate.toString(
                  params.weeklyRestriction?.endTime,
                )}
                onChange={(value: any) => {
                  let date: Date = OneUptimeDate.getCurrentDate();

                  if (value instanceof Date) {
                    date = value;
                  }

                  if (typeof value === Typeof.String) {
                    date = OneUptimeDate.fromString(value);
                  }

                  // move date to the day of the week from the end day
                  params.weeklyRestriction.endTime =
                    OneUptimeDate.moveDateToTheDayOfWeek(
                      date,
                      OneUptimeDate.getCurrentDate(),
                      params.weeklyRestriction.endDay,
                    );

                  params.onChange(params.weeklyRestriction);
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          {/* Dellete Button */}
          <Button
            title="Delete"
            buttonStyle={ButtonStyleType.NORMAL}
            icon={IconProp.Trash}
            onClick={() => {
              params.onDelete();
            }}
          />
        </div>
      </div>
    );
  };

  type UpdateRestrictionTimesFunction = (
    restrictionTimes: RestrictionTimes,
  ) => void;

  const updateRestrictionTimes: UpdateRestrictionTimesFunction = (
    restrictionTimes: RestrictionTimes,
  ): void => {
    setRestrictionTimes(RestrictionTimes.fromJSON(restrictionTimes.toJSON()));
    if (props.onChange) {
      props.onChange(restrictionTimes);
    }
  };

  return (
    <div>
      <BasicRadioButtons
        onChange={(value: string) => {
          let tempRestrictionTimes: RestrictionTimes | undefined =
            restrictionTimes;

          if (!tempRestrictionTimes) {
            tempRestrictionTimes = new RestrictionTimes();
          }

          if (value === RestrictionType.None) {
            // remove all restrictions
            tempRestrictionTimes.removeAllRestrictions();
            updateRestrictionTimes(tempRestrictionTimes);
          } else if (value === RestrictionType.Daily) {
            // remove all restrictions
            tempRestrictionTimes.removeAllRestrictions();
            // add daily restriction
            tempRestrictionTimes.addDefaultDailyRestriction();
            updateRestrictionTimes(tempRestrictionTimes);
          } else if (value === RestrictionType.Weekly) {
            // remove all restrictions
            tempRestrictionTimes.removeAllRestrictions();
            // add weekly restriction
            tempRestrictionTimes.addDefaultWeeklyRestriction();
            updateRestrictionTimes(tempRestrictionTimes);
          }
        }}
        initialValue={restrictionTimes?.restictionType}
        options={[
          {
            title: "No Restrictions",
            value: RestrictionType.None,
          },
          {
            title: "Specific Times of the Day",
            value: RestrictionType.Daily,
            children: getDailyRestriction(),
          },
          {
            title: "Specific Times of the Week",
            value: RestrictionType.Weekly,
            children: getWeeklyTimeRestrictions(),
          },
        ]}
      />

      {props.error && (
        <p data-testid="error-message" className="mt-1 text-sm text-red-400">
          {props.error}
        </p>
      )}
    </div>
  );
};

export default RestrictionTimesFieldElement;
