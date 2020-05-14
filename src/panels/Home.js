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

import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';

import bridge from '@vkontakte/vk-bridge';

const App = ({ id, fetchedUser, go }) => {

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
	useEffect(() => {
		var url = "http://thingworx.asuscomm.com/profkom_bot/all_categories/";
		var url = "http://localhost:8000/profkom_bot/all_categories/";
		if (categories.length == 0)
			fetch(url, {
				method: 'POST',
				headers: {
					'Origin': 'http://localhost:10888/'
				}
			})
				.then(response => response.json())
				.then(data => setCategories(data))
	});

	const [email, setEmail] = useState();
	const [phone, setPhone] = useState();
	const [payments_edu, setPayments_edu] = useState();


	function onChangeEmail(e) {
		const { name, value } = e.currentTarget;
		setEmail(value);
	}
	function onChangePhone(e) {
		const { name, value } = e.currentTarget;
		setPhone(value);
	}
	function onChangePayments_edu(e) {
		const { name, value } = e.currentTarget;
		setPayments_edu(value);
	}

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
			return
		document.getElementsByName("category")
		var categorys = document.getElementsByName("category")//document.forms[0].elements;
		var data = {
			token: params['token'],
			email: document.getElementById("email").value,
			phone: document.getElementById("phone").value,
			payments_edu: document.getElementById("payments_edu").value,
			categories: []
		}

		for (var i = 0; i < categorys.length; i++) {
			if (categorys[i].checked) {
				data.categories.push(categories[i])
			}
		}

		var url = "http://thingworx.asuscomm.com/profkom_bot/form/";
		var url = "http://localhost:8000/profkom_bot/form/";
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Origin': 'http://localhost:10888/'
			}
		})
			.then(response => response.json())
			.then(data => {
				if (data == 'Success')
					window.close();
			})
	};
	// console.log('token', params['token'])

	const qwe =
		<Panel id={id}>
			<PanelHeader>Форма</PanelHeader>
			<FormLayout>
				<Input
					type="email"
					top="E-mail"
					name="email"
					id="email"
					onClick={onEmailClick}
					onChange={onChangeEmail}
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
					onChange={onChangePhone}
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
					onChange={onChangePayments_edu}
					value={payments_edu}
					status={payments_edu ? 'valid' : 'error'}
					bottom={payments_edu ? '' : 'Пожалуйста, выберите форму обучения'}
					required
				>
					<option value="free">Бесплатное</option>
					<option value="paid">Платное</option>
				</Select>

				<FormLayoutGroup top="Выберите подходящие категории:">
					{/* <Radio name="type">Паспорт</Radio>
					<Radio name="type">Загран</Radio> */}
					{categories.map((category, i) => (
						<Checkbox name="category" id={i.toString()}>{category}</Checkbox>
					))}
				</FormLayoutGroup>
				{/* <Checkbox>Согласен со всем <Link>этим</Link></Checkbox> */}

				{/* <Textarea top="О себе" /> */}
				<Button size="xl" onClick={onFormClick}>Зарегистрироваться</Button>
			</FormLayout>

			<PanelHeader
				left={<PanelHeaderBack onClick={this.onNavClick} data-to="example-1" />}
			>Плейсхолдеры</PanelHeader>

			<Placeholder
				icon={<Icon56CheckCircleOutline />}
				action={<Button size="l" mode="tertiary">Показать все сообщения</Button>}
				stretched
			>
				Нет непрочитанных<br />сообщений
          </Placeholder>
		</Panel>
	return qwe;
}

export default App;
