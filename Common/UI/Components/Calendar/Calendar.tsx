import { Blue500 } from "../../../Types/BrandColors";
import CalendarEvent from "../../../Types/Calendar/CalendarEvent";
import Color from "../../../Types/Color";
import OneUptimeDate from "../../../Types/Date";
import StartAndEndTime from "../../../Types/Time/StartAndEndTime";
import moment from "moment-timezone";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import {
  Calendar,
  DateLocalizer,
  EventPropGetter,
  momentLocalizer,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer: DateLocalizer = momentLocalizer(moment);

export interface ComponentProps {
  id?: string | undefined;
  events: Array<CalendarEvent>;
  defaultCalendarView?: DefaultCalendarView;
  onRangeChange: (startAndEndTime: StartAndEndTime) => void;
}

export enum DefaultCalendarView {
  Month = "month",
  Week = "week",
  Day = "day",
  Agenda = "agenda",
}

const CalendarElement: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  const { defaultDate } = useMemo(() => {
    return {
      defaultDate: OneUptimeDate.getCurrentDate(),
    };
  }, []);

  const eventStyleGetter: EventPropGetter<any> = (
    event: CalendarEvent,
  ): { className?: string | undefined; style?: React.CSSProperties } => {
    const backgroundColor: string =
      event.color?.toString() || Blue500.toString();
    const style: React.CSSProperties = {
      backgroundColor: backgroundColor,
      borderRadius: "0px",
      opacity: 0.8,
      color:
        event.textColor?.toString() ||
        Color.shouldUseDarkText(new Color(backgroundColor))
          ? "#000000"
          : "#ffffff",
      border: "0px",
      display: "block",
    };

    return {
      style: style,
    };
  };

  return (
    <div id={props.id} className="mt-5 h-[42rem]">
      <Calendar
        defaultDate={defaultDate}
        events={props.events}
        localizer={localizer}
        showMultiDayTimes
        defaultView={props.defaultCalendarView || "day"}
        eventPropGetter={eventStyleGetter}
        onRangeChange={(range: Date[] | { start: Date; end: Date }) => {
          if (Array.isArray(range)) {
            return props.onRangeChange({
              startTime: range[0] as Date,
              endTime: OneUptimeDate.getEndOfDay(
                range[range.length - 1] as Date,
              ),
            });
          }

          props.onRangeChange({
            startTime: range.start,
            endTime: range.end,
          });
        }}
      />
    </div>
  );
};

export default CalendarElement;
