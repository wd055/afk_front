import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';

import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import HorizontalScroll from '@vkontakte/vkui/dist/components/HorizontalScroll/HorizontalScroll';
import Button from '@vkontakte/vkui/dist/components/Button/Button';

import { redIcon, blueIcon, blueBackground, redBackground, statusSnackbar } from './style';

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
					<Cell
						size="l"
						style={post.from_id > 0 ? { textAlign: "right" } : undefined}
						onClick={(e) => {
							var attachments = post.attachments.map((item, i) => {
								var type = item.type;

								if (item.type === "wall")
									var owner_id = item[item.type].to_id;
								else
									var owner_id = item[item.type].owner_id;

								var media_id = item[item.type].id;
								if (typeof item[item.type]['access_key'] !== "undefined")
									var access_key = item[item.type].access_key;
								return type + owner_id + "_" + media_id + "_" + access_key;
							})
							setMessageValue(post.text);
							setCountAttachments(attachments.length);
							setAttachments(attachments);
							goBack();
						}}
						bottomContent={
							<HorizontalScroll>
								<div style={{ display: 'flex'}}>
									{post.attachments.map((post, j) =>
										<Button key={"buton_" + String(i) + "_" + String(j)} size="m" mode="outline" style={j > 0 ? { marginLeft: 8 } : undefined}>{post.type}</Button>)}
								</div>
							</HorizontalScroll>}
					>{post.text}</Cell>
				</Group>))}

			{snackbar}
		</Panel>
	return Home;
}

export default App;
