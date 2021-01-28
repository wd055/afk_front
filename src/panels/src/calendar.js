import React, { useState, useEffect } from "react";
import $ from "jquery";
import { main_url } from "../../App.js";

import {
  orangeBackground,
  blueBackground,
  redBackground,
  blueIcon,
  statusSnackbar,
  statusSnackbarText,
} from "../style";

import {
  Group,
  FormLayoutGroup,
  SliderSwitch,
  Input,
  FormItem,
  Button,
  Div,
  DatePicker,
  Header,
  FormLayout,
} from "@vkontakte/vkui";

function getDayOfWeek(date) {
  if (!date) date = new Date();
  return date.getDay() == 0 ? 6 : date.getDay() - 1;
}

function getDateForRequest(date) {
  return (
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );
}

export function formsDataIsValid(formsData) {
  return (
    formsData.title &&
    formsData.title.length > 0 &&
    formsData.auth_type &&
    formsData.auth_type.length > 0 &&
    formsData.start &&
    formsData.end &&
    formsData.start > new Date(2020, 0, 1) &&
    formsData.end > new Date(2020, 0, 1) &&
    formsData.start < formsData.end
  );
}

export function get_events(start, end, setEvents, props) {
  $.ajax(
    `${main_url}api/event/?start=${getDateForRequest(
      start
    )}&end=${getDateForRequest(end)}`,
    {
      method: "GET",
    }
  )
    .done(function (data) {
      console.log("data", data);
      var event_list = [];
      for (var i in data) {
        event_list.push({
          id: data[i].id,
          auth_type: data[i].auth_type,
          title: data[i].title,
          start: new Date(data[i].start),
          end:
            data[i].end == null
              ? new Date(data[i].start)
              : new Date(data[i].end),
          allDay: data[i].end == null,
        });
      }
      setEvents(event_list);
    })
    .fail(function (data) {
      console.log("FAIL", data);
      statusSnackbar(data.status, props.setSnackbar);
    });
}
function event_date_Date_composition(event_date, date) {
  return new Date(
    event_date.year,
    event_date.month - 1,
    event_date.day,
    date.getHours(),
    date.getMinutes()
  );
}
function getHoursAndMinutes(time) {
  return time.toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function save_event(formsData, setSnackbar) {
  var tmp = { ...formsData };

  tmp.start = event_date_Date_composition(
    formsData.event_date,
    tmp.start
  ).toISOString();

  tmp.end = event_date_Date_composition(
    formsData.event_date,
    tmp.end
  ).toISOString();

  console.log(tmp);

  $.ajax(`${main_url}api/event/${formsData.id ? formsData.id + "/" : ""}`, {
    method: (formsData.id ? "PUT" : "POST"),
    data: tmp,
  })
    .done(function (data) {
      console.log("data", data);
      statusSnackbar(200, setSnackbar);
    })
    .fail(function (data) {
      console.log("FAIL", data.responseText);
      statusSnackbar(data.status, setSnackbar);
    });
}

export type EventItem = {
  id: Number,
  title: String,
  auth_type: String,
  start: String,
  end: String,
};

type EventFormProps = {
  setSnackbar: Function,
  event?: Object,
  onSave?: Function,
  onEdit?: Function,
};

export const EventForm: FunctionComponent<EventFormProps> = (
  { event, onSave, onEdit, setSnackbar },
  props
) => {
  const [formsData, setFormsData] = useState(
    event === undefined
      ? {
          title: "",
          auth_type: "",
          start: new Date(2020, 0, 1),
          end: new Date(2020, 0, 1),
          event_date: {
            day: new Date().getDate(),
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          },
        }
      : {
          id: event.id,
          title: event.title,
          auth_type: event.auth_type,
          start: event_date_Date_composition(
            { day: 1, month: 1, year: 2020 },
            event.start
          ),
          end: event_date_Date_composition(
            { day: 1, month: 1, year: 2020 },
            event.end
          ),
          event_date: {
            day: event.start.getDate(),
            month: event.start.getMonth() + 1,
            year: event.start.getFullYear(),
          },
        }
  );
  useEffect(() => {
    if (onEdit !== undefined) onEdit(formsData);
  }, [formsData]);

  return (
    <Group
      header={
        <Header>
          {event === undefined
            ? "Добавить мероприятие"
            : "Изменить мероприятие"}
        </Header>
      }
    >
      <FormLayout>
        <FormItem
          top="Название"
          status={formsData.title.length > 0 ? "valid" : "error"}
        >
          <Input
            type="text"
            defaultValue={formsData.title}
            onChange={(e) =>
              setFormsData({
                ...formsData,
                title: e.currentTarget.value,
              })
            }
          />
        </FormItem>
        <FormItem top="Тип авторизации">
          <SliderSwitch
            onSwitch={(e) => setFormsData({ ...formsData, auth_type: e })}
            activeValue={formsData.auth_type}
            options={[
              {
                name: "Одинарная",
                value: "single",
              },
              {
                name: "Двойная",
                value: "double",
              },
            ]}
          />
        </FormItem>
        <FormItem top="Дата">
          <DatePicker
            min={{
              day: 1,
              month: 1,
              year: new Date().getFullYear() - 1,
            }}
            onDateChange={(value) => {
              setFormsData({
                ...formsData,
                event_date: value,
              });
            }}
            defaultValue={formsData.event_date}
            dayPlaceholder="Д"
            monthPlaceholder="ММ"
            yearPlaceholder="ГГ"
          />
        </FormItem>
        <FormLayoutGroup mode="horizontal">
          <FormItem
            top="С"
            status={formsData.start > new Date(2020, 0, 1) ? "valid" : "error"}
          >
            <Input
              type="time"
              required
              defaultValue={
                event === undefined ? "" : getHoursAndMinutes(formsData.start)
              }
              onInput={(e) => {
                setFormsData({
                  ...formsData,
                  start: new Date(
                    2020,
                    0,
                    1,
                    e.currentTarget.value.split(":")[0],
                    e.currentTarget.value.split(":")[1]
                  ),
                });
              }}
            />
          </FormItem>
          <FormItem
            top="По"
            status={formsData.start < formsData.end ? "valid" : "error"}
            bottom={
              formsData.start < formsData.end
                ? ""
                : "Окончание должно быть позже начала!"
            }
          >
            <Input
              type="time"
              required
              defaultValue={
                event === undefined ? "" : getHoursAndMinutes(formsData.end)
              }
              onInput={(e) =>
                setFormsData({
                  ...formsData,
                  end: new Date(
                    2020,
                    0,
                    1,
                    e.currentTarget.value.split(":")[0],
                    e.currentTarget.value.split(":")[1]
                  ),
                })
              }
            />
            {/* {time picer} */}
          </FormItem>
        </FormLayoutGroup>
        <Div>
          <Button
            size="l"
            stretched
            disabled={!formsDataIsValid(formsData)}
            onClick={(e) => {
              // console.log(formsData);
              if (onSave !== undefined) onSave(formsData);
              save_event(formsData, setSnackbar);
            }}
          >
            {event === undefined
              ? "Создать мероприятие"
              : "Сохранить изменения"}
          </Button>
        </Div>
      </FormLayout>
    </Group>
  );
};
