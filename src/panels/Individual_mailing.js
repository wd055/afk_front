import React, { useState, useEffect } from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';

import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import HorizontalScroll from '@vkontakte/vkui/dist/components/HorizontalScroll/HorizontalScroll';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';
import Counter from '@vkontakte/vkui/dist/components/Counter/Counter';

import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Textarea from '@vkontakte/vkui/dist/components/Textarea/Textarea';

import Icon24Error from '@vkontakte/icons/dist/24/error';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';

import { redIcon, blueIcon, orangeBackground, blueBackground, redBackground } from './style';

var origin = "https://thingworx.asuscomm.com:10888"
// var main_url = "https://profkom-bot-bmstu.herokuapp.com/"
var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = ({ id, go, goBack, 
	setPopout, setLogin,
	snackbar, setSnackbar,
	list_of_users, set_list_of_users,
	messageValue, setMessageValue,
}) => {

	const [countAttachments, setCountAttachments] = useState(1);

	useEffect(() => {
	});

	function send_individiual_mailing() {
		var url = main_url + "profkom_bot/individiual_mailing/";
		
		var data = {
			querys: window.location.search,
			message: messageValue,
			users: list_of_users,
			attachment:"",
		}
		
		console.log(data)

		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Origin': origin
			}
		})
			.then(response => response.json())
			.then((data) => {
				console.log("end req")
				setPopout(null);
				if (data !== "Error") {
					setSnackbar(<Snackbar
						layout="vertical"
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={blueBackground}><Icon28CheckCircleOutline fill="#fff" width={14} height={14} /></Avatar>}
					>
						Успешно!
					  </Snackbar>);
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
	
	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader 
				left={<PanelHeaderBack onClick={() => {
					set_list_of_users([]);
					goBack();
				}} />}
			>Индивидуальная рассылка</PanelHeader>

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

			<Separator />
			<SimpleCell
				expandable
				onClick={() => go('Mailing_Users')}
				description="Если студента нельзя выбрать, значит он не авторизовывался в ВК"
			>Выбор студентов
			</SimpleCell>
			<Separator />

			<Group>
				<Header 
					mode="secondary" 
					indicator={list_of_users.length > 0 && <Counter>{list_of_users.length}</Counter>}
				>Выбранные студенты</Header>

				{list_of_users.map((post, i) =>
					(<Group key={i}>
						<Cell 
							size="l" 
							name="users"
							id={post.login}

							onClick={(e) => {
								setLogin(post.login);
								go("User");
							}}

							// asideContent={
							// 	<Icon28AddOutline name="icon" style={blueIcon} />
							// }

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
					</Group>))}
			</Group>

			<FixedLayout vertical="bottom" filled>
				<Button 
					size="xl" 
					disabled={list_of_users.length === 0 || !messageValue}
					onClick={send_individiual_mailing}
				>Отправить</Button>
			</FixedLayout>

			{snackbar}
		</Panel>
	return Home;
}

export default App;
