import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';

import ModalRoot from '@vkontakte/vkui/dist/components/ModalRoot/ModalRoot';
import ModalPage from '@vkontakte/vkui/dist/components/ModalPage/ModalPage';
import ModalPageHeader from '@vkontakte/vkui/dist/components/ModalPageHeader/ModalPageHeader';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Radio from '@vkontakte/vkui/dist/components/Radio/Radio';
import Select from '@vkontakte/vkui/dist/components/Select/Select';
import Textarea from '@vkontakte/vkui/dist/components/Textarea/Textarea';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import HorizontalScroll from '@vkontakte/vkui/dist/components/HorizontalScroll/HorizontalScroll';
import CellButton from '@vkontakte/vkui/dist/components/CellButton/CellButton';
import Alert from '@vkontakte/vkui/dist/components/Alert/Alert';

import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon24Error from '@vkontakte/icons/dist/24/error';

import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import ConfigProvider from '@vkontakte/vkui/dist/components/ConfigProvider/ConfigProvider';

import {Home, POLICY} from './panels/Home';
import ATTACH_DOCUMENTS from './panels/ATTACH_DOCUMENTS';
import Profkom from './panels/Profkom';
import User from './panels/User';
import Settings from './panels/Settings';
import REGISTRATRION_PROFORG from './panels/REGISTRATRION_PROFORG';
import DOWNLOAD_CSV from './panels/DOWNLOAD_CSV';
import DOWNLOAD_DOCS from './panels/DOWNLOAD_DOCS';

import MESSAGE_HISTORY from './panels/mailing/MESSAGE_HISTORY';
import INDIVIDUAL_MAILING from './panels/mailing/INDIVIDUAL_MAILING';
import MAILING_USERS from './panels/mailing/MAILING_USERS';
import MASS_MAILING from './panels/mailing/MASS_MAILING';
import MASS_MAILING_USERS from './panels/mailing/MASS_MAILING_USERS';
import SET_CATEGORIES_MASS_MAILING from './panels/mailing/SET_CATEGORIES_MASS_MAILING';
import MAILING from './panels/mailing/MAILING';
import EDIT_MAILING from './panels/mailing/EDIT_MAILING';

import { redIcon, blueIcon, redBackground, blueBackground, statusSnackbar } from './panels/style';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';
import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon16Done from '@vkontakte/icons/dist/16/done';
import TabbarItem from '@vkontakte/vkui/dist/components/TabbarItem/TabbarItem';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import FormStatus from '@vkontakte/vkui/dist/components/FormStatus/FormStatus';
import Link from '@vkontakte/vkui/dist/components/Link/Link';
import Icon28LogoVkOutline from '@vkontakte/icons/dist/28/logo_vk_outline';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import Icon28MessageOutline from '@vkontakte/icons/dist/28/message_outline';
import List from '@vkontakte/vkui/dist/components/List/List';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';

const origin = "https://thingworx.asuscomm.com:10888"
const main_url = "https://profkom-bot-bmstu.herokuapp.com/"
// const main_url = "http://thingworx.asuscomm.com/"
// const main_url = "http://localhost:8000/"

const App = () => {
	const [activePanel, setActivePanel] = useState('spinner');
	const [history] = useState([])

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
	}
	const [modalData, setModalData] = useState(default_modal_data);

	const student_default_value = {
		birthday: "2001-01-01",
		categories: [],
		domain: null,
		email: null,
		group: "Загрузка...",
		name: "ФИО",
		payments_edu: "free",
		phone: null,
		photo_100: "",
		users_payouts: [],
		proforg: false
	}
	const [student, setStudent] = useState(student_default_value);

	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	const [proforg, setProforg] = useState(false);
	const [proforgsInfo, setProforgsInfo] = useState();
	const [login, setLogin] = useState(null);
	const [usersInfo, setUsersInfo] = useState(null);
	// const [login, setLogin] = useState("19У153");
	const [students, setStudents] = useState([]);
	const [snackbar, setSnackbar] = useState();
	const [categories, setCategories] = useState([]);
	const [payouts_types, setPayouts_type] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [tabsState, setTabsState] = useState('students');
	const [searchPayouts, setSearchPayouts] = useState([]);

	const [list_of_users, set_list_of_users] = useState([]);
	const [mailingCategories, setMailingCategories] = useState([]);
	const [messageValue, setMessageValue] = useState();
	const [payments_edu, setPayments_edu] = useState();
	const [proforg_mailing, set_proforg_mailing] = useState();
	const [group, setGroup] = useState();
	const [countAttachments, setCountAttachments] = useState(0);
	const [attachments, setAttachments] = useState([]);
	const [tooltips, setTooltips] = useState([]);
	const [payouts_type, set_payouts_type] = useState("");
	const [students_documents, set_students_documents] = useState([]);
	const [tokens, setTokens] = useState([]);
	const [can_AppDownloadFile, set_can_AppDownloadFile] = useState(false);
	const [error_oauth, set_error_oauth] = useState(false);

	const modals_const = [
		'payout',
		'сontributions',
		'add_registrationProforg',
		'edit_document'
	]
	const parseQueryString = (string) => {
		return string.slice(1).split('&')
			.map((queryParam) => {
				let kvp = queryParam.split('=');
				return { key: kvp[0], value: kvp[1] }
			})
			.reduce((query, kvp) => {
				// if (parseInt(kvp.value) || kvp.value === "0")
				// 	query[kvp.key] = parseInt(kvp.value);
				// else
				query[kvp.key] = kvp.value;
				return query
			}, {})
	};

	// bridge.send("VKWebAppGetUserInfo", {});
	const queryParams = parseQueryString(window.location.search);
	const hashParams = parseQueryString(window.location.hash);
	useEffect(() => {
		bridge.send("VKWebAppGetClientVersion");
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
			}
			if (type === 'VKWebAppOpenAppResult') {
				console.error("VKWebAppOpenAppResult")
			}
			if (type === 'VKWebAppCloseFailed') {
				console.error("VKWebAppCloseFailed")
			}
			if (type === 'VKWebAppGetUserInfoResult') {
			}
			if (type === 'VKWebAppGetClientVersionResult') {
				if (data['platform'] === "ios" ||
					(data['platform'] === "android" &&
						(
							parseInt(data['version'].split('.')[0]) > 6 ||
							(parseInt(data['version'].split('.')[0]) === 6 &&
								parseInt(data['version'].split('.')[1]) >= 11)
							
						)
					)
				) {
					set_can_AppDownloadFile(true);
				}
			}
		});

		// console.log(queryParams)
		// console.log(hashParams)
		if (hashParams["activePanel"] && activePanel !== hashParams["activePanel"]) {
			setActivePanel(hashParams["activePanel"]);
			setPopout(null);
		} else if (hashParams["registrationProforg"]){
			console.log(hashParams["registrationProforg"])
			registrationProforg(hashParams["registrationProforg"]);
		} else {
			get_form();
		}

		window.addEventListener('popstate', () => goBack());
		get_all_categories();
		get_all_payouts_type();
		// get_all_users();


	}, []);

	// bridge.send("VKWebAppInit");	

	function goBack() {
		// console.log('history goBack 1', history)
		if (history.length === 1) {
			bridge.send("VKWebAppClose", { "status": "success" });
		} else if (history.length > 1) {
			if (modals_const.indexOf(history[history.length - 1]) > -1) {
				// setSearchPayouts([]);
				// setSearchValue("");
				setModal(null);
			} else if (modals_const.indexOf(history[history.length - 2]) === -1) {
				if (history[history.length - 2] === "Profkom") {
					setStudent(student_default_value);
				}
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
			if (name === "Home") {
				setUsersInfo(null);
				get_form();
			}
			if (itsModal) {
				setModal(name);
			} else {
				// if (name !== "Home") {
				// 	setStudent(student_default_value);
				// }
				setActivePanel(name);
			}
			history.push(name);
			window.history.pushState({ panel: name }, name);
		}
		// console.log('history go 2', history)
	};

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
				// console.log(data)
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
				// console.log(data)
				setPayouts_type(data)
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

		setPopout(<ScreenSpinner size='large' />);
		var url = main_url + "profkom_bot/get_form/";

		var data = {
			querys: window.location.search,
		}
		if (login !== null)
			data.students_login = login
		// console.log(data)
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Origin': origin
			}
		})
			.then(response => response.json())
			.then((data) => {
				// console.log("end req")
				setPopout(null);
				if (data !== "Error") {
					for (var i in data) {
						if (data[i] === null || data[i] === 'none')
							data[i] = ""
					}
					// console.log('app get form:', data);

					// if (data.phone) {
					// 	const phoneNumber = parsePhoneNumberFromString(data.phone, 'RU')
					// 	if (phoneNumber) {
					// 		data.phone = phoneNumber.formatNational();
					// 	}
					// }

					setUsersInfo(data);
					setProforgsInfo(data);
					if (login === null) {
						setProforg(data.proforg);
						if (data.proforg > 0) {
							go("Profkom");
						} else {
							go("Home");
						}
					}
				} else {
					set_error_oauth(true);
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
					console.log("end req")
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

	function registrationProforg(token) {
		var url = main_url + "profkom_bot/registrationProforg/";
		console.log(token)

		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				querys: window.location.search,
				token: token,
			}),
			headers: {
				'Origin': origin
			}
		})
			.then(function(response) {
				get_form();
				if (!response.ok) {
					// setSnackbar(<Snackbar
					// 	layout="vertical"
					// 	onClose={() => setSnackbar(null)}
					// 	before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
					// >
					// 	Ошибка авторизации
					// </Snackbar>);
					statusSnackbar(response.code, setSnackbar);

					console.error('registrationProforg form:')
					throw Error(response.statusText);
				}else{
					return response.json();
				}
			})
			.then((data) => {
				// console.log(data)
				// get_form();
			},
				(error) => {
					setSnackbar(<Snackbar
						layout="vertical"
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
					>
						Ошибка подключения
					</Snackbar>);
					console.error('registrationProforg form:', error)
				})
	}
	
	function Attachments() {
		var rows = [];
		for (var i = 0; i < countAttachments; i++) {
			rows.push(<Div key={i}>
				<Input
					id={"input_attachment_" + i}
					key={i}
					onChange={(e) => {
						const { value } = e.currentTarget;
						var temp = attachments;
						var n = e.target.getAttribute('id').replace("input_attachment_", "");
						temp[n] = value;
						setAttachments(temp);
					}}
					defaultValue={attachments[i]}
				/>
			</Div>)
		}
		return <Group
			header={<Header
				key="attachments_header"
				mode="secondary"
				aside={<Tabs mode="buttons">
					<TabsItem selected={true} onClick={() => { setCountAttachments(countAttachments + 1) }}>+</TabsItem>
					<TabsItem selected={true} onClick={() => {
						setCountAttachments(Math.max(countAttachments - 1, 0));
						setAttachments(attachments.slice(0, -1));
					}}>-</TabsItem>
				</Tabs>}
			>Прикрепить</Header>}
			description="Ссылку ВК на документ (саму ссылку, начинающуюся с photo-... или doc-... и тп)"
		>
			{rows}
		</Group>;
	}

	//modals funcs
	function on_modals_dutton_click() {
		check_radio_buttons();
		// console.log(modalData)
		if (modalData.new === true) {
			add_payout();
		} else {
			edit_payout();
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
				category: modalData.category,
			}),
			headers: {
				'Origin': origin
			}
		})
			.then(response => response.json())
			.then((data) => {
				if (data !== "Error") {
					if (student.users_payouts) {
						student.users_payouts.push(data);
					}
					// console.log(data);
					setSnackbar(<Snackbar
						layout="vertical"
						duration={1000*10}
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={blueBackground}><Icon16Done fill="#fff" width={14} height={14} /></Avatar>}
					>Успешно! Номер заявления: {data.id}</Snackbar>);
					goBack();
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
				if (data !== "Error") {
					goBack();
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

	function edit_сontributions() {
		check_сontributions_radio_buttons();
		var url = main_url + "profkom_bot/edit_contributions/";
		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				querys: window.location.search,
				students_login: modalData.login,
				status: modalData.сontributions,
			}),
			headers: {
				'Origin': origin
			}
		})
			.then(response => response.json())
			.then((data) => {
				console.log(modalData)
				var temp = JSON.parse(JSON.stringify(students));
				for (var i in students){
					if (temp[i].login === modalData.login){
						console.log(temp[i], i)
						temp[i].сontributions = modalData.сontributions;
						break;
					}
				}
				console.log(temp)
				setStudents(temp);
				goBack();
			},
				(error) => {
					setSnackbar(<Snackbar
						layout="vertical"
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
					>
						Ошибка подключения
						</Snackbar>);
					console.error('edit_contributions:', error)
					return null
				})
	}

	function check_radio_buttons() {
		var arr = document.getElementsByName('status');
		var status_id = -1;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].checked) {
				status_id = i;
			}
		}
		if (status_id === 0) {
			modalData.status = "filed";
		} else if (status_id === 1) {
			modalData.status = "accepted";
		} else if (status_id === 2) {
			modalData.status = "err";
		}
	}

	function check_сontributions_radio_buttons() {
		var arr = document.getElementsByName('status_сontributions');
		var status_id = -1;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].checked) {
				status_id = i;
			}
		}
		if (status_id === 0) {
			modalData.сontributions = "none";
		} else if (status_id === 1) {
			modalData.сontributions = "studentship";
		} else if (status_id === 2) {
			modalData.сontributions = "paid";
		} else if (status_id === 3) {
			modalData.сontributions = "deny";
		}
	}

	function check_add_registrationProforg_radio_buttons() {
		var arr = document.getElementsByName('radio_registrationProforg');
		var status_id = -1;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].checked) {
				status_id = i;
			}
		}
		add_registrationProforg(status_id + 1)
	}

	function add_registrationProforg(proforg_level) {
		var url = main_url + "profkom_bot/add_registrationProforg/";
		console.log(document.getElementById('datetime_registrationProforg').value)
		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				querys: window.location.search,
				proforg_level: proforg_level,
				date_delete: document.getElementById('datetime_registrationProforg').value
			}),
			headers: {
				'Origin': origin
			}
		})
			.then(function(response) {
				if (!response.ok) {
					statusSnackbar(response.code, setSnackbar);
					console.error('add_registrationProforg:', response)
					throw Error(response.statusText);
				}
				return response.json();				
			})
			.then((data) => {
				// console.log(data);
				data.proforg_level = proforg_level;
				var temp = JSON.parse(JSON.stringify(tokens));
				temp.push(data);
				setTokens(temp);
				goBack();
			},
				(error) => {
					statusSnackbar(0, setSnackbar)
					console.error('add_registrationProforg:', error)
				})
	}

	const [help_temp, set_help_temp] = useState(0);

	async function save_image_data() {
		var url = main_url + "profkom_bot/edit_document/";
		var data = {
			querys: window.location.search,
			name: modalData.name,
			categories: modalData.categories,
			docs_type: modalData.docs_type
		}
		try {
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Origin': origin
				}
			});
			const json = await response.json();
			if (response.ok) {
				console.log("success")
				var temp = JSON.parse(JSON.stringify(students_documents));
				temp[modalData.i].categories = modalData.categories;
				temp[modalData.i].docs_type = modalData.docs_type;
				set_students_documents(temp);
				goBack();
			} else {
				statusSnackbar(response.status, setSnackbar);
				console.error('save_image_data:', data);
			}
		} catch (error) {
			setPopout(null);
			statusSnackbar(0, setSnackbar);
			console.error('save_image_data:', error);
		}
	}

	function getDateAdd_registrationProforg(){
		var now = new Date();
		now.setDate(now.getDate()+1);
		now.setHours(now.getHours()+3);
		return now.toISOString().slice(0,16);
	}
	
	const modals = (
		<ModalRoot
			activeModal={modal}
			onClose={goBack}>
			<ModalPage
				id={'payout'}
				header={
					<ModalPageHeader
					//   left={IS_PLATFORM_ANDROID && <PanelHeaderButton onClick={this.modalBack}><Icon24Cancel /></PanelHeaderButton>}
					//   right={IS_PLATFORM_IOS && <PanelHeaderButton onClick={this.modalBack}><Icon24Dismiss /></PanelHeaderButton>}
					>Заявление</ModalPageHeader>}
			>
				{/* <Group>
					<Cell size="l"
						onClick={() =>{
							setLogin(modalData.students_login);
							goBack();
							go("User");
						}}
						bottomContent={
							<HorizontalScroll>
								<div style={{ display: 'flex' }}>
									{!modalData.new && <React.Fragment>
										<Button size="m" mode="outline">{modalData.id}</Button>
										<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{modalData.date}</Button>
										<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{modalData.students_group}</Button>
									</React.Fragment>}
									{modalData.new && <Button size="m" mode="outline">{modalData.students_group}</Button>}
									<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{modalData.students_login}</Button>
								</div>
							</HorizontalScroll>
						}>{modalData.students_name}</Cell>
				</Group> */}
				{<Group>
					<Cell size="l"
						onClick={() =>{
							setLogin(modalData.login);
							goBack();
							go("User");
						}}
						bottomContent={
							<HorizontalScroll>
								<div style={{ display: 'flex' }}>
									{!modalData.new && <React.Fragment>
										<Button size="m" mode="outline">{modalData.id}</Button>
										<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{modalData.date}</Button>
										<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{modalData.group}</Button>
									</React.Fragment>}
									{modalData.new && <Button size="m" mode="outline">{modalData.group}</Button>}
									<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{modalData.login}</Button>
								</div>
							</HorizontalScroll>
						}>{modalData.name}</Cell>
				</Group>}
				<Group>
					{/* {!modalData.new && <Cell>
						<InfoRow header="Дата">
							{modalData.date}
						</InfoRow>
					</Cell>} */}
					<FormLayout>
						<Select
							top="Тип заявление"
							placeholder="Выберите тип заявление"
							defaultValue={modalData.payouts_type}
							onChange={(e) => {
								const { value } = e.currentTarget;
								modalData.payouts_type = value;
								set_help_temp(help_temp + 1);
							}}
							status={(modalData.payouts_type !== undefined && modalData.payouts_type !== "") ? 'valid' : 'error'}
							bottom={(modalData.payouts_type !== undefined && modalData.payouts_type !== "") ?
								'' : 'Выберите тип заявления'}
							required
						>
							{payouts_types.map((payouts_type, i) => (
								<option
									key={payouts_type.payout_type}
									value={payouts_type.payout_type}
									id={payouts_type.payout_type}
								>{payouts_type.payout_type}</option>
							))}
						</Select>
						<Select
							top="Причина"
							placeholder="Выберите причину"
							defaultValue={modalData.category}
							onChange={(e) => {
								const { value } = e.currentTarget;
								modalData.category = value;
								set_help_temp(help_temp + 1);
							}}
							status={(modalData.category !== undefined && modalData.category !== "") ? 'valid' : 'error'}
							bottom={(modalData.category !== undefined && modalData.category !== "") ?
								'' : 'Выберите причину'}
							required
						>
							{categories.map((category, i) => (
								<option
									key={category}
									value={category}
									id={category}
								>{category}</option>
							))}
						</Select>
						<FormLayoutGroup top="Статус">
							<Radio
								name="status" value="filed"
								id="status_filed"
								defaultChecked={
									(modalData.status && modalData.status === "filed") ||
									modalData.new === true}
							>Подано</Radio>
							<Radio
								name="status" value="accepted"
								id="status_accepted"
								defaultChecked={modalData.status && modalData.status === "accepted"}
							>Принято</Radio>
							<Radio
								name="status" value="err"
								id="status_err"
								defaultChecked={modalData.status && modalData.status === "err"}
							>Ошибка в документах</Radio>
						</FormLayoutGroup>
						<Textarea
							top="Комментарий"
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
						<Button 
							size="xl" 
							onClick={on_modals_dutton_click}
							disabled={(modalData.payouts_type === undefined && modalData.payouts_type === "")}
						>Сохранить</Button>
					</FormLayout>
				</Group>
			</ModalPage>
			<ModalPage
				id={'сontributions'}
				header={
					<ModalPageHeader
					//   left={IS_PLATFORM_ANDROID && <PanelHeaderButton onClick={this.modalBack}><Icon24Cancel /></PanelHeaderButton>}
					//   right={IS_PLATFORM_IOS && <PanelHeaderButton onClick={this.modalBack}><Icon24Dismiss /></PanelHeaderButton>}
					>Профвзнос</ModalPageHeader>}
			>
				<Group>
					<Cell size="l"
						onClick={() =>{
							setLogin(modalData.login);
							goBack();
							go("User");
						}}
						bottomContent={
							<HorizontalScroll>
								<div style={{ display: 'flex' }}>
									<Button size="m" mode="outline">
										{modalData.group}
									</Button>
									<Button size="m" mode="outline" style={{ marginLeft: 8 }}>
										{modalData.login}
									</Button>
								</div>
							</HorizontalScroll>
						}>{modalData.name}</Cell>
				</Group>
				<Group>
					<FormLayout>
						<FormLayoutGroup top="Статус">
							<Radio
								name="status_сontributions" value="none"
								id="status_none"
								defaultChecked={modalData.сontributions === "none"}
							>Не заполнено</Radio>
							<Radio
								name="status_сontributions" value="studentship"
								id="status_studentship"
								defaultChecked={modalData.сontributions === "studentship"}
							>Стипендия</Radio>
							<Radio
								name="status_сontributions" value="paid"
								id="status_paid"
								defaultChecked={modalData.сontributions === "paid"}
							>Оплачено</Radio>
							<Radio
								name="status_сontributions" value="deny"
								id="status_deny"
								defaultChecked={modalData.сontributions === "deny"}
							>Отказ</Radio>
						</FormLayoutGroup>
						<Button size="xl" onClick={edit_сontributions}>Сохранить</Button>
					</FormLayout>
				</Group>
			</ModalPage>
			<ModalPage
				id={'add_registrationProforg'}
				header={
					<ModalPageHeader
					//   left={IS_PLATFORM_ANDROID && <PanelHeaderButton onClick={this.modalBack}><Icon24Cancel /></PanelHeaderButton>}
					//   right={IS_PLATFORM_IOS && <PanelHeaderButton onClick={this.modalBack}><Icon24Dismiss /></PanelHeaderButton>}
					>Приглашение</ModalPageHeader>}
			>
				<FormLayout>
					<FormLayoutGroup top="Роль">
						<Radio
							name="radio_registrationProforg" value={1}
							id="radio_1"
							defaultChecked={true}
						>Профорг</Radio>
						<Radio
							name="radio_registrationProforg" value={2}
							id="radio_2"
						>Дежурный</Radio>
						<Radio
							name="radio_registrationProforg" value={3}
							id="radio_3"
						>Председатель</Radio>
					</FormLayoutGroup>
					<FormLayoutGroup top="Окончание действия приглашения">
						<div						
							style={{
								marginRight: 40,
								marginLeft: 12,
							}}
						>
							<input
								style={{
									fontSize: "16px",
									display: "block",
									position: "relative",
									alignItems: "center",
									left: "0",
									top: "0",
									width: "100%",
									height: "100%",
									borderRadius: "10px",
									padding: "12px",
									border: "1px solid var(--field_border)",
									background: "var(--field_background)",
									color: "var(--text_primary)",
								}}
								id="datetime_registrationProforg"
								type="datetime-local"
								required
								defaultValue={getDateAdd_registrationProforg()}
								onChange={(e) => {
									const { value } = e.currentTarget;
									console.log(value);
								}}
							/>
						</div>
					</FormLayoutGroup>
					<Button size="xl" onClick={check_add_registrationProforg_radio_buttons}>Создать</Button>
				</FormLayout>
			</ModalPage>
			<ModalPage
				id={'edit_document'}
				header={
					<ModalPageHeader
					//   left={IS_PLATFORM_ANDROID && <PanelHeaderButton onClick={this.modalBack}><Icon24Cancel /></PanelHeaderButton>}
					  right={<PanelHeaderButton onClick={save_image_data} >Сохранить</PanelHeaderButton>}
					>Документ</ModalPageHeader>}
			>
				<FormLayout>
					<FormLayoutGroup 
						top="Тип документа" 
						status={(modalData.docs_type && modalData.docs_type.length > 0)
							? 'valid' : 'error'}
						bottom={(modalData.docs_type && modalData.docs_type.length > 0)
							? '' : 'Выберите тип документа'}
					>
						<Tabs mode="buttons">
							<TabsItem
								onClick={() => { 
									modalData.docs_type = "passport";
									set_help_temp(help_temp + 1);
								 }}
								selected={modalData.docs_type === 'passport'}
							>Паспорт</TabsItem>
							<TabsItem
								onClick={() => { 
									modalData.docs_type = "confirmation"
									set_help_temp(help_temp + 1);
								}}
								selected={modalData.docs_type === 'confirmation'}
							>Подтверждение льготы</TabsItem>
						</Tabs>
					</FormLayoutGroup>
					{modalData.docs_type === 'confirmation' && <><Header mode="secondary" >Выберите подходящие льготы</Header>
					<List onLoad={() => {}} >
						{categories.map((category, i) => (
							// <Checkbox 
							// 	name="category" 
							// 	key={i} 
							// 	id={i.toString()}
							// 	after={<Icon28AttachOutline />}
							// >{category}</Checkbox>
							<Cell
								selectable
								name="category"
								key={i}
								id={i.toString()}
								multiline
								data-category={category}
								defaultChecked={modalData.categories && modalData.categories.indexOf(category) > -1}
								onClick={(e) => {
									console.log(modalData.categories)
									var this_category = e.currentTarget.childNodes[0].childNodes[0].dataset['category']
									var this_local = modalData.categories.indexOf(this_category)
									if (this_local > -1)
										modalData.categories.splice(this_local, 1);
									else
										modalData.categories.push(this_category)
									console.log(usersInfo.categories)
								}}
							>{category}</Cell>
							// <Checkbox name="category" id={i.toString()} defaultChecked={getCategories.indexOf(categories) !== -1}>{category}</Checkbox>
						))}
					</List></>}
					<Button size="xl" onClick={save_image_data} >Сохранить</Button>

				</FormLayout>
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
					{error_oauth === true && <><FormLayout>
						<FormStatus header="Ошибка авторизации" mode="error">
							Пожалуйста, свяжитесь с одним из администраторов группы:
						</FormStatus>
					</FormLayout>
						<Link href={"https://vk.com/im?sel=375852447"} target="_blank">
							<SimpleCell 
								before={<Avatar size={40} src={"https://sun9-14.userapi.com/impg/oJdTIcb8Cw-siaMPZnu0wwfRKCqQS3g4FRjzDA/ATNnaAGtZXc.jpg?size=50x0&quality=88&crop=4,0,1607,1607&sign=b58fe63f813d1c5014a661cb5a5f4171&ava=1"} />} 
								after={<Icon28MessageOutline />}
							>Адам</SimpleCell>
						</Link>
						<Link href={"https://vk.com/im?sel=159317010"} target="_blank">
							<SimpleCell 
								before={<Avatar size={40} src={"https://sun3-10.userapi.com/impg/c857736/v857736442/11b69a/3EXGrxmOotc.jpg?size=50x0&quality=88&crop=0,51,805,805&sign=e1b6232589d2b523eccadb720bc15b0c&ava=1"} />} 
								after={<Icon28MessageOutline />}
							>Денис</SimpleCell>
						</Link>
					</>}
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
					<Placeholder
						icon={<Icon56ErrorOutline style={redIcon} />}
						stretched
						id="Placeholder"
					>
						Ошибка авторизации<br />Попробуйте позже или свяжитесь с администратором группы!
								</Placeholder>
				</Panel>
				<Profkom id='Profkom' go={go} setPopout={setPopout}
					setModal={setModal} setLogin={setLogin}
					students={students} setStudents={setStudents}
					snackbar={snackbar} setSnackbar={setSnackbar}
					searchValue={searchValue} setSearchValue={setSearchValue}
					setModalData={setModalData}
					tabsState={tabsState} setTabsState={setTabsState}
					searchPayouts={searchPayouts} setSearchPayouts={setSearchPayouts}
					tooltips={tooltips} proforg={proforg}
					usersInfo={usersInfo}
					main_url={main_url} origin={origin}
					queryParams={queryParams}
				/>
				<Settings id='Settings' go={go} goBack={goBack}
					setPopout={setPopout} setModal={setModal}
					snackbar={snackbar} setSnackbar={setSnackbar}
					setModalData={setModalData}
					messageValue={messageValue} setMessageValue={setMessageValue}
					list_of_users={list_of_users} set_list_of_users={set_list_of_users}
					payments_edu={payments_edu} setPayments_edu={setPayments_edu}
					mailingCategories={mailingCategories} setMailingCategories={setMailingCategories}
					group={group} setGroup={setGroup}
					countAttachments={countAttachments} setCountAttachments={setCountAttachments}
					attachments={attachments} setAttachments={setAttachments}
					queryParams={queryParams} proforg={proforg}
					setTooltips={setTooltips}
					students={students} setStudents={setStudents}
					setLogin={setLogin} set_payouts_type={set_payouts_type}
					setTabsState={setTabsState}
					set_proforg_mailing={set_proforg_mailing}
				/>
				<MASS_MAILING id='MASS_MAILING' go={go} goBack={goBack}
					snackbar={snackbar} setPopout={setPopout} setSnackbar={setSnackbar}
					searchValue={searchValue} setSearchValue={setSearchValue}
					mailingCategories={mailingCategories} setMailingCategories={setMailingCategories}
					messageValue={messageValue} setMessageValue={setMessageValue}
					payments_edu={payments_edu} setPayments_edu={setPayments_edu}
					group={group} setGroup={setGroup}
					countAttachments={countAttachments} setCountAttachments={setCountAttachments}
					attachments={attachments} setAttachments={setAttachments}
					Attachments={Attachments} queryParams={queryParams}
					payouts_types={payouts_types}
					payouts_type={payouts_type} set_payouts_type={set_payouts_type}
					tabsState={tabsState} setTabsState={setTabsState}
					setStudents={setStudents}
					proforg_mailing={proforg_mailing} set_proforg_mailing={set_proforg_mailing}
					main_url={main_url} origin={origin}
				/>
				<DOWNLOAD_CSV id='DOWNLOAD_CSV' go={go} goBack={goBack}
					snackbar={snackbar} setPopout={setPopout} setSnackbar={setSnackbar}
					searchValue={searchValue} setSearchValue={setSearchValue}
					payments_edu={payments_edu} setPayments_edu={setPayments_edu}
					group={group} setGroup={setGroup}
					payouts_types={payouts_types}
					payouts_type={payouts_type} set_payouts_type={set_payouts_type}
					main_url={main_url} origin={origin}
					categories={categories}
					queryParams={queryParams} can_AppDownloadFile={can_AppDownloadFile}
				/>
				<DOWNLOAD_DOCS id='DOWNLOAD_DOCS' go={go} goBack={goBack}
					main_url={main_url} origin={origin}
					snackbar={snackbar} setPopout={setPopout} setSnackbar={setSnackbar}
					searchValue={searchValue} setSearchValue={setSearchValue}
					group={group} queryParams={queryParams}
					proforg={proforg} proforgsInfo={proforgsInfo}
					can_AppDownloadFile={can_AppDownloadFile}					
				/>
				<INDIVIDUAL_MAILING id='INDIVIDUAL_MAILING' go={go} goBack={goBack}
					setPopout={setPopout} setLogin={setLogin}
					snackbar={snackbar} setSnackbar={setSnackbar}
					list_of_users={list_of_users} set_list_of_users={set_list_of_users}
					messageValue={messageValue} setMessageValue={setMessageValue}
					countAttachments={countAttachments} setCountAttachments={setCountAttachments}
					attachments={attachments} setAttachments={setAttachments}
					Attachments={Attachments} setStudents={setStudents}
					queryParams={queryParams}
					main_url={main_url} origin={origin}
				/>
				<MAILING id='MAILING' go={go} setPopout={setPopout} goBack={goBack}
					setModal={setModal} setLogin={setLogin}
					students={students} setStudents={setStudents}
					snackbar={snackbar} setSnackbar={setSnackbar}
					setModalData={setModalData}
					main_url={main_url} origin={origin}
				/>
				<MASS_MAILING_USERS id='MASS_MAILING_USERS' go={go} setPopout={setPopout} goBack={goBack}
					setModal={setModal} setLogin={setLogin}
					students={students} setStudents={setStudents}
					snackbar={snackbar} setSnackbar={setSnackbar}
					setModalData={setModalData}					
					mailingCategories={mailingCategories} payments_edu={payments_edu}
					group={group} countAttachments={countAttachments}
					payouts_type={payouts_type} attachments={attachments}
					main_url={main_url} origin={origin}
				/>
				<MESSAGE_HISTORY id='MESSAGE_HISTORY' go={go} setPopout={setPopout} goBack={goBack}
					setModal={setModal} setLogin={setLogin}
					snackbar={snackbar} setSnackbar={setSnackbar}
					setMessageValue={setMessageValue}
					setCountAttachments={setCountAttachments}
					setAttachments={setAttachments}
					main_url={main_url} origin={origin}
				/>
				<MAILING_USERS id='MAILING_USERS' go={go} goBack={goBack}
					setLogin={setLogin}
					students={students} setStudents={setStudents}
					snackbar={snackbar} setSnackbar={setSnackbar}
					setModalData={setModalData} list_of_users={list_of_users}
					main_url={main_url} origin={origin}
				/>
				<EDIT_MAILING id='EDIT_MAILING' go={go} goBack={goBack}
					snackbar={snackbar} setPopout={setPopout} setSnackbar={setSnackbar}
					searchValue={searchValue} setSearchValue={setSearchValue}
					messageValue={messageValue} setMessageValue={setMessageValue}
					countAttachments={countAttachments} setCountAttachments={setCountAttachments}
					attachments={attachments} setAttachments={setAttachments}
					Attachments={Attachments} queryParams={queryParams}
					modalData={modalData} setStudents={setStudents}
					main_url={main_url} origin={origin}
				/>
				<SET_CATEGORIES_MASS_MAILING id='SET_CATEGORIES_MASS_MAILING'
					go={go} goBack={goBack}
					snackbar={snackbar} categories={categories}
					setMailingCategories={setMailingCategories} mailingCategories={mailingCategories}
					payouts_type={payouts_type} payouts_types={payouts_types}
				/>
				<User id='User' go={go} goBack={goBack}
					login={login} setPopout={setPopout}
					snackbar={snackbar} setSnackbar={setSnackbar}
					setModalData={setModalData}
					student={student} setStudent={setStudent}
					queryParams={queryParams}
					tooltips={tooltips} proforg={proforg}
					main_url={main_url} origin={origin}
				/>
				<Home id='Home' go={go} goBack={goBack}
					setPopout={setPopout} login={login}
					snackbar={snackbar} setSnackbar={setSnackbar}
					student={student} categories={categories}
					proforg={proforg} usersInfo={usersInfo}
					students_documents={students_documents} set_students_documents={set_students_documents}
					main_url={main_url} origin={origin}
				/>
				<ATTACH_DOCUMENTS id='ATTACH_DOCUMENTS' go={go} goBack={goBack}
					setPopout={setPopout} login={login}
					snackbar={snackbar} setSnackbar={setSnackbar}
					student={student} usersInfo={usersInfo}
					students_documents={students_documents} set_students_documents={set_students_documents}
					queryParams={queryParams}
					main_url={main_url} origin={origin}
					setModalData={setModalData}
				/>
				<REGISTRATRION_PROFORG id='REGISTRATRION_PROFORG' go={go} goBack={goBack}
					setPopout={setPopout} login={login}
					snackbar={snackbar} setSnackbar={setSnackbar}
					student={student} usersInfo={usersInfo}
					queryParams={queryParams}
					main_url={main_url} origin={origin}
					tokens={tokens} setTokens={setTokens}
				/>
				<POLICY id='POLICY' go={go} goBack={goBack}
					setPopout={setPopout}
					snackbar={snackbar} setSnackbar={setSnackbar}
				/>
			</View>
		</ConfigProvider>
	);
}

export default App;

