import { parsePhoneNumberFromString } from 'libphonenumber-js'
import React, { useState, useEffect } from 'react';
import PropTypes, { func } from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';

import Select from '@vkontakte/vkui/dist/components/Select/Select';
// import Radio from '@vkontakte/vkui/dist/components/Radio/Radio';
// import Textarea from '@vkontakte/vkui/dist/components/Textarea/Textarea';
import Checkbox from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';
import Link from '@vkontakte/vkui/dist/components/Link/Link';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';
import Icon16Done from '@vkontakte/icons/dist/16/done';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';

import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import InfoRow from '@vkontakte/vkui/dist/components/InfoRow/InfoRow';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';

import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import PanelHeaderClose from '@vkontakte/vkui/dist/components/PanelHeaderClose/PanelHeaderClose';
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';
import Icon24Error from '@vkontakte/icons/dist/24/error';

import bridge from '@vkontakte/vk-bridge';

import { redIcon, blueIcon, orangeBackground, blueBackground, redBackground } from './style';

const check_valid = false;
const show_valid = true;

const contacts_bottom = "Почта и телефон не являются обязательными, но при наличии ошибок в документах и необходимости связаться с Вами мы сможем это сделать проще и быстрее, что упростит получение Вами вышей выплаты";

var origin = "https://thingworx.asuscomm.com:10888/";
var main_url = "https://profkom-bot-bmstu.herokuapp.com/";
// var main_url = "http://thingworx.asuscomm.com/";
// var main_url = "http://localhost:8000/";

const App = ({
	id, fetchedUser, categories,
	setPopout, login,
	snackbar, setSnackbar,
	student, setStudent,
	go, goBack,
	setActivePanel, setHistory,
	proforg,
	usersInfo, setUsersInfo
}) => {

	const [getCategories, setGetCategories] = useState([]);
	const [showForm, setShowForm] = useState(true);
	const [submitSuccess, setSubmitSuccess] = useState("Успешно!");
	// const [snackbar, setSnackbar] = useState();

	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [payments_edu, setPayments_edu] = useState();
	const [name, setName] = useState("");
	const [group, setGroup] = useState("");
	const [students_login, set_students_login] = useState("");

	useEffect(() => {
		if (usersInfo != null && students_login != usersInfo.login){
			console.log("!!!!!!!!!!!!", usersInfo)
			setGroup(usersInfo.group);
			set_students_login(usersInfo.login);
			setName(usersInfo.name);
			setEmail(usersInfo.email);
			setPhone(usersInfo.phone);
			setGetCategories(usersInfo.categories);
			setPayments_edu(usersInfo.payments_edu);
		}
		// get_users_info()
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppGetEmailResult') {
				document.getElementById('email').value = data.email;
				setEmail(data.email);
			}
			if (type === 'VKWebAppGetPhoneNumberResult') {
				document.getElementById('phone').value = data.phone_number;
				setPhone(data.phone_number);
			}
		});
	});

	function get_users_info(){
		// var url = main_url + "profkom_bot/get_form/";

		// var data = {
		// 	querys: window.location.search,
		// }

		// if (login != null) {

		// 	data.students_login = login;

		// 	fetch(url, {
		// 		method: 'POST',
		// 		body: JSON.stringify(data),
		// 		headers: {
		// 			'Origin': origin
		// 		}
		// 	})
		// 		.then(response => response.json())
		// 		.then((data) => {
		// 			if (data != "Error") {
		// 				// if (data.proforg == true && login == null && students.length == 0) {
		// 				// 	go("Profkom");
		// 				// }
		// 				console.log('get info:', data);
		// 				// if (login == null) setProforg(data.proforg);
		// 				setGroup(data.group);
		// 				set_students_login(data.login);
		// 				setName(data.name);
		// 				setEmail(data.email);
		// 				setPhone(data.phone);
		// 				setGetCategories(data.categories);
		// 				setPayments_edu(data.payments_edu);
		// 				setShowForm(true);
		// 				setSubmitSuccess("Успешно!");
		// 			} else {
		// 				console.error('get info:', data);

		// 				setSnackbar(<Snackbar
		// 					layout="vertical"
		// 					onClose={() => setSnackbar(null)}
		// 					before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
		// 				>
		// 					Ошибка авторизации
		// 				</Snackbar>);
		// 				// setShowForm(false)
		// 				// setSubmitSuccess(<div>Ошибка авторизации</div>)
		// 			}
		// 		},
		// 			(error) => {
		// 				if (name == "") {
		// 					setSnackbar(<Snackbar
		// 						layout="vertical"
		// 						onClose={() => setSnackbar(null)}
		// 						before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
		// 					>
		// 						Ошибка подключения
		// 					</Snackbar>);
		// 					// setShowForm(false)
		// 					// setSubmitSuccess(<div>Ошибка подключения<br />Пожалуйста, попробуйте через несколько минут!</div>)
		// 					console.error('get info:', error)
		// 				}
		// 			})
		// } else if (usersInfo != null) {
		// 	setGroup(usersInfo.group);
		// 	set_students_login(usersInfo.login);
		// 	setName(usersInfo.name);
		// 	setEmail(usersInfo.email);
		// 	setPhone(usersInfo.phone);
		// 	setGetCategories(usersInfo.categories);
		// 	setPayments_edu(usersInfo.payments_edu);
		// 	setShowForm(true);
		// 	setSubmitSuccess("Успешно!");
		// }
	}
	const [clickEmail, setClickEmail] = useState(true);
	const [clickPhone, setClickPhone] = useState(true);

	const onEmailClick = e => {
		if (clickEmail && login == null && email.length == 0) {
			setClickEmail(false);
			bridge.send("VKWebAppGetEmail", {});
		}
	};

	const onPhoneClick = e => {
		if (clickPhone && login == null && phone.length == 0) {
			setClickPhone(false);
			bridge.send("VKWebAppGetPhoneNumber", {});
		}
	};

	function validateEmail(email) {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	function validatePhone(phone) {
		// const re = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
		// return re.test(String(phone).toLowerCase());
		const phoneNumber = parsePhoneNumberFromString(phone, 'RU')
		if (phoneNumber) {
			return phoneNumber.isValid();
		}
		return false;

	}

	function onFormClick(e) {
		if (( check_valid && (!email || !phone || !validatePhone(phone)  || !validateEmail(email)) || !payments_edu) && login == null) {
			setSnackbar(<Snackbar
				layout="vertical"
				onClose={() => setSnackbar(null)}
				before={<Avatar size={24} style={orangeBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
			>
				Заполните форму
			  </Snackbar>);
			return;
		}
		var categorys = document.getElementsByName("category");
		var data = {
			// token: params['token'],
			querys: window.location.search,
			email: email,
			phone: phone,
			payments_edu: document.getElementById("payments_edu").value,
			categories: []
		}
		
		const phoneNumber = parsePhoneNumberFromString(phone, 'RU')
		if (phoneNumber) {
			data.phone = phoneNumber.number;
		}

		if (login != null){
			data.students_login = login;
			student.phone = phone;
			student.email = email;
		}

		for (var i = 0; i < categorys.length; i++) {
			if (categorys[i].checked) {
				data.categories.push(categories[i]);
			}
		}

		setGetCategories(data.categories)

		var url = main_url + "profkom_bot/form/";

		setPopout(<ScreenSpinner size='large' />);

		console.log("set form:", data)

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
				// setShowForm(false);
				if (data != 'Success') {
					setSnackbar(<Snackbar
						layout="vertical"
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
					>
						Ошибка отправики
					  </Snackbar>);
					setPopout(null);
					// setSubmitSuccess(<div>Ошибка отправики <br />Попробуйте еще раз или свяжитесь с администратором!</div>);
				}
				else {
					setSnackbar(<Snackbar
						layout="vertical"
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={blueBackground}><Icon28CheckCircleOutline fill="#fff" width={14} height={14} /></Avatar>}
					>
						Успешно!
					  </Snackbar>);
					setPopout(null);
					if (proforg == true)
						window.history.back();
				}
				console.log("set form:", data)
			},
				(error) => {
					setSnackbar(<Snackbar
						layout="vertical"
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
					>
						Ошибка соединения
					  </Snackbar>);
					setPopout(null);
					console.error('send form:', error);
				})
	};

	function onLoadCategory() {
		var categorys = document.getElementsByName("category");
		for (var i = 0; i < categorys.length; i++) {
			categorys[i].checked = getCategories.indexOf(categories[i]) != -1
		}
	}
	// console.log('token', params['token'])

	const Home =
		<Panel id={id}>
			<PanelHeader 
				// left={proforg == true && <PanelHeaderBack onClick={goBack} />}
				left={proforg == true && <PanelHeaderBack onClick={() => window.history.back()} />}
			>Форма</PanelHeader>
			{showForm
				? <Group>
					<Group>
						<Cell size="l"
							bottomContent={
								<div style={{ display: 'flex' }}>
									<Button size="m" mode="outline">{group}</Button>
									<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{students_login}</Button>
								</div>
							}>{name}</Cell>
					</Group>
					<FormLayout>
						<FormLayoutGroup 
							top="Контактные данные"
							bottom={login == null && contacts_bottom}
						>
							<Input
								type="text"
								top="E-mail"
								placeholder="E-mail"
								name="email"
								id="email"
								onClick={onEmailClick}
								onChange={(e) => {
									const { value } = e.currentTarget;
									setEmail(value.slice(0, 100));
								}}
								value={email}
								status={(show_valid && login == null) && (validateEmail(email) ? 'valid' : 'error')}
								bottom={(show_valid && login == null) && (validateEmail(email) ?
									'' : 'Пожалуйста, корректно введите Вашу электронную почту')}
								required={check_valid}
							/>
							<Input
								id="phone"
								type="phone"
								top="Телефон"
								placeholder="Телефон"
								name="phone"
								onClick={onPhoneClick}
								onChange={(e) => {
									const { value } = e.currentTarget;
									setPhone(value.slice(0, 50));
								}}
								value={phone}
								status={(show_valid && login==null) && (validatePhone(phone) ? 'valid' : 'error')}
								bottom={(show_valid && login==null) && (validatePhone(phone) ? '' : 'Пожалуйста, корректно введите Ваш номер телефона')}
								required = {check_valid}
							/>
						</FormLayoutGroup>
						<Select
							top="Форма обучения"
							placeholder="Форма обучения"
							id='payments_edu'
							name="payments_edu"
							onChange={(e) => {
								const { value } = e.currentTarget;
								setPayments_edu(value);
							}}
							value={String(payments_edu)}
							status={login==null && (payments_edu ? 'valid' : 'error')}
							bottom={login==null && (payments_edu ? '' : 'Пожалуйста, выберите форму обучения')}
							required = {login==null}
						>
							<option value="free" id="select_free">Бюджетная</option>
							<option value="paid" id="select_paid">Платная</option>
						</Select>

						<FormLayoutGroup top="Выберите подходящие категории" onLoad={onLoadCategory()}>
							{/* <Radio name="type">Паспорт</Radio>
				<Radio name="type">Загран</Radio> */}
							{categories.map((category, i) => (
								<Checkbox name="category" key={i} id={i.toString()}>{category}</Checkbox>
								// <Checkbox name="category" id={i.toString()} defaultChecked={getCategories.indexOf(categories) != -1}>{category}</Checkbox>
							))}
						</FormLayoutGroup>
						{/* <Checkbox>Согласен со всем <Link>этим</Link></Checkbox> */}

						{/* <Textarea top="О себе" /> */}
						<Button size="xl" onClick={onFormClick}>Подтвердить</Button>
					</FormLayout>
				</Group>
				: <Placeholder
					icon={submitSuccess == 'Успешно!' ? <Icon56CheckCircleOutline style={blueIcon} /> : <Icon56ErrorOutline style={redIcon} />}
					// action={<Button size="l" mode="tertiary">Показать все сообщения</Button>}
					stretched
					id="Placeholder"
					style="visibility:hidden;"
				>
					{submitSuccess}
				</Placeholder>}
			{snackbar}
		</Panel>
	return Home;
}

export default App;
