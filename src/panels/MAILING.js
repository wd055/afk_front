import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';

import Search from '@vkontakte/vkui/dist/components/Search/Search';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import HorizontalScroll from '@vkontakte/vkui/dist/components/HorizontalScroll/HorizontalScroll';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';

import Icon24Error from '@vkontakte/icons/dist/24/error';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/browser_forward';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon28HistoryForwardOutline from '@vkontakte/icons/dist/28/history_forward_outline';
import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import Icon28ErrorOutline from '@vkontakte/icons/dist/28/error_outline';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';

import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';
import Tooltip from '@vkontakte/vkui/dist/components/Tooltip/Tooltip';

import { redIcon, blueIcon, blueBackground, redBackground, statusSnackbar } from './style';
import Footer from '@vkontakte/vkui/dist/components/Footer/Footer';

var origin = "https://thingworx.asuscomm.com:10888"
var main_url = "https://profkom-bot-bmstu.herokuapp.com/"
// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = ({ id, go, setPopout, goBack,
	setModal, setLogin,
	students, setStudents,
	snackbar, setSnackbar,
	setModalData,
}) => {

	const count_on_page = 6;
	const [list_left_end, set_list_left_end] = useState(0);

	useEffect(() => {
		if (students.length === 0)
			get_mailing(0);

		bridge.subscribe(({ detail: { type, data } }) => {
			// if (type === 'VKWebAppStorageGetKeysResult') {
			// 	console.log(data.keys)
			// }
			// if (type === 'VKWebAppStorageGetKeysFailed') {
			// 	console.error(data)
			// }

			// if (type === 'VKWebAppStorageSetResult') {
			// 	console.log(data)
			// }
			// if (type === 'VKWebAppStorageSetFailed') {
			// 	console.error(data)
			// }

			// if (type === 'VKWebAppStorageGetResult') {
			// }
			// if (type === 'VKWebAppStorageGetFailed') {
			// 	console.error(data)
			// }
		});
	}, []);

	async function get_mailing(list_left_end) {

		var url = main_url + "profkom_bot/get_mailing/";

		try {
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify({
					querys: window.location.search,
					from: list_left_end,
					to: list_left_end + count_on_page + 1,
				}),
				headers: {
					'Origin': origin
				}
			});
			const json = await response.json();
			if (response.ok) {
				for (var i in json) {
					json[i].date = new Date(json[i].date).toLocaleString()

					if (json[i].mailing_type === 'mass')
						json[i].mailing_type = 'Массовая'
					else if (json[i].mailing_type === "individual")
						json[i].mailing_type = 'Индивидуальная'
				}
				setStudents(json)
			} else {
				statusSnackbar(response.status, setSnackbar);
				console.error('MAILING test_message:');
			}
		} catch (error) {
			setPopout(null);
			statusSnackbar(0, setSnackbar);
			console.error('MAILING test_message:', error);
		}
	}

	function button_list_click(value) {
		set_list_left_end(list_left_end + value);
		get_mailing(list_left_end + value)
	}

	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderBack onClick={goBack} />}
			>Рассылки</PanelHeader>

			<Div style={{ paddingBottom: 60 }}>
				{students.slice(0, count_on_page).map((post, i) =>
					(<Group key={i}>
						<Cell size="l" onClick={(e) => {
							setModalData(post);
							go("EDIT_MAILING");
						}}
							bottomContent={
								<HorizontalScroll>
									<div style={{ display: 'flex' }}>
										<Button size="m" mode="outline">{post.date}</Button>
										<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{post.mailing_type}</Button>
									</div>
								</HorizontalScroll>
							}>{post.message}</Cell>
					</Group>))}
				{(students.length === 0) &&
					<Footer>Пока не было ни одной рассылки</Footer>}
			</Div>

			<FixedLayout vertical="bottom" filled>
				<Separator wide />
				<Div style={{ display: 'flex' }}>
					{list_left_end > 0 ?
						<Button size="l" before={<Icon24BrowserBack />}
							stretched mode="secondary" style={{ marginRight: 8 }}
							onClick={() => button_list_click(-count_on_page)}
						>Назад</Button>
						: <Button size="l" stretched mode="tertiary" style={{ marginRight: 8 }} ></Button>}

					{students.length > count_on_page ?
						<Button size="l" after={<Icon24BrowserForward />}
							stretched mode="secondary"
							onClick={() => button_list_click(count_on_page)}
						>Вперед</Button>
						: <Button size="l" stretched mode="tertiary"></Button>}
				</Div>
			</FixedLayout>

			{snackbar}
		</Panel>
	return Home;
}

export default App;
