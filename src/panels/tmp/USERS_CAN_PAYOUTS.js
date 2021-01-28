import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';

import Group from '@vkontakte/vkui/dist/components/Group/Group';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';

import Icon28FavoriteOutline from '@vkontakte/icons/dist/28/favorite_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';
import Icon28ShareOutline from '@vkontakte/icons/dist/28/share_outline';
import Icon28BrainOutline from '@vkontakte/icons/dist/28/brain_outline';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import Icon28UserOutline from '@vkontakte/icons/dist/28/user_outline';
import Icon28HistoryBackwardOutline from '@vkontakte/icons/dist/28/history_backward_outline';
import Icon28SmartphoneOutline from '@vkontakte/icons/dist/28/smartphone_outline';
import Icon24Copy from '@vkontakte/icons/dist/24/copy';
import Icon28EmployeeOutline from '@vkontakte/icons/dist/28/employee_outline';
import Icon28GraphOutline from '@vkontakte/icons/dist/28/graph_outline';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon24Chevron from '@vkontakte/icons/dist/24/chevron';

import { statusSnackbar, responseEdit, blueBackground } from './style';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Footer from '@vkontakte/vkui/dist/components/Footer/Footer';
import Link from '@vkontakte/vkui/dist/components/Link/Link';
import Div from '@vkontakte/vkui/dist/components/Div/Div';

// var origin = "https://thingworx.asuscomm.com:10888"
// var main_url = "https://profkom-bot-bmstu.herokuapp.com/"

// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = ({ id, go, goBack,
	setPopout, setModal,
	snackbar, setSnackbar,
	setModalData,
	messageValue, setMessageValue,
	list_of_users, set_list_of_users,
	payments_edu, setPayments_edu,
	mailingCategories, setMailingCategories,
	group, setGroup,
	countAttachments, setCountAttachments,
	attachments, setAttachments,
	queryParams, proforg,
	setTooltips,
	students, setStudents, setLogin,
	set_payouts_type, setTabsState,
	set_proforg_mailing,
}) => {

	useEffect(() => {
		
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppOpenPayFormResult') {
				console.log(data)
			}

			if (type === 'VKWebAppOpenPayFormFailed') {
				console.error(data)
			}
		}, []);
	}, []);

	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderBack onClick={goBack} />}
			>Настройки</PanelHeader>
			<Div>
				вадпвдылаи вапвапвыоаплыоватпдывтадплотвыадлоптыва
				пывапоывта
				птыв
				олапт
				ылватп
				доывта
				дпотыв
				адлтп
				ыдвлатпэдлоытвадлптывалптыв
				злапты
				впт
			</Div>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
