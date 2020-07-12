import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';

import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';

var origin = "https://thingworx.asuscomm.com:10888"
var main_url = "https://profkom-bot-bmstu.herokuapp.com/"
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
	queryParams,
}) => {

	const [favorites, setFavorites] = useState(false);
	const [platform, setPlatform] = useState("");

	useEffect(() => {
		setFavorites(queryParams.vk_is_favorite === 1);
		setPlatform(queryParams.vk_platform);

		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppAddToFavoritesResult') {
				setFavorites(true);
				queryParams.vk_is_favorite = 1;
			}
		});
		
		console.log(queryParams)
		console.log(favorites)

		if (messageValue && messageValue.length > 0)
			setMessageValue();
		if (payments_edu && payments_edu.length > 0)
			setPayments_edu();
		if (list_of_users && list_of_users.length > 0)
			set_list_of_users([]);
		if (mailingCategories && mailingCategories.length > 0)
			setMailingCategories([]);
		if (countAttachments && countAttachments > 0)
			setCountAttachments(0);
		if (attachments && attachments.length > 0)
			setAttachments([]);
	});

	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader 
				left={<PanelHeaderBack onClick={goBack} />}
			>Настройки</PanelHeader>
			<Group>
				{!favorites && <SimpleCell expandable onClick={() => {bridge.send("VKWebAppAddToFavorites", {})}}>Добавить в избранное</SimpleCell>}
				{platform == "mobile_android" && <SimpleCell expandable onClick={() => {bridge.send("VKWebAppAddToHomeScreen")}}>Добавить ярлык на рабочий стол</SimpleCell>}
			</Group>
			<Group>
				<SimpleCell expandable onClick={() => go('Mass_mailing')}>Массовая рассылка</SimpleCell>
				<SimpleCell expandable onClick={() => go('Individual_mailing')}>Индивидуальные сообщения</SimpleCell>
			</Group>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
