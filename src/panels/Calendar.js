import React, { useState, useEffect } from "react";
import $ from "jquery";

import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import {
  Group,
  FormItem,
  DatePicker,
  FormLayoutGroup,
  RichCell,
  List,
  Avatar,
  Cell,
} from "@vkontakte/vkui";

import {
  orangeBackground,
  blueBackground,
  redBackground,
  blueIcon,
  statusSnackbar,
  statusSnackbarText,
} from "./style";

import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  get_events,
  EventForm,
  getDayOfWeek,
  event_types_icons,
  options_full,
  options_short,
} from "./src/calendar";
import { Roles } from "../App";
import {
  Icon12Favorite,
  Icon28CheckCircleFill,
  Icon28SchoolOutline,
} from "@vkontakte/icons";

const localizer = momentLocalizer(moment);

export const CalendarPanel = (props) => {
  const [events, setEvents] = useState([]);

  var date = new Date();
  var first = date.getDate(); // - getDayOfWeek(date);
  var last = first + 6;

  var start = new Date(date.setDate(first));
  var end = new Date(date.setDate(last));
  const [dateRange, setDateRange] = useState({ start: start, end: end });

  useEffect(() => {
    get_events(dateRange.start, dateRange.end, setEvents, props);
  }, [dateRange]);

  return (
    <Panel id={props.id}>
      <PanelHeader>Календарь</PanelHeader>
      <Group>
        <FormLayoutGroup mode="horizontal">
          <FormItem top="С">
            <DatePicker
              min={{
                day: 1,
                month: 1,
                year: new Date().getFullYear() - 1,
              }}
              onDateChange={(value) => {
                setDateRange({
                  ...dateRange,
                  start: new Date(value.year, value.month - 1, value.day),
                });
              }}
              defaultValue={{
                day: dateRange.start.getDate(),
                month: dateRange.start.getMonth() + 1,
                year: dateRange.start.getFullYear(),
              }}
              dayPlaceholder="Д"
              monthPlaceholder="ММ"
              yearPlaceholder="ГГ"
            />
          </FormItem>
          <FormItem top="По">
            <DatePicker
              min={{
                day: 1,
                month: 1,
                year: new Date().getFullYear() - 1,
              }}
              onDateChange={(value) => {
                setDateRange({
                  ...dateRange,
                  end: new Date(value.year, value.month - 1, value.day),
                });
              }}
              defaultValue={{
                day: dateRange.end.getDate(),
                month: dateRange.end.getMonth() + 1,
                year: dateRange.end.getFullYear(),
              }}
              dayPlaceholder="Д"
              monthPlaceholder="ММ"
              yearPlaceholder="ГГ"
            />
          </FormItem>
        </FormLayoutGroup>
      </Group>
      <Group>
        {/* <Calendar
          events={events}
          step={15}
          timeslots={8}
          localizer={localizer}
          defaultView={Views.WEEK}
          // onNavigate={(e) => console.log("onNavigate", e)}
          onRangeChange={(e) => {
            if (e.start) setDateRange({ start: e.start, end: e.end });
            else setDateRange({ start: e[0], end: e[e.length - 1] });
          }}
          onSelectEvent={(e) => {
            props.setGlobalProps({ ...props.globalProps, event: e });
            props.go("Event");
          }}
        /> */}
        <List>
          {events.map((event, i) => (
            <Cell
              indicator={event.favorite ? <Icon28CheckCircleFill /> : <></>}
              badge={<Icon12Favorite />}
              before={event_types_icons[event.event_type]}
              // before={<Icon28SchoolOutline fill="var(--accent)" />}
              description={
                event.start.toLocaleDateString("ru-RU", options_full) +
                " - " +
                event.end.toLocaleTimeString("ru-RU", options_short)
              }
              key={event.id}
              disabled={props.userRole === Roles.student}
              onClick={() => {
                if (props.userRole !== Roles.student) {
                  props.setGlobalProps({ ...props.globalProps, event: event });
                  props.go("Event");
                }
              }}
            >
              {event.title}
            </Cell>
          ))}
        </List>
      </Group>
      {props.userRole === Roles.admin && (
        <EventForm
          onSave={() => setDateRange({ ...dateRange })}
          setSnackbar={props.setSnackbar}
        />
      )}
    </Panel>
  );
};
