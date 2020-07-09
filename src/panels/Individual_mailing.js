import React, { useState, useEffect } from 'react';
import PropTypes, { func } from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';

import Select from '@vkontakte/vkui/dist/components/Select/Select';
import Radio from '@vkontakte/vkui/dist/components/Radio/Radio';
import Textarea from '@vkontakte/vkui/dist/components/Textarea/Textarea';
import Checkbox from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';
import Link from '@vkontakte/vkui/dist/components/Link/Link';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';
import Icon16Done from '@vkontakte/icons/dist/16/done';

import Group from '@vkontakte/vkui/dist/components/Group/Group';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import InfoRow from '@vkontakte/vkui/dist/components/InfoRow/InfoRow';
import RichCell from '@vkontakte/vkui/dist/components/RichCell/RichCell';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import HorizontalScroll from '@vkontakte/vkui/dist/components/HorizontalScroll/HorizontalScroll';
import List from '@vkontakte/vkui/dist/components/List/List';
import Search from '@vkontakte/vkui/dist/components/Search/Search';
import Gallery from '@vkontakte/vkui/dist/components/Gallery/Gallery';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Counter from '@vkontakte/vkui/dist/components/Counter/Counter';

import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';
import Icon24Error from '@vkontakte/icons/dist/24/error';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon24Send from '@vkontakte/icons/dist/24/send';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/browser_forward';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon28HistoryForwardOutline from '@vkontakte/icons/dist/28/history_forward_outline';
import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import Icon28CancelCircleOutline from '@vkontakte/icons/dist/28/cancel_circle_outline';
import Icon28ErrorOutline from '@vkontakte/icons/dist/28/error_outline';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';

import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';

import bridge from '@vkontakte/vk-bridge';

import { redIcon, blueIcon, orangeBackground, blueBackground, redBackground } from './style';

var origin = "https://thingworx.asuscomm.com:10888"
var main_url = "https://profkom-bot-bmstu.herokuapp.com/"
// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = ({ id, fetchedUser,
	go, goBack, setPopout,
	setModal, setLogin,
	students, setStudents,
	snackbar, setSnackbar,
	searchValue, setSearchValue,
	setModalData,
	tabsState, setTabsState,
	searchPayouts, setSearchPayouts,
	list_of_users, set_list_of_users,
	textValue, setTextValue,
}) => {


	useEffect(() => {
	});

	function send_individiual_mailing() {
		var url = main_url + "profkom_bot/send_individiual_mailing/";
		
		var data = {
			querys: window.location.search,
			text: textValue,
			users: list_of_users,
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
				if (data != "Error") {
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
					id="text"
					onChange={(e) => {
						const { value } = e.currentTarget;
						setTextValue(value);
					}}
					defaultValue={textValue}
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
					disabled={list_of_users.length == 0 || !textValue}
				>Отправить</Button>
			</FixedLayout>

			{snackbar}
		</Panel>
	return Home;
}

export default App;
