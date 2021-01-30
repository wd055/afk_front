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
  Select,
  CustomSelect,
  CustomSelectOption,
  Avatar,
  Alert,
  Textarea,
  MiniInfoCell,
  Footer,
  Spinner,
} from "@vkontakte/vkui";
import { Checkbox } from "@vkontakte/vkui/dist/components/Checkbox/Checkbox";
import {
  Icon28SchoolOutline,
  Icon28Users3Outline,
  Icon28MasksOutline,
  Icon28SunOutline,
  Icon20PlaceOutline,
  Icon20ArticleOutline,
  Icon16ClockOurline,
  Icon20UserOutline,
} from "@vkontakte/icons";
import { func } from "prop-types";

export function getDayOfWeek(date) {
  if (!date) date = new Date();
  return date.getDay() == 0 ? 6 : date.getDay() - 1;
}

export function getDateForRequest(date) {
  return (
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );
}

export const options_full = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

export const options_short = {
  hour: "2-digit",
  minute: "2-digit",
};

export function get_date_title(start, end) {
  return (
    start.toLocaleDateString("ru-RU", options_full) +
    " - " +
    end.toLocaleTimeString("ru-RU", options_short)
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
          event_type: data[i].event_type,
          address: data[i].address,
          description: data[i].description,
          favorite: data[i].favorite,
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
    method: formsData.id ? "PUT" : "POST",
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

function deleteEventRequest(eventId, setSnackbar, goBack) {
  $.ajax(`${main_url}api/event/${eventId}`, {
    method: "delete",
  })
    .done(function (data) {
      console.log("data", data);
      statusSnackbar(200, setSnackbar);
      goBack();
    })
    .fail(function (data) {
      console.log("FAIL", data.responseText);
      statusSnackbar(data.status, setSnackbar);
    });
}

function deleteEvent(eventId, setPopout, setSnackbar, goBack) {
  setPopout(
    <Alert
      actions={[
        {
          title: "Отмена",
          autoclose: true,
          mode: "cancel",
        },
        {
          title: "Удалить",
          autoclose: true,
          mode: "destructive",
          action: () => deleteEventRequest(eventId, setSnackbar, goBack),
        },
      ]}
      actionsLayout="horizontal"
      onClose={() => setPopout(null)}
      header="Удаление мероприятия"
      text="Вы уверены, что хотите удалить это мероприятие?"
    />
  );
}

type StudentInfoProps = {
  student: Object,
};

export const StudentInfo: FunctionComponent<StudentInfoProps> = (
  { student },
  props
) => {
  const [events, setEvents] = useState([]);
  const [download, setDownload] = useState(false);
  function get_students_visits() {
    setDownload(true);
    var url = `${main_url}afk_bot/get_students_events/${
      student && student.id && "?student=" + student.id}`
    $.ajax(url, {
      method: "GET",
    })
      .done(function (data) {
        data = JSON.parse(data);
        console.log("data", data);
        var eventsList = [];
        for (var i in data) {
          eventsList.push({
            ...data[i],
            start: new Date(data[i].start),
            end: new Date(data[i].end),
          });
        }
        console.log(eventsList);
        setEvents(eventsList);
      })
      .fail(function (data) {
        console.log("FAIL", data);
        // statusSnackbar(data.status, props.setSnackbar);
      })
      .always(() => setDownload(false));
  }
  useEffect(() => {
    get_students_visits();
  }, []);

  return (
    <>
      {student && student.full_name && (
        <Group>
          <MiniInfoCell before={<Icon20UserOutline />} textLevel="primary">
            {student.full_name}
          </MiniInfoCell>
        </Group>
      )}
      <Group>
        {download && <Spinner size="medium" />}
        {!download && (!events || events.length === 0) && (
          <Footer>Нет мероприятий</Footer>
        )}
        {events.map((event, i) => (
          <EventInfo key={event.id} event={event} />
        ))}
        {/* <MiniInfoCell before={event_types_icons[event.event_type]} textLevel="primary" textWrap="short">
        {event.title}
      </MiniInfoCell>
      <MiniInfoCell before={<Icon20PlaceOutline />} textWrap="full">
        {event.address}
      </MiniInfoCell>
      <MiniInfoCell before={<Icon16ClockOurline />} textWrap="full">
        {get_date_title(event.start, event.end)}
      </MiniInfoCell>
      <MiniInfoCell before={<Icon20ArticleOutline />} textWrap="full">
        {event.description}
      </MiniInfoCell> */}
      </Group>
    </>
  );
};

type EventInfoProps = {
  event: Object,
};

export const EventInfo: FunctionComponent<EventInfoProps> = (
  { event },
  props
) => {
  return (
    <Group>
      {event.title && event.title.length > 0 && (
        <MiniInfoCell
          before={event_types_icons[event.event_type]}
          textLevel="primary"
          textWrap="short"
        >
          {event.title}
        </MiniInfoCell>
      )}
      {event.address && event.address.length > 0 && (
        <MiniInfoCell before={<Icon20PlaceOutline />} textWrap="full">
          {event.address}
        </MiniInfoCell>
      )}
      {event.start && event.end && (
        <MiniInfoCell before={<Icon16ClockOurline />} textWrap="full">
          {get_date_title(event.start, event.end)}
        </MiniInfoCell>
      )}
      {event.description && event.description.length > 0 && (
        <MiniInfoCell before={<Icon20ArticleOutline />} textWrap="full">
          {event.description}
        </MiniInfoCell>
      )}
    </Group>
  );
};

export type EventItem = {
  id: Number,
  title: String,
  auth_type: String,
  start: String,
  end: String,
};

type EventFormProps = {
  setSnackbar: Function,
  setPopout?: Function,
  goBack?: Function,
  event?: Object,
  onSave?: Function,
  onEdit?: Function,
};

export const event_types_icons = {
  open_air: <Icon28SunOutline fill="var(--accent)" />,
  lecture: <Icon28SchoolOutline fill="var(--accent)" />,
  culture: <Icon28MasksOutline fill="var(--accent)" />,
  volunteering: <Icon28Users3Outline fill="var(--accent)" />,
  other: <></>,
};

export const event_types = [
  {
    value: "open_air",
    label: "Занятия на свежем воздухе",
    icon: event_types_icons.open_air,
  },
  {
    value: "lecture",
    label: "Лекции",
    icon: event_types_icons.lecture,
  },
  {
    value: "culture",
    label: "Культурные мероприятия",
    icon: event_types_icons.culture,
  },
  {
    value: "volunteering",
    label: "Волонтерская деятельност",
    icon: event_types_icons.volunteering,
  },
  { value: "other", label: "Другое", icon: event_types_icons.other },
];

const default_formsData = {
  title: "",
  auth_type: "",
  address: "",
  description: "",
  event_type: "other",
  favorite: false,
  start: new Date(2020, 0, 1),
  end: new Date(2020, 0, 1),
  event_date: {
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  },
};
export const EventForm: FunctionComponent<EventFormProps> = (
  { event, onSave, onEdit, setSnackbar, setPopout, goBack },
  props
) => {
  // console.log(props)
  const [formsData, setFormsData] = useState(
    event === undefined
      ? default_formsData
      : {
          id: event.id,
          title: event.title,
          address: event.address,
          description: event.description,
          event_type: event.event_type,
          favorite: event.favorite,
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
    // console.log("event", event);
  }, []);
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
        <FormItem top="Адрес">
          <Input
            type="text"
            defaultValue={formsData.address}
            onChange={(e) =>
              setFormsData({
                ...formsData,
                address: e.currentTarget.value,
              })
            }
          />
        </FormItem>
        <FormItem top="Описание">
          <Textarea
            defaultValue={formsData.description}
            onChange={(e) =>
              setFormsData({
                ...formsData,
                description: e.currentTarget.value,
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
        <FormItem>
          <Checkbox
            defaultChecked={formsData.favorite}
            onChange={(e) =>
              setFormsData({ ...formsData, favorite: e.currentTarget.checked })
            }
          >
            Избранное
          </Checkbox>
        </FormItem>
        <FormItem>
          <CustomSelect
            placeholder="Не выбрано"
            options={event_types}
            value={formsData.event_type}
            onChange={(option) =>
              setFormsData({
                ...formsData,
                event_type: option.currentTarget.value,
              })
            }
            renderOption={({ option: { icon }, ...otherProps }) => {
              return <CustomSelectOption before={icon} {...otherProps} />;
            }}
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
        <Div style={{ display: "flex" }}>
          <Button
            size="l"
            stretched
            disabled={!formsDataIsValid(formsData)}
            onClick={(e) => {
              // console.log(formsData);
              if (onSave !== undefined) onSave(formsData);
              save_event(formsData, setSnackbar);
              setFormsData(default_formsData);
            }}
          >
            {event === undefined
              ? "Создать мероприятие"
              : "Сохранить изменения"}
          </Button>
          {event !== undefined && (
            <Button
              size="l"
              mode="destructive"
              style={{ marginLeft: 8 }}
              onClick={() =>
                deleteEvent(formsData.id, setPopout, setSnackbar, goBack)
              }
            >
              Удалить
            </Button>
          )}
        </Div>
      </FormLayout>
    </Group>
  );
};
