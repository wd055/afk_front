import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';

import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Card from '@vkontakte/vkui/dist/components/Card/Card';
import CardGrid from '@vkontakte/vkui/dist/components/CardGrid/CardGrid';

import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import File from '@vkontakte/vkui/dist/components/File/File';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';

import Icon28AttachOutline from '@vkontakte/icons/dist/28/attach_outline';

import { statusSnackbar, blueIcon } from './style';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';

// var origin = "https://thingworx.asuscomm.com:10888"
// var main_url = "https://profkom-bot-bmstu.herokuapp.com/"

// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = ({ id, go, goBack,
	setPopout, login, 
	snackbar, setSnackbar,
	student, usersInfo
}) => {

	// const [countAttachments, setCountAttachments] = useState(false);
	// const [attachments, setAttachments] = useState("");

	useEffect(() => {

		// console.log(queryParams)

		// if (countAttachments && countAttachments > 0)
		// 	setCountAttachments(0);
		// if (attachments && attachments.length > 0)
		// 	setAttachments([]);
	}, []);

	function kitcut(text, limit) {
		text = text.trim();
		if (text.length <= limit) return text;

		text = text.slice(0, limit);

		return text.trim() + "...";
	}

	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderBack onClick={goBack} />}
			>Прикрепленные документы</PanelHeader>
			<Group separator="hide">
				<CardGrid>
					<Card size="m">
						<img
							style={{ width: "100%", borderRadius: "10px" }} 
							src="https://sun9-32.userapi.com/impf/c824201/v824201969/173424/ayWCFmi538s.jpg?size=200x0&quality=90&sign=b461a01af900c4374512c2b13455c25d&ava=1"/>
					</Card>
					<Card size="m">
						<img
							style={{ width: "100%", borderRadius: "10px" }} 
							src="https://sun9-32.userapi.com/impf/c824201/v824201969/173424/ayWCFmi538s.jpg?size=200x0&quality=90&sign=b461a01af900c4374512c2b13455c25d&ava=1"/>
					</Card>
				<CardGrid>
				</CardGrid>
					<Card size="m">
						<img
							style={{ width: "100%", borderRadius: "10px" }} 
							src="https://sun9-32.userapi.com/impf/c824201/v824201969/173424/ayWCFmi538s.jpg?size=200x0&quality=90&sign=b461a01af900c4374512c2b13455c25d&ava=1"/>
						<Div style={{ position: "absolute", bottom: 20, left: 12, borderRadius: "10px", backgroundColor: 'var(--content_tint_background)', padding: 6}}>{kitcut("Справка о состоянии семьи на 2020 учебный год", 15)}</Div>
					</Card>
				</CardGrid>
			</Group>
			<FixedLayout vertical="bottom">
				<Cell asideContent={<File 
					controlSize="l" 
					accept="image/*" 
					capture 
					onChange={(e) => { console.log(e.target.file) }} 
					style={{ background: "transparent" }}
				><Cell asideContent={<Avatar><Icon28AttachOutline name="icon" style={blueIcon} /></Avatar>} /></File>} />
			</FixedLayout>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
