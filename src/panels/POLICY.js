import React, { useState, useEffect } from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';

import Group from '@vkontakte/vkui/dist/components/Group/Group';

import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Header from '@vkontakte/vkui/dist/components/Header/Header';

// var origin = "https://thingworx.asuscomm.com:10888"
// var main_url = "https://profkom-bot-bmstu.herokuapp.com/"

// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

export const POLICY = ({ id, go, goBack,
	setPopout,
	snackbar, setSnackbar,
}) => {

	useEffect(() => {
	}, []);

	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderBack onClick={goBack} />}
			>Политика</PanelHeader>
			<Group header={<Header>Первый раздел</Header>}>
				<Div>
					Крутое начало описание политики конфиденциальности, а может еще что.
					Это вторая строка.
				</Div>
			</Group>
			<Group header={<Header mode="secondary">Раздел 2.1</Header>}>
				<Div>
					Второй абзац, продолжение!
				</Div>
			</Group>
			{snackbar}
		</Panel>
	return Home;
};
