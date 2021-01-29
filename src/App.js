import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  View,
  ConfigProvider,
  AdaptivityProvider,
  AppRoot,
  withAdaptivity,
  ViewWidth,
  usePlatform,
  VKCOM,
  SplitCol,
  SplitLayout,
} from "@vkontakte/vkui";
import ScreenSpinner from "@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner";
import "@vkontakte/vkui/dist/vkui.css";
import $ from "jquery";

import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import Placeholder from "@vkontakte/vkui/dist/components/Placeholder/Placeholder";
import Icon56CheckCircleOutline from "@vkontakte/icons/dist/56/check_circle_outline";
import Icon56ErrorOutline from "@vkontakte/icons/dist/56/error_outline";

import ModalRoot from "@vkontakte/vkui/dist/components/ModalRoot/ModalRoot";
import ModalPage from "@vkontakte/vkui/dist/components/ModalPage/ModalPage";
import ModalPageHeader from "@vkontakte/vkui/dist/components/ModalPageHeader/ModalPageHeader";
import Cell from "@vkontakte/vkui/dist/components/Cell/Cell";
import Radio from "@vkontakte/vkui/dist/components/Radio/Radio";
import Select from "@vkontakte/vkui/dist/components/Select/Select";
import Textarea from "@vkontakte/vkui/dist/components/Textarea/Textarea";
import Button from "@vkontakte/vkui/dist/components/Button/Button";
import Group from "@vkontakte/vkui/dist/components/Group/Group";
import HorizontalScroll from "@vkontakte/vkui/dist/components/HorizontalScroll/HorizontalScroll";
import CellButton from "@vkontakte/vkui/dist/components/CellButton/CellButton";
import Alert from "@vkontakte/vkui/dist/components/Alert/Alert";

import Icon28DeleteOutline from "@vkontakte/icons/dist/28/delete_outline";

import Snackbar from "@vkontakte/vkui/dist/components/Snackbar/Snackbar";
import Avatar from "@vkontakte/vkui/dist/components/Avatar/Avatar";

import {
  redIcon,
  blueIcon,
  redBackground,
  blueBackground,
  statusSnackbar,
  statusSnackbarText,
} from "./panels/style";

import { FormLayout, FormStatus, Link, SimpleCell } from "@vkontakte/vkui";

import {
  Icon28MessageOutline,
  Icon28LogoVkOutline,
  Icon24Error,
} from "@vkontakte/icons";
import List from "@vkontakte/vkui/dist/components/List/List";
import PanelHeaderButton from "@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton";

import { CalendarPanel } from "./panels/Calendar";
import { Event } from "./panels/Event";

const origin = "https://thingworx.asuscomm.com:10888";
export const main_url = "https://bmstu-afk.herokuapp.com/";
// export const main_url = "http://localhost:8000/";
// export const main_url = "http://thingworx.asuscomm.com/"

function App({ viewWidth }) {
  const [activePanel, setActivePanel] = useState("spinner");
  const [history] = useState([]);
  const [globalProps, setGlobalProps] = useState({});

  const [modal, setModal] = useState();

  const default_modal_data = {
    payouts_type: "",
    id: 1,
    date: "2001-01-01",
    status: "filed",
    error: "",
    delete: false,
    // surname_and_initials: "Власов Д.В.",
    students_group: "Группа",
    students_login: "Логин",
    students_name: "ФИО",
    new: false,
  };
  const [modalData, setModalData] = useState(default_modal_data);

  const [popout, setPopout] = useState(<ScreenSpinner size="large" />);

  const [login, setLogin] = useState(null);
  const [snackbar, setSnackbar] = useState();
  const [can_AppDownloadFile, set_can_AppDownloadFile] = useState(false);
  const [error_oauth, set_error_oauth] = useState(false);

  const modals_const = [];
  const parseQueryString = (string) => {
    return string
      .slice(1)
      .split("&")
      .map((queryParam) => {
        let kvp = queryParam.split("=");
        return { key: kvp[0], value: kvp[1] };
      })
      .reduce((query, kvp) => {
        // if (parseInt(kvp.value) || kvp.value === "0")
        // 	query[kvp.key] = parseInt(kvp.value);
        // else
        query[kvp.key] = kvp.value;
        return query;
      }, {});
  };

  // bridge.send("VKWebAppGetUserInfo", {});
  const queryParams = parseQueryString(window.location.search);
  const hashParams = parseQueryString(window.location.hash);
  useEffect(() => {
    bridge.send("VKWebAppGetClientVersion");
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === "VKWebAppUpdateConfig") {
      }
      if (type === "VKWebAppOpenAppResult") {
        console.error("VKWebAppOpenAppResult");
      }
      if (type === "VKWebAppCloseFailed") {
        console.error("VKWebAppCloseFailed");
      }
      if (type === "VKWebAppGetUserInfoResult") {
      }
      if (type === "VKWebAppGetClientVersionResult") {
        if (
          data["platform"] === "ios" ||
          (data["platform"] === "android" &&
            (parseInt(data["version"].split(".")[0]) > 6 ||
              (parseInt(data["version"].split(".")[0]) === 6 &&
                parseInt(data["version"].split(".")[1]) >= 11)))
        ) {
          set_can_AppDownloadFile(true);
        }
      }
    });

    // setPopout(null);

    if (
      hashParams["activePanel"] &&
      activePanel !== hashParams["activePanel"]
    ) {
      go(hashParams["activePanel"]);
      setPopout(null);
      // } else if (hashParams["registrationProforg"]){
      // 	console.log(hashParams["registrationProforg"])
      // 	registrationProforg(hashParams["registrationProforg"]);
    } else {
      get_admin_list();
      // get_form();
      // setActivePanel("ErrorOauth");
      // setPopout(null);
    }

    window.addEventListener("popstate", () => goBack());
  }, []);

  function get_admin_list() {
    $.ajax(`${main_url}afk_bot/get_admin_list/`, {
      method: "GET",
    })
      .done(function (data) {
        // console.log("data", data, JSON.parse(data));
        data = JSON.parse(data);
        if (
          Object.keys(data).find(
            (key) => data[key] === parseInt(queryParams["vk_user_id"])
          ) === undefined
        )
          go("Success");
        else go("Calendar");
        // statusSnackbarText(true, "Успешно", setSnackbar);
      })
      .fail(function (data) {
        console.log("FAIL", data);
        go("Success");
        statusSnackbarText(false, data.responseJSON, setSnackbar);
      })
      .always(() => {
        setPopout(null);
      });
  }

  function goBack() {
    // console.log('history goBack 1', history)
    if (history.length === 1) {
      bridge.send("VKWebAppClose", { status: "success" });
    } else if (history.length > 1) {
      if (modals_const.indexOf(history[history.length - 1]) != -1) {
        setModal(null);
      } else if (modals_const.indexOf(history[history.length - 2]) === -1) {
        setActivePanel(history[history.length - 2]);
      } else {
        setModal(history[history.length - 2]);
      }
      history.pop();
    }
    // console.log('history goBack 2', history)
  }

  function go(name, itsModal) {
    // console.log('history go 1', history, itsModal)
    if (history[history.length - 1] !== name) {
      if (itsModal) {
        setModal(name);
      } else {
        setActivePanel(name);
      }
      history.push(name);
      window.history.pushState({ panel: name }, name);
    }
    // console.log('history go 2', history)
  }

  function get_form() {
    setPopout(<ScreenSpinner size="large" />);
    var url = main_url + "afk_bot/get_form/";

    var data = {
      querys: window.location.search,
    };
    if (login !== null) data.students_login = login;
    // console.log(data)
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Origin: origin,
      },
    })
      .then((response) => response.json())
      .then(
        (data) => {
          // console.log("end req")
          setPopout(null);
          if (data !== "Error") {
            for (var i in data) {
              if (data[i] === null || data[i] === "none") data[i] = "";
            }
            // console.log('app get form:', data);

            // if (data.phone) {
            // 	const phoneNumber = parsePhoneNumberFromString(data.phone, 'RU')
            // 	if (phoneNumber) {
            // 		data.phone = phoneNumber.formatNational();
            // 	}
            // }

            // setUsersInfo(data);
            // setProforgsInfo(data);
            if (login === null) {
              // setProforg(data.proforg);
              if (data.proforg > 0) {
                go("Profkom");
              } else {
                go("Home");
              }
            }
          } else {
            set_error_oauth(true);
            console.error("app get form:", data);
            setSnackbar(
              <Snackbar
                layout="vertical"
                onClose={() => setSnackbar(null)}
                before={
                  <Avatar size={24} style={redBackground}>
                    <Icon24Error fill="#fff" width={14} height={14} />
                  </Avatar>
                }
              >
                Ошибка авторизации
              </Snackbar>
            );
          }
        },
        (error) => {
          console.log("end req");
          setPopout(null);
          setSnackbar(
            <Snackbar
              layout="vertical"
              onClose={() => setSnackbar(null)}
              before={
                <Avatar size={24} style={redBackground}>
                  <Icon24Error fill="#fff" width={14} height={14} />
                </Avatar>
              }
            >
              Ошибка подключения
            </Snackbar>
          );
          console.error("app get form:", error);
        }
      );
  }

  // const modals = (
  // 	<ModalRoot
  // 		activeModal={modal}
  // 		onClose={goBack}>
  // 		<ModalPage
  // 			id={'payout'}
  // 			header={
  // 				<ModalPageHeader
  // 				//   left={IS_PLATFORM_ANDROID && <PanelHeaderButton onClick={this.modalBack}><Icon24Cancel /></PanelHeaderButton>}
  // 				//   right={IS_PLATFORM_IOS && <PanelHeaderButton onClick={this.modalBack}><Icon24Dismiss /></PanelHeaderButton>}
  // 				>Заявление</ModalPageHeader>}
  // 		>
  // 			{<Group>
  // 				<Cell size="l"
  // 					onClick={() =>{
  // 						setLogin(modalData.login);
  // 						goBack();
  // 						go("User");
  // 					}}
  // 					bottomContent={
  // 						<HorizontalScroll>
  // 							<div style={{ display: 'flex' }}>
  // 								{!modalData.new && <React.Fragment>
  // 									<Button size="m" mode="outline">{modalData.id}</Button>
  // 									<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{modalData.date}</Button>
  // 									<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{modalData.group}</Button>
  // 								</React.Fragment>}
  // 								{modalData.new && <Button size="m" mode="outline">{modalData.group}</Button>}
  // 								<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{modalData.login}</Button>
  // 							</div>
  // 						</HorizontalScroll>
  // 					}>{modalData.name}</Cell>
  // 			</Group>}
  // 			<Group>
  // 					<Textarea
  // 						top="Комментарий"
  // 						id="error"
  // 						defaultValue={modalData.error}
  // 						// value={modalData.error}
  // 						onChange={(e) => {
  // 							const { value } = e.currentTarget;
  // 							modalData.error = value;
  // 						}}
  // 					/>
  // 					{!modalData.new && <CellButton
  // 						mode="danger"
  // 						before={<Icon28DeleteOutline />}
  // 						onClick={() => setPopout(<Alert
  // 							actionsLayout="vertical"
  // 							actions={[{
  // 								title: 'Удалить',
  // 								autoclose: true,
  // 								mode: 'destructive',
  // 								action: () => {
  // 									modalData.delete = true;
  // 									on_modals_dutton_click();
  // 								},
  // 							}, {
  // 								title: 'Отмена',
  // 								autoclose: true,
  // 								mode: 'cancel'
  // 							}]}
  // 							onClose={() => setPopout(null)}
  // 						>
  // 							<h2>Подтвердите действие</h2>
  // 							<p>Вы уверены, что хотите сохранить и удалить заявление?</p>
  // 						</Alert>)}
  // 					>Удалить заявление
  // 						</CellButton>}
  // 					<Button
  // 						size="xl"
  // 						onClick={on_modals_dutton_click}
  // 						disabled={(modalData.payouts_type === undefined && modalData.payouts_type === "")}
  // 					>Сохранить</Button>
  // 				</FormLayout>
  // 			</Group>
  // 		</ModalPage>
  // 	</ModalRoot>
  // );

  const panel_props = {
    globalProps: globalProps,
    setGlobalProps: setGlobalProps,
    go: go,
    goBack: goBack,
    setSnackbar: setSnackbar,
    setPopout: setPopout,
    queryParams: queryParams,
    this_mobile:
      queryParams.vk_platform === "mobile_android" ||
      queryParams.vk_platform === "mobile_iphone",
  };

  const isDesktop = true || viewWidth >= ViewWidth.SMALL_TABLET;
  const hasHeader = usePlatform() !== VKCOM;

  return (
    // <ConfigProvider isWebView={true}>
    //   <AdaptivityProvider>
    //     <AppRoot>
    <SplitLayout
      style={{ justifyContent: "center" }}
      header={hasHeader && <PanelHeader separator={false} />}
      popout={popout}
      // modal={modalRoot}
    >
      <SplitCol
        animate={!isDesktop}
        spaced={isDesktop}
        width={isDesktop ? "100%" : "100%"}
        maxWidth={isDesktop ? "100%" : "100%"}
      >
        <View
          activePanel={activePanel}
          history={history}
          onSwipeBack={goBack}
          popout={popout}
          // modal={modals}
        >
          <Panel id="spinner">
            <PanelHeader>Загрузка</PanelHeader>
            {error_oauth === true && (
              <>
                <FormLayout>
                  <FormStatus header="Ошибка авторизации" mode="error">
                    Пожалуйста, свяжитесь с одним из администраторов группы:
                  </FormStatus>
                </FormLayout>
                <Link href={"https://vk.com/im?sel=159317010"} target="_blank">
                  <SimpleCell
                    before={
                      <Avatar
                        size={40}
                        src={
                          "https://sun3-10.userapi.com/impg/c857736/v857736442/11b69a/3EXGrxmOotc.jpg?size=50x0&quality=88&crop=0,51,805,805&sign=e1b6232589d2b523eccadb720bc15b0c&ava=1"
                        }
                      />
                    }
                    after={<Icon28MessageOutline />}
                  >
                    Денис
                  </SimpleCell>
                </Link>
              </>
            )}
            {snackbar}
          </Panel>

          <Panel id="Success">
            <PanelHeader>Успешная авторизация</PanelHeader>
            <Placeholder
              icon={<Icon56CheckCircleOutline style={blueIcon} />}
              stretched
              id="Placeholder"
            >
              Успешная авторизация!
            </Placeholder>
          </Panel>

          <Panel id="ErrorOauth">
            <PanelHeader>Ошибка авторизации</PanelHeader>
            <Group>
              <Placeholder
                icon={<Icon56ErrorOutline style={redIcon} />}
                stretched
                id="Placeholder"
              >
                Ошибка авторизации
                <br />
                Попробуйте позже или свяжитесь с администратором группы!
              </Placeholder>
            </Group>
          </Panel>

          <CalendarPanel {...panel_props} id="Calendar" />

          <Event {...panel_props} id="Event" />
        </View>
      </SplitCol>
      {snackbar}
    </SplitLayout>
  );
  {
    /* </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider> */
  }
}

App = withAdaptivity(App, { viewWidth: true });

export default App;
