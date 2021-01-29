import React, { useState, useEffect } from "react";
import $ from "jquery";
import { main_url } from "../App.js";
import bridge from "@vkontakte/vk-bridge";

import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";

import {
  orangeBackground,
  blueBackground,
  redBackground,
  blueIcon,
  statusSnackbar,
  statusSnackbarText,
} from "./style";

import {
  FormLayoutGroup,
  SliderSwitch,
  Input,
  FormItem,
  Button,
  Div,
  DatePicker,
  PanelHeaderBack,
  RichCell,
  Group,
  List,
  Search,
  IconButton,
  Gradient,
  Spinner,
  Footer,
  TabbarItem,
  Header,
} from "@vkontakte/vkui";

import {
  Icon28QrCodeOutline,
  Icon24AddOutline,
  Icon24Qr,
  Icon28AddCircleOutline,
  Icon24Send,
  Icon24Download,
  Icon28ChevronBack,
} from "@vkontakte/icons";
import { EventForm } from "./src/calendar";

export const Event = (props) => {
  const [students, setStudents] = useState([]);
  const [updateStudentsList_v, updateStudentsList] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [next, setNext] = useState();
  const [download, setDownload] = useState(false);
  const [searchNewStudent, setSearchNewStudent] = useState(false);
  const [QROrder, setQROrder] = useState("final");
  const [QRData, setQRData] = useState();
  const [auth_type_is_single] = useState(
    props.globalProps.event.auth_type == "single"
  );
  var eventId = props.globalProps.event.id;
  const snackbarDelay = 2000;

  function set_visit(eventId, student_vk_id, auth_order) {
    $.ajax(`${main_url}api/event/${eventId}/set_visit/`, {
      method: "POST",
      data: { student_vk_id: student_vk_id, auth_order: auth_order },
    })
      .done(function (data) {
        console.log("data", data);
        statusSnackbarText(
          true,
          data.full_name ? data.full_name : "Успешно",
          props.setSnackbar,
          snackbarDelay
        );
      })
      .fail(function (data) {
        console.log("FAIL", data);
        statusSnackbarText(
          false,
          data.responseJSON,
          props.setSnackbar,
          snackbarDelay
        );
      })
      .always(function (data) {
        updateStudentsList({});
      });
  }

  function send_report(eventId, auth_order) {
    $.ajax(
      `${main_url}api/event/${eventId}/send_report/?auth_order=${auth_order}`,
      {
        method: "POST",
      }
    )
      .done(function (data) {
        console.log("data", data);
        statusSnackbarText(true, "Успешно", props.setSnackbar, snackbarDelay);
      })
      .fail(function (data) {
        console.log("FAIL", data);
        statusSnackbarText(
          false,
          data.responseJSON,
          props.setSnackbar,
          snackbarDelay
        );
      });
  }

  function get_students(eventId, searchValue, next) {
    var url = `${main_url}api/visit/?event=${eventId}&search=${searchValue}`;
    if (searchNewStudent)
      url = `${main_url}api/event/${eventId}/search_new_students/?search=${searchValue}`;

    setDownload(true);
    $.ajax(next && next !== null ? next : url, {
      method: "GET",
    })
      .done(function (data) {
        // console.log("data", data);
        setNext(data.next);
        var studentsList = [];
        if (next && next !== null) studentsList = students;
        if (!searchNewStudent)
          for (var i in data.results) {
            studentsList.push({
              ...data.results[i].student_data,
              id: data.results[i].student,
              auth_order: data.results[i].auth_order,
            });
          }
        else {
          for (var i in data.results) {
            studentsList.push({
              ...data.results[i],
              id: data.results[i].student,
            });
          }
        }
        // console.log(studentsList);
        setStudents(studentsList);
      })
      .fail(function (data) {
        console.log("FAIL", data);
        statusSnackbar(data.status, props.setSnackbar);
      })
      .always(() => setDownload(false));
  }

  useEffect(() => {
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === "VKWebAppOpenCodeReaderResult") {
        try {
          data = JSON.parse(data.code_data);
        } catch (error) {
          console.error(error);
        }
        setQRData(data);
      }
      if (type === "VKWebAppOpenCodeReaderFailed") {
        // statusSnackbarText(
        //   false,
        //   JSON.stringify(data),
        //   props.setSnackbar,
        //   snackbarDelay
        // );
        console.error("VKWebAppOpenCodeReaderFailed", data);
      }
    });
    get_students(eventId, searchValue);
    // set_visit(eventId, 209826158);
  }, []);

  useEffect(() => {
    if (QRData && QRData.vk_user_id) {
      set_visit(eventId, QRData.vk_user_id, QROrder);
    } else if (QRData) {
      statusSnackbarText(
        false,
        "Ошибка в QR коде!",
        props.setSnackbar,
        snackbarDelay
      );
    }
  }, [QRData]);

  useEffect(() => {
    setNext(null);
    get_students(eventId, searchValue);
  }, [searchNewStudent, updateStudentsList_v]);

  return (
    <Panel id={props.id}>
      <PanelHeader left={<PanelHeaderBack onClick={() => props.goBack()} />}>
        Мероприятие
      </PanelHeader>
      <EventForm
        event={props.globalProps.event}
        setSnackbar={props.setSnackbar}
        setPopout={props.setPopout}
        goBack={props.goBack}
        onSave={props.goBack}
      />
      <Group header={<Header>Отчеты</Header>}>
        <Div style={{ display: "flex" }}>
          {!auth_type_is_single && (
            <Button
              size="l"
              style={{ marginRight: 8 }}
              onClick={() => send_report(eventId, "initial")}
              after={<Icon24Send />}
            >
              Отправить себе всех
            </Button>
          )}
          <Button
            size="l"
            style={{ marginRight: 8 }}
            onClick={() => send_report(eventId, "final")}
            after={<Icon24Send />}
          >
            Отправить себе закончивших
          </Button>
          {/* <Button
            size="l"
            disabled
            // disabled={this_mobile && !can_AppDownloadFile}
            // onClick={() => {
            //   if (this_mobile) {
            //     bridge.send("VKWebAppDownloadFile", {
            //       url: `${main_url}profkom_bot/download_contributions${
            //         window.location.search
            //       }${this_group.length > 0 ? "&group=" + this_group : ""}`,
            //       filename: "Профвзносы.xlsx",
            //     });
            //   } else {
            //     var link = document.createElement("a");
            //     link.href = `${main_url}profkom_bot/download_contributions${
            //       window.location.search
            //     }${this_group.length > 0 ? "&group=" + this_group : ""}`;
            //     link.download = `Профвзнос ${group}.xlsx`;
            //     link.click();
            //   }
            // }}
            after={<Icon24Download />}
          >
            Скачать
          </Button> */}
        </Div>
      </Group>
      <Group>
        <Gradient to="bottom" mode={searchNewStudent ? "tint" : "white"}>
          {/* <FormItem top="Тип авторизации">
            <SliderSwitch
              // onSwitch={(e) => setFormsData({ ...formsData, auth_type: e })}
              // activeValue={formsData.auth_type}
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
          </FormItem> */}
          <Div style={{ display: "flex" }}>
            <Search
              value={searchValue}
              onChange={(e) => {
                const { value } = e.currentTarget;
                setSearchValue(value);
                get_students(eventId, value);
              }}
              placeholder="Поиск по Фамилии или Имени"
            />
            {download && <Spinner size="medium" />}
            {props.this_mobile &&
              (auth_type_is_single ? (
                <IconButton
                  onClick={() => {
                    console.log("final");
                    setQROrder("final");
                    bridge.send("VKWebAppOpenCodeReader");
                  }}
                  icon={
                    <Icon28QrCodeOutline style={{ color: "var(--accent)" }} />
                  }
                  style={{ marginRight: 8 }}
                />
              ) : (
                <div
                  className="Tabbar Tabbar--l-vertical"
                  style={{ position: "static" }}
                >
                  <TabbarItem
                    onClick={() => {
                      console.log("initial");
                      setQROrder("initial");
                      bridge.send("VKWebAppOpenCodeReader");
                    }}
                    text="Начало"
                    selected
                  >
                    <Icon28QrCodeOutline style={{ paddingRight: 8 }} />
                  </TabbarItem>
                  <TabbarItem
                    onClick={() => {
                      console.log("final");
                      setQROrder("final");
                      bridge.send("VKWebAppOpenCodeReader");
                    }}
                    text="Конец"
                    selected
                  >
                    <Icon28QrCodeOutline style={{ paddingRight: 8 }} />
                  </TabbarItem>
                </div>
              ))}
            {!searchNewStudent && (
              <IconButton
                onClick={() => setSearchNewStudent(true)}
                icon={
                  <Icon28AddCircleOutline style={{ color: "var(--accent)" }} />
                }
                style={{ marginRight: 8 }}
              />
            )}
            {searchNewStudent && (
              <IconButton
                onClick={() => setSearchNewStudent(false)}
                icon={<Icon28ChevronBack style={{ color: "var(--accent)" }} />}
                style={{ marginRight: 8 }}
              />
            )}
          </Div>
          <Div
            style={{
              height: "450px",
              overflow: "auto",
              position: "relative",
            }}
            onScroll={(e) => {
              var element = e.currentTarget;
              console.log(
                element.scrollTop + element.clientHeight >=
                  element.scrollHeight - 100,
                element.scrollTop,
                element.clientHeight,
                element.scrollHeight - 100
              );
              if (
                element.scrollTop + element.clientHeight >=
                  element.scrollHeight - 250 &&
                !download &&
                next !== null
              ) {
                get_students(eventId, searchValue, next);
              }
            }}
          >
            <List>
              {students.map((student, i) => (
                <RichCell
                  key={student.id}
                  caption={
                    student.auth_order && student.auth_order === "initial"
                      ? "Начал"
                      : student.auth_order === "final"
                      ? auth_type_is_single
                        ? "Отметился"
                        : "Закончил"
                      : "Не начал"
                  }
                  actions={
                    <>
                      {student.auth_order && student.auth_order !== "final" && (
                        <Button
                          onClick={() =>
                            set_visit(eventId, student.vk_id, "final")
                          }
                          size="m"
                          mode="outline"
                        >
                          Завершить
                        </Button>
                      )}
                      {!student.auth_order && (
                        <>
                          <Button
                            onClick={() =>
                              set_visit(eventId, student.vk_id, "initial")
                            }
                            size="m"
                            mode="outline"
                          >
                            Начать
                          </Button>
                          <Button
                            onClick={() =>
                              set_visit(eventId, student.vk_id, "final_anyway")
                            }
                            size="m"
                            mode="outline"
                          >
                            Начать и Завершить
                          </Button>
                        </>
                      )}
                    </>
                  }
                >
                  {student.full_name}
                </RichCell>
              ))}
            </List>
            {!next && !download && (
              <Footer>По вашему запросу больше ничего нет</Footer>
            )}
          </Div>
        </Gradient>
      </Group>
    </Panel>
  );
};
