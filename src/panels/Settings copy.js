import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';

import Group from '@vkontakte/vkui/dist/components/Group/Group';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import Card from '@vkontakte/vkui/dist/components/Card/Card';
import CardGrid from '@vkontakte/vkui/dist/components/CardGrid/CardGrid';

import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Radio from '@vkontakte/vkui/dist/components/Radio/Radio';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';

import Icon28FavoriteOutline from '@vkontakte/icons/dist/28/favorite_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';
import Icon28ShareOutline from '@vkontakte/icons/dist/28/share_outline';
import Icon28BrainOutline from '@vkontakte/icons/dist/28/brain_outline';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import Icon28UserOutline from '@vkontakte/icons/dist/28/user_outline';
import Icon28HistoryBackwardOutline from '@vkontakte/icons/dist/28/history_backward_outline';
import Icon28AttachOutline from '@vkontakte/icons/dist/28/attach_outline';

import { statusSnackbar } from './style';

// var origin = "https://thingworx.asuscomm.com:10888"
// var main_url = "https://profkom-bot-bmstu.herokuapp.com/"

// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = ({ id, go, goBack,
	setPopout, setModal,
	snackbar, setSnackbar,
	setModalData,
	queryParams, proforg,
	setTooltips,
}) => {

	const [countAttachments, setCountAttachments] = useState(false);
	const [attachments, setAttachments] = useState("");

	useEffect(() => {

		console.log(queryParams)

		if (countAttachments && countAttachments > 0)
			setCountAttachments(0);
		if (attachments && attachments.length > 0)
			setAttachments([]);
	}, []);

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
							src="https://sun9-32.userapi.com/impf/c824201/v824201969/173424/ayWCFmi538s.jpg?size=200x0&quality=90&sign=b461a01af900c4374512c2b13455c25d&ava=1" />
					</Card>
					<Card size="m">
						<img
							style={{ width: "100%", borderRadius: "10px" }}
							src="https://sun9-32.userapi.com/impf/c824201/v824201969/173424/ayWCFmi538s.jpg?size=200x0&quality=90&sign=b461a01af900c4374512c2b13455c25d&ava=1" />
					</Card>
					<CardGrid>
					</CardGrid>
					<Card size="m">
						<img
							style={{ width: "100%", borderRadius: "10px" }}
							src="https://sun9-32.userapi.com/impf/c824201/v824201969/173424/ayWCFmi538s.jpg?size=200x0&quality=90&sign=b461a01af900c4374512c2b13455c25d&ava=1" />
						<Div style={{ position: "absolute", bottom: 20, left: 12, borderRadius: "10px", backgroundColor: 'var(--content_tint_background)', padding: 6 }}>{kitcut("Справка о состоянии семьи на 2020 учебный год", 15)}</Div>
					</Card>
				</CardGrid>
			</Group>
			<FixedLayout vertical="bottom" filled>

			<File top="Загрузите ваше фото" if="inputfile" controlSize="l" accept="image/*" capture onChange={(e) => {
					console.log(e.target.file)
				}}
				>Открыть галерею</File>
				<Cell asideContent={<Avatar><Icon28AddOutline name="icon" style={blueIcon} /></Avatar>} />
			</FixedLayout>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
