import { parsePhoneNumberFromString } from 'libphonenumber-js'
import React, { useState, useEffect } from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Header from '@vkontakte/vkui/dist/components/Header/Header';

import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Select from '@vkontakte/vkui/dist/components/Select/Select';
import Checkbox from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Footer from '@vkontakte/vkui/dist/components/Footer/Footer';
import Link from '@vkontakte/vkui/dist/components/Link/Link';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';
import List from '@vkontakte/vkui/dist/components/List/List';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import Counter from '@vkontakte/vkui/dist/components/Counter/Counter';

import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon24Error from '@vkontakte/icons/dist/24/error';
import Icon28AttachOutline from '@vkontakte/icons/dist/28/attach_outline';

import bridge from '@vkontakte/vk-bridge';

import { orangeBackground, blueBackground, redBackground, blueIcon } from './style';
import Div from '@vkontakte/vkui/dist/components/Div/Div';

const check_valid = false;
const show_valid = true;

const contacts_bottom = "Почта и телефон не являются обязательными, но при наличии ошибок в документах и необходимости связаться с Вами мы сможем это сделать проще и быстрее, что упростит получение Вами вышей выплаты";

var origin = "https://thingworx.asuscomm.com:10888/";
var main_url = "https://profkom-bot-bmstu.herokuapp.com/";
// var main_url = "http://thingworx.asuscomm.com/";
// var main_url = "http://localhost:8000/";

export const Home = ({
	id, go, goBack,
	setPopout, login,
	snackbar, setSnackbar,
	student, categories,
	proforg, usersInfo,
	students_documents, set_students_documents,
}) => {

	const [getCategories, setGetCategories] = useState([]);
	// const [snackbar, setSnackbar] = useState();

	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [payments_edu, setPayments_edu] = useState();
	const [contribution, set_contribution] = useState();
	const [name, setName] = useState("");
	const [group, setGroup] = useState("");
	const [students_login, set_students_login] = useState("");
	const [students_proforg, set_students_proforg] = useState(0);
	const [checkedCats, setCheckedCats] = useState(false);

	const [editName, setEditName] = useState(false);

	useEffect(() => {
		if (usersInfo !== null && students_login !== usersInfo.login) {
			console.log("usersInfo:", usersInfo)
			setGroup(usersInfo.group);
			set_students_login(usersInfo.login);
			setName(usersInfo.name);
			setEmail(usersInfo.email);
			setPhone(usersInfo.phone);
			setGetCategories(usersInfo.categories);
			setPayments_edu(usersInfo.payments_edu);
			set_students_proforg(usersInfo.proforg);
			set_contribution(usersInfo.contribution);
			set_students_documents(usersInfo.documents)

			setCheckedCats(false);
		}
		// get_users_info()
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppGetEmailResult') {
				document.getElementById('email').value = data.email;
				setEmail(data.email);
				usersInfo.email = data.email;
			}
			if (type === 'VKWebAppGetPhoneNumberResult') {
				document.getElementById('phone').value = data.phone_number;
				setPhone(data.phone_number);
				usersInfo.phone = data.phone_number;
			}
		});
	});

	const [clickEmail, setClickEmail] = useState(true);
	const [clickPhone, setClickPhone] = useState(true);
	  
	const onEmailClick = e => {
		if (clickEmail && login === null && email.length === 0) {
			setClickEmail(false);
			bridge.send("VKWebAppGetEmail", {});
		}
	};

	const onPhoneClick = e => {
		if (clickPhone && login === null && phone.length === 0) {
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
		if (login === null && ((check_valid && (!email || !phone || !validatePhone(phone) || !validateEmail(email))) || !payments_edu)) {
			setSnackbar(<Snackbar
				layout="vertical"
				onClose={() => setSnackbar(null)}
				before={<Avatar size={24} style={orangeBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
			>
				Заполните форму
			  </Snackbar>);
			return;
		}
		var data = {
			// token: params['token'],
			querys: window.location.search,
			email: email,
			phone: phone,
			payments_edu: document.getElementById("payments_edu").value,
			categories: []
		}

		if (proforg >= 3 && usersInfo.proforg !== students_proforg) {
			data.proforg = students_proforg;
		}

		const phoneNumber = parsePhoneNumberFromString(phone, 'RU')
		if (phoneNumber) {
			data.phone = phoneNumber.number;
		}

		if (login !== null) {
			data.students_login = login;
			if (phoneNumber) {
				student.phone = phoneNumber.formatNational();
			}
			student.email = email;
		}

		if (login === null) {
			var agree = document.getElementById("agree");
			data.agree = agree.checked
		}

		var categorys = document.getElementsByName("category");
		for (var i = 0; i < categorys.length; i++) {
			if (categorys[i].checked) {
				data.categories.push(categories[i]);
			}
		}

		setGetCategories(data.categories)
		usersInfo.categories = data.categories;

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
				if (data !== 'Success') {
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
					if (proforg > 0)
						goBack();
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
		if (!checkedCats) {
			for (var i = 0; i < categorys.length; i++) {
				categorys[i].checked = getCategories.indexOf(categories[i]) !== -1
			}
			setCheckedCats(true);
		}
	}
	// console.log('token', params['token'])

	const Home =
		<Panel id={id}>
			<PanelHeader
				left={proforg > 0 && <PanelHeaderBack onClick={goBack} />}
			>Форма</PanelHeader>
			<Group>
				<Group>
					<Cell size="l"
						// asideContent={proforg > 0 && 
						// 	<Icon28EditOutline
						// 		style={blueIcon}
						// 		onClick={() => setEditName(true)}
						// 	/>}
						bottomContent={
							<div style={{ display: 'flex' }}>
								<Button size="m" mode="outline">{group}</Button>
								<Button size="m"
									mode="outline" style={{ marginLeft: 8 }}>
									{students_login}
								</Button>
							</div>
						}>{name}</Cell>
				</Group>
				<FormLayout>
					{proforg >= 3 &&
						<Select
							top="Уровень доступа"
							id='proforg'
							name="proforg"
							onChange={(e) => {
								const { value } = e.currentTarget;
								set_students_proforg(value);
							}}
							value={students_proforg}
						>
							<option value="0" id="select_proforg">Не профорг</option>
							<option value="1" id="select_proforg">Профорг группы</option>
							<option value="2" id="select_proforg">Дежурный</option>
							<option value="3" id="select_proforg">Председатель</option>
						</Select>}
					{/* <Input
						type="number"
						top="Уровень профорга"
						name="proforg"
						id="proforg"
						onChange={(e) => {
							const { value } = e.currentTarget;
							set_students_proforg(value);
						}}
						value={students_proforg}>
					</Input> */}
					<FormLayoutGroup
						top="Контактные данные"
						bottom={login === null && contacts_bottom}
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
								usersInfo.email = value.slice(0, 100);
							}}
							value={email}
							status={(show_valid && login === null) && (validateEmail(email) ? 'valid' : 'error')}
							bottom={(show_valid && login === null) && (validateEmail(email) ?
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
								usersInfo.phone = value.slice(0, 50);
							}}
							value={phone}
							status={(show_valid && login === null) && (validatePhone(phone) ? 'valid' : 'error')}
							bottom={(show_valid && login === null) && (validatePhone(phone) ? '' : 'Пожалуйста, корректно введите Ваш номер телефона')}
							required={check_valid}
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
							usersInfo.payments_edu = value;
						}}
						value={String(payments_edu)}
						status={login === null && (payments_edu ? 'valid' : 'error')}
						bottom={login === null && (payments_edu ? '' : 'Пожалуйста, выберите форму обучения')}
						required={login === null}
					>
						<option value="free" id="select_free">Бюджетная</option>
						<option value="paid" id="select_paid">Платная</option>
					</Select>
					<SimpleCell
						onClick={() => go("ATTACH_DOCUMENTS")}
						before={<Icon28AttachOutline />}
						description="Прикрепление добровольно. Без них не получится удаленно формировать заявления."
						indicator={students_documents.length > 0 && <Counter>{students_documents.length}</Counter>}
					>Прикрепить документы</SimpleCell>

					{/* <FormLayoutGroup top="Выберите подходящие категории" onLoad={onLoadCategory()}> */}
					{/* <Radio name="type">Паспорт</Radio>
				<Radio name="type">Загран</Radio> */}
					<Header mode="secondary" >Выберите подходящие категории</Header>
					<List onLoad={onLoadCategory()} >
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
							>{category}</Cell>
							// <Checkbox name="category" id={i.toString()} defaultChecked={getCategories.indexOf(categories) !== -1}>{category}</Checkbox>
						))}
					</List>
					{/* </FormLayoutGroup> */}

					{login === null && <><Separator />
						<Checkbox id="agree" defaultChecked={true}>Получать информацию о различных мероприятиях, раздаче билетов и ТП</Checkbox> </>}
					<Button
						size="xl"
						onClick={onFormClick}
						top={login === null ? <>При подтверждении Вы соглашаетесь получать автоматические сообщение об изменении Ваших заявлений, а так же с <Link onClick={() => go("POLICY")}>политикой</Link></> : undefined}>Подтвердить</Button>
				</FormLayout>
			</Group>
			{snackbar}
		</Panel>
	return Home;
}

export const POLICY = ({ id, go, goBack,
	setPopout,
	snackbar, setSnackbar,
}) => {

	useEffect(() => {
	}, []);

	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderBack onClick={goBack} />}
			>Политика</PanelHeader>
			<Group header={<Header>Первый раздел</Header>}>
				<Div>
					Крутое начало описание политики конфиденциальности, а может еще что.
					Это вторая строка.
				</Div>
			</Group>
			<Group header={<Header mode="secondary">Раздел 2.1</Header>}>
				<Div>
					Второй абзац, продолжение!
				</Div>
			</Group>
			{snackbar}
		</Panel>
	return Home;
}
