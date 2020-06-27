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
import Radio from '@vkontakte/vkui/dist/components/Radio/Radio';
import Select from '@vkontakte/vkui/dist/components/Select/Select';
import Textarea from '@vkontakte/vkui/dist/components/Textarea/Textarea';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import HorizontalScroll from '@vkontakte/vkui/dist/components/HorizontalScroll/HorizontalScroll';
import CellButton from '@vkontakte/vkui/dist/components/CellButton/CellButton';
import Alert from '@vkontakte/vkui/dist/components/Alert/Alert';
import Header from '@vkontakte/vkui/dist/components/Header/Header';

import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';

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
import { func } from 'prop-types';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';

var origin = "https://thingworx.asuscomm.com:10888"
var main_url = "https://profkom-bot-bmstu.herokuapp.com/"
// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = () => {
	const [activePanel, setActivePanel] = useState('spinner');
	const [history, setHistory] = useState(['spinner'])
	const [fetchedUser, setUser] = useState(null);

	const [modal, setModal] = useState();
	const [modalData, setModalData] = useState({		
        payouts_type: "Выплаты профоргам и старостам",
        id: 11,
        date: "2020-06-27",
        status: "accepted",
        error: "asdawefwsd",
        delete: false,
        // surname_and_initials: "Власов Д.В.",
        students_group: "ИУ7-21Б",
        students_login: "19У153",
        students_name: "Власов Денис Владимирович",
		new:false,
	});
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	const [proforg, setProforg] = useState(false);
	const [login, setLogin] = useState(null);
	const [usersInfo, setUsersInfo] = useState(null);
	// const [login, setLogin] = useState("19У153");
	const [students, setStudents] = useState([]);
	const [snackbar, setSnackbar] = useState();
	const [categories, setCategories] = useState([]);
	const [payouts_types, setPayouts_type] = useState([]);
	const [searchValue, setSearchValue] = useState("");

	const PERIODICITY = {
        calendar_year: 'Раз в календарный год',
        academic_year: 'Раз в учебный год',
        semester: 'Раз в семестр',
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

	bridge.send("VKWebAppGetUserInfo", {});
	useEffect(() => {
		
		const queryParams = parseQueryString(window.location.search);
		const hashParams = parseQueryString(window.location.hash);		

		console.log(queryParams)
		// console.log(hashParams)
		if (hashParams["activePanel"] && activePanel != hashParams["activePanel"]){
			setActivePanel(hashParams["activePanel"]);
			setPopout(null);
		}else{
			get_form();
		}

		window.addEventListener('popstate', () => goBack());
		get_all_categories();
		get_all_payouts_type();
		// get_all_users();

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
			// setPopout(null);
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
			if (name == "Home"){
				get_form();
			}
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

	function get_all_categories() {

		var url = main_url + "profkom_bot/all_categories/";
		fetch(url, {
			method: 'POST',
			headers: {
				'Origin': origin
			}
		})
			.then(response => response.json())
			.then((data) => {
				setCategories(data)
			},
				(error) => {
					setSnackbar(<Snackbar
						layout="vertical"
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
					>
						Ошибка подключения
						</Snackbar>);
					console.error('get category:', error)
				})
	}

	function get_all_payouts_type() {

		var url = main_url + "profkom_bot/get_all_payouts_type/";
		fetch(url, {
			method: 'POST',
			headers: {
				'Origin': origin
			}
		})
			.then(response => response.json())
			.then((data) => {
				setPayouts_type(data)
				console.log(data)
			},
				(error) => {
					setSnackbar(<Snackbar
						layout="vertical"
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
					>Ошибка подключения</Snackbar>);
					console.error('get_all_payouts_type:', error)
				})
	}

	function get_form() {

		var url = main_url + "profkom_bot/get_form/";
		
		var data = {
			querys: window.location.search,
		}
		if (login != null)
			data.students_login = login

		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Origin': origin
			}
		})
			.then(response => response.json())
			.then((data) => {
				setPopout(null);
				if (data != "Error") {
					for (var i in data){
						if(data[i] == null || data[i] == 'none')
							data[i] = ""
					}
					console.log('app get form:', data);
					setUsersInfo(data);
					if (login == null) {
						setProforg(data.proforg);
						if (data.proforg == true){
							setActivePanel("Profkom");
							setHistory(["Profkom"])
						}else{
							setActivePanel("Home");
							setHistory(["Home"])
						}
					}
				} else {
					console.error('app get form:', data);
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
					setPopout(null);
					setSnackbar(<Snackbar
						layout="vertical"
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
					>
						Ошибка подключения
					</Snackbar>);
					console.error('app get form:', error)
				})
	}

	function on_modals_dutton_click(){
		check_radio_buttons();
		console.log(modalData)
		if (modalData.new == true){
			add_payout();
		}else{
			edit_payout()
		}
	}

	function add_payout() {
		var url = main_url + "profkom_bot/add_payout/";
		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				querys: window.location.search,
				students_login: modalData.students_login,
				payouts_type: modalData.payouts_type,
				status: modalData.status,
				error: modalData.error,
			}),
			headers: {
				'Origin': origin
			}
		})
			.then(response => response.json())
			.then((data) => {
				if (data != "Error") {
					setModal(null)
				}
				else {
					setSnackbar(<Snackbar
						layout="vertical"
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
					>
						Ошибка подключения
						</Snackbar>);
					console.error('add_payout:', data)
					return null
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
					console.error('add_payout:', error)
					return null
				})
	}

	function edit_payout() {
		var url = main_url + "profkom_bot/edit_payout/";
		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				querys: window.location.search,
				id: modalData.id,
				payouts_type: modalData.payouts_type,
				status: modalData.status,
				error: modalData.error,
				delete: modalData.delete,
			}),
			headers: {
				'Origin': origin
			}
		})
			.then(response => response.json())
			.then((data) => {
				if (data != "Error") {
					setModal(null)
				}
				else {
					setSnackbar(<Snackbar
						layout="vertical"
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
					>
						Ошибка подключения
						</Snackbar>);
					console.error('edit_payout:', data)
					return null
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
					console.error('edit_payout:', error)
					return null
				})
	}

	function check_radio_buttons(){
		var arr = document.getElementsByName('status');
		var status_id = -1;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].checked) {
				status_id = i;
			}
		}
		if (status_id == 0){
			modalData.status = "filed";
		}else if (status_id == 1){
			modalData.status = "accepted";
		}else if (status_id == 2){
			modalData.status = "err";
		}
	}

	const modals = (
		<ModalRoot
			activeModal={modal}
			onClose={() => setModal(null)}>
			<ModalPage
				id={'payout'}
				header={
					<ModalPageHeader
					//   left={IS_PLATFORM_ANDROID && <PanelHeaderButton onClick={this.modalBack}><Icon24Cancel /></PanelHeaderButton>}
					//   right={IS_PLATFORM_IOS && <PanelHeaderButton onClick={this.modalBack}><Icon24Dismiss /></PanelHeaderButton>}
					>Заявление</ModalPageHeader>}
			>
				<Group>
					<Cell size="l"
						bottomContent={
							<HorizontalScroll>
								<div style={{ display: 'flex' }}>
									{!modalData.new && <Button size="m" mode="outline">{modalData.id}</Button>}
									{!modalData.new && <Button size="m" mode="outline" style={{ marginLeft: 8 }}>{modalData.students_group}</Button>}
									{modalData.new && <Button size="m" mode="outline">{modalData.students_group}</Button>}
									<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{modalData.students_login}</Button>
								</div>
							</HorizontalScroll>
						}>{modalData.students_name}</Cell>
				</Group>
				<Group header={!modalData.new && <Header>{modalData.payouts_type}</Header>}>
					{!modalData.new && <Cell>
						<InfoRow header="Дата">
							{modalData.date}
						</InfoRow>
					</Cell>}
					<FormLayout>
						{modalData.new && <Select
							top="Тип заявление"
							placeholder="Выберите тип заявление"
							onChange={(e) => {
								const { value } = e.currentTarget;
								modalData.payouts_type = value;
							}}>
							{payouts_types.map((payouts_type, i) => (
								<option
									value={payouts_type.payout_type}
									id={payouts_type.payout_type}
								>{payouts_type.payout_type}</option>
							))}
						</Select>}
						<FormLayoutGroup top="Статус">
							<Radio
								name="status" value="filed"
								id="status_filed"
								defaultChecked={
									(modalData.status && modalData.status == "filed") ||
									modalData.new == true}
							>Подано</Radio>
							<Radio
								name="status" value="accepted"
								id="status_accepted"
								defaultChecked={modalData.status && modalData.status == "accepted"}
							>Принято</Radio>
							<Radio
								name="status" value="err"
								id="status_err"
								defaultChecked={modalData.status && modalData.status == "err"}
							>Ошибка в документах</Radio>
						</FormLayoutGroup>
						<Textarea
							top="Описание ошибки"
							id="error"
							defaultValue={modalData.error}
							// value={modalData.error} 
							onChange={(e) => {
								const { value } = e.currentTarget;
								modalData.error = value;
							}}
						/>
						{!modalData.new && <CellButton
							mode="danger"
							before={<Icon28DeleteOutline />}
							onClick={() => setPopout(<Alert
								actionsLayout="vertical"
								actions={[{
									title: 'Удалить',
									autoclose: true,
									mode: 'destructive',
									action: () => {
										modalData.delete = true;
										on_modals_dutton_click();
									},
								}, {
									title: 'Отмена',
									autoclose: true,
									mode: 'cancel'
								}]}
								onClose={() => setPopout(null)}
							>
								<h2>Подтвердите действие</h2>
								<p>Вы уверены, что хотите сохранить и удалить заявление?</p>
							</Alert>)}
						>Удалить заявление
							</CellButton>}
						<Button size="xl" onClick={on_modals_dutton_click}>Сохранить</Button>
					</FormLayout>
				</Group>
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
				<Panel id="spinner">
					<PanelHeader>Загрузка</PanelHeader>
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
					snackbar={snackbar} setSnackbar={setSnackbar}
					searchValue={searchValue} setSearchValue={setSearchValue} 
					setModalData={setModalData}
				/>
				<User id='User' fetchedUser={fetchedUser} go={go} goBack={goBack}
					setPopout={setPopout} setModal={setModal} login={login}
					snackbar={snackbar} setSnackbar={setSnackbar}
					setModalData={setModalData}
				/>
				<Home id='Home' fetchedUser={fetchedUser} go={go} goBack={goBack}
					setPopout={setPopout} login={login}
					snackbar={snackbar} setSnackbar={setSnackbar}
					students={students} categories={categories}
					setHistory={setHistory} setActivePanel={setActivePanel}
					proforg={proforg}
					usersInfo={usersInfo} setUsersInfo={setUsersInfo}/>
			</View>
		</ConfigProvider>
	);
}

export default App;

