import React, { useState, useEffect } from 'react';
import PropTypes, { func } from 'prop-types';

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
	textValue, setTextValue,
	list_of_users, set_list_of_users, 
	payments_edu, setPayments_edu,
	mailingCategories, setMailingCategories,
}) => {

	const [set_accepted_temp, set_set_accepted_temp] = useState(0);

	useEffect(() => {
		if (textValue && textValue.length > 0)
			setTextValue();
		if (payments_edu && payments_edu.length > 0)
			setPayments_edu();
		if (list_of_users && list_of_users.length > 0)
			set_list_of_users([]);
		if (mailingCategories && mailingCategories.length > 0)
			setMailingCategories([]);
	});
		

	function search_users() {

		// var url = main_url + "profkom_bot/search_users/";
		// fetch(url, {
		// 	method: 'POST',
		// 	body: JSON.stringify({
		// 		querys: window.location.search,
		// 		from: list_left_end,
		// 		to: list_left_end + count_on_page + 1,
		// 		value: value,
		// 	}),
		// 	headers: {
		// 		'Origin': origin
		// 	}
		// })
		// 	.then(response => response.json())
		// 	.then((data) => {
		// 		if (data != "Error") {
		// 			console.log(data)
		// 			setStudents(data)
		// 			return (data)
		// 		}
		// 		else {
		// 			setSnackbar(<Snackbar
		// 				layout="vertical"
		// 				onClose={() => setSnackbar(null)}
		// 				before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
		// 			>
		// 				Ошибка подключения
		// 				</Snackbar>);
		// 			console.error('search_payouts:', data)
		// 			return null
		// 		}
		// 	},
		// 		(error) => {
		// 			setSnackbar(<Snackbar
		// 				layout="vertical"
		// 				onClose={() => setSnackbar(null)}
		// 				before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
		// 			>
		// 				Ошибка подключения
		// 				</Snackbar>);
		// 			console.error('search_payouts:', error)
		// 			return null
		// 		})
	}

	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader 
				left={<PanelHeaderBack onClick={goBack} />}
			>Настройки</PanelHeader>
			<Group>
				<Header mode="secondary">Рассылки</Header>
				<SimpleCell expandable onClick={() => go('Mass_mailing')}>Массовая рассылка</SimpleCell>
				<SimpleCell expandable onClick={() => go('Individual_mailing')}>Индивидуальные сообщения</SimpleCell>
			</Group>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
