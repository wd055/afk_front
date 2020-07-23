import React, { useState, useEffect } from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';

import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import List from '@vkontakte/vkui/dist/components/List/List';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import HorizontalScroll from '@vkontakte/vkui/dist/components/HorizontalScroll/HorizontalScroll';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';
import Counter from '@vkontakte/vkui/dist/components/Counter/Counter';

import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Textarea from '@vkontakte/vkui/dist/components/Textarea/Textarea';
import Alert from '@vkontakte/vkui/dist/components/Alert/Alert';

import Icon28CancelOutline from '@vkontakte/icons/dist/28/cancel_outline';
import Icon28ClearDataOutline from '@vkontakte/icons/dist/28/clear_data_outline';
import Icon28MessagesOutline from '@vkontakte/icons/dist/28/messages_outline';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';

import { statusSnackbar, redIcon } from './style';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Footer from '@vkontakte/vkui/dist/components/Footer/Footer';

var origin = "https://thingworx.asuscomm.com:10888"
var main_url = "https://profkom-bot-bmstu.herokuapp.com/"
// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = ({ id, go, goBack,
	setPopout, setLogin,
	snackbar, setSnackbar,
	list_of_users, set_list_of_users,
	messageValue, setMessageValue,
	countAttachments, setCountAttachments,
	attachments, setAttachments,
	Attachments, setStudents,
	queryParams,
}) => {

	const [tempCount, setTempCount] = useState(0);

	useEffect(() => {
	});

	function on_btn_click() {
		test_message();
		setPopout(<Alert
			actionsLayout="vertical"
			actions={[{
				title: 'Разослать',
				autoclose: true,
				mode: 'destructive',
				action: () => {
					send_individual_mailing();
				},
			}, {
				title: 'Отмена',
				autoclose: true,
				mode: 'cancel'
			}]}
			onClose={() => setPopout(null)}
		>
			<h2>Подтвердите отправку</h2>
			<p>Вы уверены, что хотите разослать сообщение? Сначала проверьте тестовое сообщение!</p>
		</Alert>)
	}

	async function send_individual_mailing() {
		var url = main_url + "profkom_bot/individual_mailing";

		var data = {
			querys: window.location.search,
			message: messageValue,
			users: list_of_users,
		}
		if (countAttachments > 0)
			data.attachment = attachments.join();

		try {
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Origin': origin
				}
			});
			// const json = await response.json();
			if (response.ok) {
				statusSnackbar(200, setSnackbar);
				// setCountAttachments(0);
				// setAttachments([]);
				// setMessageValue();
				// set_list_of_users([]);
				// goBack();
			} else {
				statusSnackbar(response.status, setSnackbar);
				console.error('INDIVIDUAL_MAILING:', data);
			}
		} catch (error) {
			setPopout(null);
			statusSnackbar(0, setSnackbar);
			console.error('INDIVIDUAL_MAILING:', error);
		}
	}

	async function test_message() {
		var url = main_url + "profkom_bot/test_message";

		var data = {
			querys: window.location.search,
			message: messageValue,
			user_id: queryParams.vk_user_id,
		}

		if (countAttachments > 0)
			data.attachment = attachments.join();

		try {
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Origin': origin
				}
			});
			// const json = await response.json();
			if (response.ok) {
				console.log('test_message test_message: Success');
				// statusSnackbar(200, setSnackbar);
			} else {
				statusSnackbar(response.status, setSnackbar);
				console.error('test_message test_message:', data);
			}
		} catch (error) {
			setPopout(null);
			statusSnackbar(0, setSnackbar);
			console.error('test_message test_message:', error);
		}
	}

	function on_students_click(e, post) {
		if (e.target.getAttribute('class') === "Cell__aside" ||
			e.target.parentNode.getAttribute('class') === "Cell__aside" ||
			e.target.parentNode.parentNode.getAttribute('class') === "Cell__aside" ||
			e.target.parentNode.parentNode.parentNode.getAttribute('class') === "Cell__aside") {

			//delete user
			console.log("DELETE")
			for (var i in list_of_users) {
				if (list_of_users[i].login === post.login) {
					// var temp = list_of_users;
					// temp.splice(i, 1);
					// console.log(temp);
					// console.log(list_of_users);
					// set_list_of_users(temp);
					list_of_users.splice(i, 1);
					setTempCount(tempCount + 1);
					console.log(list_of_users);
				}
			}
		} else {
			setLogin(post.login);
			go("User");
		}
	}

	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderBack onClick={() => {
					set_list_of_users([]);
					goBack();
				}} />}
			>Индивидуальная рассылка</PanelHeader>

			<Div style={{ paddingBottom: 60 }}>
				<FormLayout>
					<Textarea
						top="Текст сообщения"
						id="message"
						onChange={(e) => {
							const { value } = e.currentTarget;
							setMessageValue(value);
						}}
						defaultValue={messageValue}
					/>
				</FormLayout>

				<Attachments />

				<SimpleCell
					expandable
					onClick={() => {
						go('MESSAGE_HISTORY');
					}}
					description="Последние 20 сообщений"
					before={<Icon28MessagesOutline />}
					multiline
				>Выбор сообщения из переписки с ботом</SimpleCell>

				<SimpleCell
					expandable
					onClick={() => {
						go('MAILING_USERS');
						setStudents([])
					}}
					description="Если студента нельзя выбрать, значит он не авторизовывался в ВК"
					before={<Icon28Users3Outline />}
				>Выбор студентов
				</SimpleCell>

				<Separator />

				<Group>
					<Header
						mode="secondary"
						indicator={list_of_users.length > 0 && <Counter>{list_of_users.length}</Counter>}
						aside={<Icon28ClearDataOutline style={redIcon} onClick={() => set_list_of_users([])} />}
						before={<Icon28Users3Outline />}
					>Выбранные студенты</Header>
					<List>
						{list_of_users.map((post, i) =>
							(
								<Cell
									size="l"
									name="users"
									id={post.login}
									key={i}
									onClick={(e) => { on_students_click(e, post) }}

									asideContent={
										<Icon28CancelOutline style={redIcon} />
									}

									bottomContent={
										<HorizontalScroll>
											<div style={{ display: 'flex' }}>
												<Button
													size="m"
													mode="outline"
												>{post.group}</Button>
												<Button
													size="m"
													mode="outline"
													style={{ marginLeft: 8 }}
												>{post.login}</Button>
											</div>
										</HorizontalScroll>
									}>{post.name}</Cell>
							))}
					</List>
				</Group>
				{(list_of_users.length === 0) &&
					<Footer>Пока не выбран ни один студент</Footer>}
			</Div>

			<FixedLayout vertical="bottom" filled>
				<FormLayout>
					<Button
						size="xl"
						disabled={list_of_users.length === 0 || !messageValue}
						onClick={on_btn_click}
					>Отправить</Button>
				</FormLayout>
			</FixedLayout>

			{snackbar}
		</Panel>
	return Home;
}

export default App;
