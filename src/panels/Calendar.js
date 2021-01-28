import React, { useState, useEffect } from "react";
import $ from "jquery";

import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import Group from "@vkontakte/vkui/dist/components/Group/Group";

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

import { get_events, EventForm } from "./src/calendar";

const localizer = momentLocalizer(moment);

export const CalendarPanel = (props) => {
  const [events, setEvents] = useState([]);

  var date = new Date();
  var first = date.getDate() - date.getDay();
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
        <Calendar
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
        />
      </Group>
      <EventForm
        onSave={() => setDateRange({ ...dateRange })}
        setSnackbar={props.setSnackbar}
      />
    </Panel>
  );
};
