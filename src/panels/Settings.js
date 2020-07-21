import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';

import Group from '@vkontakte/vkui/dist/components/Group/Group';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';

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

import { statusSnackbar } from './style';
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

			if (type === 'VKWebAppOpenPayFormResult') {
				console.log(data)
			}

			if (type === 'VKWebAppOpenPayFormFailed ') {
				console.log(data)
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
		}, []);

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
		if (students && students.length > 0)
			setStudents([]);
		if (group && group.length > 0)
			setGroup();
		setLogin(null);
		set_payouts_type("");
		setTabsState("students");
	}, []);

	function repeat_learning() {
		var tooltips_names = [
			"tooltip_payouts_tips",
			"tooltip_users_contact",
			"tooltip_users_payout",
		]
		for (var i in tooltips_names) {
			bridge.send("VKWebAppStorageSet", { "key": tooltips_names[i], "value": "false" });
		}
		setTooltips([]);
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
					onClick={repeat_learning}
					before={<Icon28BrainOutline />}
					description="Сброс информационных плашек"
				>Повторное обучение</SimpleCell>
			</Group>
			{proforg >= 3 && <Group>
				<SimpleCell
					expandable
					onClick={() => go('MASS_MAILING')}
					before={<Icon28Users3Outline />}
				>Массовая рассылка</SimpleCell>
				<SimpleCell
					expandable
					onClick={() => go('INDIVIDUAL_MAILING')}
					before={<Icon28UserOutline />}
				>Индивидуальные сообщения</SimpleCell>
				<SimpleCell
					expandable
					onClick={() => go('MAILING')}
					before={<Icon28HistoryBackwardOutline />}
				>История рассылок</SimpleCell>
			</Group>}
			{/* <Div>
				<form method="POST" action="https://money.yandex.ru/quickpay/confirm.xml" target="_blank">
					<input type="hidden" name="receiver" value="410013037147495" />
					<input type="hidden" name="formcomment" value="Оплата профвзноса" />
					<input type="hidden" name="short-dest" value="Оплата профвзноса" />
					<input type="hidden" name="quickpay-form" value="small" />
					<input type="hidden" name="targets" value="Оплата профвзноса" />
					<input type="hidden" name="sum" value="1" data-type="number" />
					<input type="hidden" name="paymentType" value="PC" />
					<Button mode="commerce" type="submit" value="Перевести">Оплатить профвзнос через Яндекс.Деньги</Button>
				</form>
			</Div>
			<Div>
				<Button
					mode="commerce"
					type="submit"
					value="Перевести"
					onClick={() => bridge.send("VKWebAppOpenPayForm",
						{
							"app_id": 7446946,
							"action": "pay-to-group",
							"params": { "group_id": 195888448, "amount": 1, "aid": 7446946 }
						})}
				>Оплатить профвзнос через VK Pay</Button>
			</Div> */}
			{snackbar}
		</Panel>
	return Home;
}

export default App;
