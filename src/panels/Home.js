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

import Group from '@vkontakte/vkui/dist/components/Group/Group';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import InfoRow from '@vkontakte/vkui/dist/components/InfoRow/InfoRow';

import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';

import bridge from '@vkontakte/vk-bridge';

const App = ({ id, fetchedUser, go, setPopout }) => {
	const redIcon = {
		color: 'red'
	};
	const blueIcon = {
		color: 'var(--accent)'
	};

	var params = window
		.location
		.search
		.replace('?', '')
		.split('&')
		.reduce(
			function (p, e) {
				var a = e.split('=');
				p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
				return p;
			},
			{}
		);

	const [categories, setCategories] = useState([]);
	const [getCategories, setGetCategories] = useState([]);
	const [showForm, setShowForm] = useState(true);
	const [submitSuccess, setSubmitSuccess] = useState("Успешно!");
	const [snackbar, setSnackbar] = useState();

	const [email, setEmail] = useState();
	const [phone, setPhone] = useState();
	const [payments_edu, setPayments_edu] = useState();
	const [name, setName] = useState();


	useEffect(() => {
		var url = "http://thingworx.asuscomm.com/profkom_bot/all_categories/";
		// var url = "http://localhost:8000/profkom_bot/all_categories/";
		var temp = true
		if (categories.length == 0 && showForm == true) {
			fetch(url, {
				method: 'POST',
				headers: {
					'Origin': 'http://localhost:10888/'
				}
			})
				.then(response => response.json())
				.then((data) => {
					setCategories(data)
				},
					(error) => {
						setShowForm(false)
						setSubmitSuccess(<div>Ошибка подключения<br />Пожалуйста, попробуйте через несколько минут!</div>)
						console.error('get category:', error)
					})



			var url = "http://thingworx.asuscomm.com/profkom_bot/get_form/";
			// var url = "http://localhost:8000/profkom_bot/get_form/";

			var data = {
				token: params['token'],
			}

			fetch(url, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Origin': 'http://localhost:10888/'
				}
			})
				.then(response => response.json())
				.then((data) => {
					if (data != "Error"){
						console.log(JSON.parse(data));
						data = JSON.parse(data);
						setName(data.name)
						setEmail(data.email)
						setPhone(data.phone)
						setGetCategories(data.categories)
					}else{
						setShowForm(false)
						setSubmitSuccess(<div>Ошибка авторизации</div>)
					}
				},
					(error) => {
						setShowForm(false)
						setSubmitSuccess(<div>Ошибка подключения<br />Пожалуйста, попробуйте через несколько минут!</div>)
						console.error('get category:', error)
					})
		}
	});

	var clickEmail = true;
	var clickPhone = true;
	const onPhoneClick = e => {
		if (clickPhone) {
			bridge.send("VKWebAppGetPhoneNumber", {});
			clickPhone = false;
		}
	};
	const onEmailClick = e => {
		if (clickEmail) {
			bridge.send("VKWebAppGetEmail", {});
			clickEmail = false;
		}
	};

	function onFormClick(e) {
		if (!email || !phone || !payments_edu)
			return;
		var categorys = document.getElementsByName("category");
		var data = {
			token: params['token'],
			email: document.getElementById("email").value,
			phone: document.getElementById("phone").value,
			payments_edu: document.getElementById("payments_edu").value,
			categories: []
		}

		for (var i = 0; i < categorys.length; i++) {
			if (categorys[i].checked) {
				data.categories.push(categories[i]);
			}
		}

		var url = "http://thingworx.asuscomm.com/profkom_bot/form/";
		// var url = "http://localhost:8000/profkom_bot/form/";
		setPopout(<ScreenSpinner size='large' />);

		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Origin': 'http://localhost:10888/'
			}
		})
			.then(response => response.json())
			.then((data) => {
				setPopout(null);
				setShowForm(false);
				if (data != 'Success') {
					setSubmitSuccess(<div>Ошибка отправики <br />Попробуйте еще раз или свяжитесь с администратором!</div>);
				}
			},
				(error) => {
					setSnackbar(<Snackbar
						layout="vertical"
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={redIcon}><Icon16Clear fill="#fff" width={14} height={14} /></Avatar>}
					>
						Ошибка соединения
					  </Snackbar>);
					setPopout(null);
					console.error('send form:', error);
				})
	};
	// console.log('token', params['token'])

	const Home =
		<Panel id={id}>
			<PanelHeader>Форма</PanelHeader>
			{showForm
				? <Group>
					<Group>
						<SimpleCell>
							<InfoRow header="ФИО">
								{name}
							</InfoRow>
						</SimpleCell>
					</Group>
					<FormLayout>
						<Input
							type="email"
							top="E-mail"
							name="email"
							id="email"
							onClick={onEmailClick}
							onChange={(e) => {
								const { value } = e.currentTarget;
								setEmail(value);
							}}
							value={email}
							status={email ? 'valid' : 'error'}
							bottom={email ? '' : 'Пожалуйста, введите электронную почту'}
							required
						/>
						<Input
							id="phone"
							type="phone"
							top=" Телефон"
							name="phone"
							onClick={onPhoneClick}
							onChange={(e) => {
								const { value } = e.currentTarget;
								setPhone(value);
							}}
							value={phone}
							status={phone ? 'valid' : 'error'}
							bottom={phone ? '' : 'Пожалуйста, введите номер телефона'}
							required
						/>

						<Select
							top="Форма обучения"
							placeholder="Выберите форму обучения"
							id='payments_edu'
							name="payments_edu"
							onChange={(e) => {
								const { value } = e.currentTarget;
								setPayments_edu(value);
							}}
							value={payments_edu}
							status={payments_edu ? 'valid' : 'error'}
							bottom={payments_edu ? '' : 'Пожалуйста, выберите форму обучения'}
							required
						>
							<option value="free">Бюджетная</option>
							<option value="paid">Платная</option>
						</Select>

						<FormLayoutGroup top="Выберите подходящие категории:">
							{/* <Radio name="type">Паспорт</Radio>
				<Radio name="type">Загран</Radio> */}
							{categories.map((category, i) => (
								<Checkbox name="category" id={i.toString()} checked={getCategories.indexOf(category) != -1}>{category}</Checkbox>
							))}
						</FormLayoutGroup>
						{/* <Checkbox>Согласен со всем <Link>этим</Link></Checkbox> */}

						{/* <Textarea top="О себе" /> */}
						<Button size="xl" onClick={onFormClick}>Зарегистрироваться</Button>
					</FormLayout>
				</Group>
				: <Placeholder
					icon={submitSuccess == 'Успешно!' ? <Icon56CheckCircleOutline style={blueIcon}/> : <Icon56ErrorOutline style={redIcon} />}
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
