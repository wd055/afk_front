import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';

import ModalRoot from '@vkontakte/vkui/dist/components/ModalRoot/ModalRoot';
import ModalPage from '@vkontakte/vkui/dist/components/ModalPage/ModalPage';
import ModalPageHeader from '@vkontakte/vkui/dist/components/ModalPageHeader/ModalPageHeader';
import List from '@vkontakte/vkui/dist/components/List/List';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import InfoRow from '@vkontakte/vkui/dist/components/InfoRow/InfoRow';

import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import ConfigProvider from '@vkontakte/vkui/dist/components/ConfigProvider/ConfigProvider';

import Icon24Error from '@vkontakte/icons/dist/24/error';


import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	useRouteMatch,
	useParams
} from "react-router-dom";

import Home from './panels/Home';
import Profkom from './panels/Profkom';
import User from './panels/User';

import { redIcon, blueIcon, orangeBackground, blueBackground, redBackground } from './panels/style';

var origin = "https://thingworx.asuscomm.com:10888"
var main_url = "https://profkom-bot-bmstu.herokuapp.com/"
// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = () => {
	const [activePanel, setActivePanel] = useState('Home');
	const [history, setHistory] = useState(['Home'])
	const [fetchedUser, setUser] = useState(null);

	const [modal, setModal] = useState(null);
	const [modalData, setModalData] = useState({});
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	const [proforg, setProforg] = useState(false);
	const [login, setLogin] = useState(null);
	const [usersInfo, setUsersInfo] = useState(null);
	// const [login, setLogin] = useState("19У153");
	const [students, setStudents] = useState([]);
	const [snackbar, setSnackbar] = useState();

	bridge.send("VKWebAppGetUserInfo", {});
	useEffect(() => {
		window.addEventListener('popstate', () => goBack());
		// get_all_users();
		get_users_info();

		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
			if (type === 'VKWebAppOpenAppResult') {
				console.error("VKWebAppOpenAppResult")
			}
			if (type === 'VKWebAppCloseFailed') {
				console.error("VKWebAppCloseFailed")
			}
			if (type === 'VKWebAppGetUserInfoResult') {
				setUser(data.id)
			}
		});
		async function fetchData() {
			// const user = await bridge.send('VKWebAppGetUserInfo');
			// setUser(user);
			setPopout(null);
		}
		fetchData();
	}, []);

	function goBack() {
		console.log('history goBack 1', history)
		if (history.length === 1) {  // Если в массиве одно значение:
			bridge.send("VKWebAppClose", { "status": "success" }); // Отправляем bridge на закрытие сервиса.
		} else if (history.length > 1) { // Если в массиве больше одного значения:
			history.pop() // удаляем последний элемент в массиве.
			setActivePanel(history[history.length - 1]) // Изменяем массив с иторией и меняем активную панель.
		}
		console.log('history goBack 2', history)
	}

	function go(name) {
		console.log('history go 1', history)
		if (history[history.length - 1] != name) {
			window.history.pushState({ panel: name }, name); // Создаём новую запись в истории браузера
			setActivePanel(name); // Меняем активную панель
			history.push(name); // Добавляем панель в историю
		}
		console.log('history go 2', history)
	};

	function get_all_users() {
		var url = main_url + "profkom_bot/get_all_users/";
		if (students.length == 0 && students != null) {
			fetch(url, {
				method: 'POST',
				body: JSON.stringify({
					querys: window.location.search,
				}),
				headers: {
					'Origin': origin
				}
			})
				.then(response => response.json())
				.then((data) => {
					if (data != "Error") {
						console.log(data)
						setStudents(data)
						return (data)
					}
					else {
						// setSnackbar(<Snackbar
						// 	layout="vertical"
						// 	onClose={() => setSnackbar(null)}
						// 	before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
						// >
						// 	Ошибка подключения
						// </Snackbar>);
						return null
					}
				},
					(error) => {
						// setSnackbar(<Snackbar
						// 	layout="vertical"
						// 	onClose={() => setSnackbar(null)}
						// 	before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
						// >
						// 	Ошибка подключения
						// </Snackbar>);
						console.error('get_all_users:', error)
						return null
					})
		}
	}

	function get_users_info() {

		var url = main_url + "profkom_bot/get_form/";

		var data = {
			querys: window.location.search,
		}
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Origin': origin
			}
		})
			.then(response => response.json())
			.then((data) => {
				if (data != "Error") {
					console.log('get info:', data);
					setProforg(data.proforg);
					if (data.proforg == true){
						setActivePanel("Profkom");
						setHistory(["Profkom"])
					}
					setUsersInfo(data);
				} else {
					console.error('get info:', data);

					setSnackbar(<Snackbar
						layout="vertical"
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
					>
						Ошибка авторизации
					</Snackbar>);
				}
			},
				(error) => {
					setSnackbar(<Snackbar
						layout="vertical"
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
					>
						Ошибка подключения
					</Snackbar>);
					console.error('get info:', error)
				})
	}
	const parseQueryString = (string) => {
		return string.slice(1).split('&')
			.map((queryParam) => {
				let kvp = queryParam.split('=');
				return { key: kvp[0], value: kvp[1] }
			})
			.reduce((query, kvp) => {
				query[kvp.key] = kvp.value;
				return query
			}, {})
	};

	const queryParams = parseQueryString(window.location.search);
	const hashParams = parseQueryString(window.location.hash);

	if (hashParams["activePanel"] && activePanel != hashParams["activePanel"])
		setActivePanel(hashParams["activePanel"])

	console.log(queryParams)
	// console.log(hashParams)

	const modals = (
		<ModalRoot
			activeModal={modal}
			onClose={() => setModal(null)}>
			<ModalPage
				id={'select'}
				header={
					<ModalPageHeader
					//   left={IS_PLATFORM_ANDROID && <PanelHeaderButton onClick={this.modalBack}><Icon24Cancel /></PanelHeaderButton>}
					//   right={IS_PLATFORM_IOS && <PanelHeaderButton onClick={this.modalBack}><Icon24Dismiss /></PanelHeaderButton>}
					>
						Информация о пользователе
					</ModalPageHeader>
				}
			>
				<List>
					<Cell key={1}>
						<InfoRow header="Дата рождения">
							30 января 1993
	          			</InfoRow>
					</Cell>
					<Cell key={2}>
						<InfoRow header="Родной город">
							Ереван
	          			</InfoRow>
					</Cell>
					<Cell key={3}>
						<InfoRow header="Место работы">
							Команда ВКонтакте
	          			</InfoRow>
					</Cell>
				</List>
			</ModalPage>
		</ModalRoot>
	);

	return (
		<ConfigProvider isWebView={true}>
			<View
				activePanel={activePanel}
				history={history}
				onSwipeBack={goBack}
				popout={popout}
				modal={modals}
			>
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
					<Placeholder
						icon={<Icon56ErrorOutline style={redIcon} />}
						stretched
						id="Placeholder"
					>
						Ошибка авторизации<br />Попробуйте позже или свяжитесь с администратором группы!
								</Placeholder>
				</Panel>
				<Profkom id='Profkom' fetchedUser={fetchedUser} go={go}
					setPopout={setPopout} setModal={setModal} setLogin={setLogin}
					students={students} setStudents={setStudents}
					snackbar={snackbar} setSnackbar={setSnackbar} />
				<User id='User' fetchedUser={fetchedUser} go={go}
					setPopout={setPopout} setModal={setModal} login={login}
					snackbar={snackbar} setSnackbar={setSnackbar}
				/>
				<Home id='Home' fetchedUser={fetchedUser} go={go}
					setPopout={setPopout} login={login}
					snackbar={snackbar} setSnackbar={setSnackbar}
					students={students}
					setHistory={setHistory} setActivePanel={setActivePanel}
					proforg={proforg} setProforg={setProforg} 
					usersInfo={usersInfo}/>
			</View>
		</ConfigProvider>
	);
}

export default App;

