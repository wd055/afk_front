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

import { statusSnackbar } from './style';

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
			
			if (type === 'VKWebAppStorageGetKeysResult') {
				console.log(data.keys)
				repeat_learning(data.keys);
			}
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
			// 	console.log(data)
			// }
			// if (type === 'VKWebAppStorageGetFailed') {
			// 	console.error(data)
			// }
		});
		
		console.log(queryParams)

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
	}, []);

	function repeat_learning(keys){
		for(var i in keys){
			console.log(keys[i])
			if (keys[i].indexOf("tooltip") > -1){
				bridge.send("VKWebAppStorageSet", {"key": keys[i], "value": "false"});
			}
		}
		statusSnackbar(200, setSnackbar);
	}
	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader 
				left={<PanelHeaderBack onClick={goBack} />}
			>Настройки</PanelHeader>
			<Group>
				{!favorites &&
					<SimpleCell
						expandable
						onClick={() => { bridge.send("VKWebAppAddToFavorites", {}) }}
						before={<Icon28FavoriteOutline />}
					>Добавить в избранное</SimpleCell>}
				{platform === "mobile_android" &&
					<SimpleCell
						expandable
						onClick={() => { bridge.send("VKWebAppAddToHomeScreen") }}
						before={<Icon28AddCircleOutline />}
					>Добавить ярлык на рабочий стол</SimpleCell>}
				<SimpleCell
					expandable
					onClick={() => { bridge.send("VKWebAppShare") }}
					before={<Icon28ShareOutline />}
				>Поделиться приложением</SimpleCell>
				<SimpleCell
					expandable
					onClick={() => {bridge.send("VKWebAppStorageGetKeys", {"count": 100})}}
					before={<Icon28BrainOutline />}
					description="Сброс информационных плашек"
				>Повторное обучение</SimpleCell>
			</Group>
			{proforg >= 3 && <Group>
				<SimpleCell expandable onClick={() => go('MASS_MAILING')}>Массовая рассылка</SimpleCell>
				<SimpleCell expandable onClick={() => go('INDIVIDUAL_MAILING')}>Индивидуальные сообщения</SimpleCell>
			</Group>}
			{snackbar}
		</Panel>
	return Home;
}

export default App;
