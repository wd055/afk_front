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
	snackbar, setSnackbar,
	setMessageValue,
	setCountAttachments,
	setAttachments,
}) => {

	const [messages, set_messages] = useState([]);

	useEffect(() => {
		if (messages.length === 0)
			get_history();
	}, []);

	async function get_history() {

		var url = main_url + "profkom_bot/get_history/";

		try {
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify({
					querys: window.location.search
				}),
				headers: {
					'Origin': origin
				}
			});
			const json = await response.json();
			if (response.ok) {
				console.log(JSON.parse(json).response.items)
				set_messages(JSON.parse(json).response.items)
			} else {
				statusSnackbar(response.status, setSnackbar);
				console.error('MESSAGE_HISTORY get_history:');
			}
		} catch (error) {
			setPopout(null);
			statusSnackbar(0, setSnackbar);
			console.error('MESSAGE_HISTORY get_history:', error);
		}
	}

	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderBack onClick={goBack} />}
			>Выбор из переписки с ботом</PanelHeader>

			{messages.map((post, i) =>
				(<Group key={i}>
					<Cell size="l" onClick={(e) => {
						var attachments = post.attachments.map((item, i) => {
							var type = item.type
							var owner_id = item[item.type].owner_id
							var media_id = item[item.type].id
							var access_key = item[item.type].access_key
							return type + owner_id + "_" + media_id + "_" + access_key
						})
						setMessageValue(post.text);
						setCountAttachments(attachments.length);
						setAttachments(attachments);
						goBack();
					}}
						bottomContent={
							<HorizontalScroll>
								<div style={{ display: 'flex' }}>
									{post.attachments.map((post, j) =>
										<Button key={"buuton_" + String(i) + "_" + String(j)} size="m" mode="outline" style={j > 0 ? { marginLeft: 8 } : undefined}>{post.type}</Button>)}
								</div>
							</HorizontalScroll>}
					>{post.text}</Cell>
				</Group>))}

			{snackbar}
		</Panel>
	return Home;
}

export default App;
