import React, { useState, useEffect } from 'react';
import PropTypes, { func } from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';

import Select from '@vkontakte/vkui/dist/components/Select/Select';
import Radio from '@vkontakte/vkui/dist/components/Radio/Radio';
import Textarea from '@vkontakte/vkui/dist/components/Textarea/Textarea';
import Checkbox from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';
import Link from '@vkontakte/vkui/dist/components/Link/Link';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';
import Icon16Done from '@vkontakte/icons/dist/16/done';

import Group from '@vkontakte/vkui/dist/components/Group/Group';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import InfoRow from '@vkontakte/vkui/dist/components/InfoRow/InfoRow';
import RichCell from '@vkontakte/vkui/dist/components/RichCell/RichCell';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import HorizontalScroll from '@vkontakte/vkui/dist/components/HorizontalScroll/HorizontalScroll';
import List from '@vkontakte/vkui/dist/components/List/List';
import Search from '@vkontakte/vkui/dist/components/Search/Search';
import Gallery from '@vkontakte/vkui/dist/components/Gallery/Gallery';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';

import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';
import Icon24Error from '@vkontakte/icons/dist/24/error';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon24Send from '@vkontakte/icons/dist/24/send';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/browser_forward';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon28HistoryForwardOutline from '@vkontakte/icons/dist/28/history_forward_outline';
import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import Icon28CancelCircleOutline from '@vkontakte/icons/dist/28/cancel_circle_outline';
import Icon28ErrorOutline from '@vkontakte/icons/dist/28/error_outline';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';

import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';

import bridge from '@vkontakte/vk-bridge';

import { redIcon, blueIcon, orangeBackground, blueBackground, redBackground } from './style';

var origin = "https://thingworx.asuscomm.com:10888"
var main_url = "https://profkom-bot-bmstu.herokuapp.com/"
// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = ({ id, fetchedUser,
	go, goBack, setPopout,
	setModal, setLogin,
	students, setStudents,
	snackbar, setSnackbar,
	searchValue, setSearchValue,
	setModalData,
	tabsState, setTabsState,
	searchPayouts, setSearchPayouts,
	list_of_users, set_list_of_users,
}) => {

	const count_on_page = 6;
	const [set_accepted_temp, set_set_accepted_temp] = useState(0);
	const [list_left_end, set_list_left_end] = useState(0);
	const [list_of_login, set_list_of_login] = useState([]);

	useEffect(() => {
		if (students.length == 0 && searchValue.length == 0)
			search_users('', 0);
		set_selected();
	});

	function search_users(value, list_left_end) {
		check_selected();

		var url = main_url + "profkom_bot/search_users/";
		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				querys: window.location.search,
				from: list_left_end,
				to: list_left_end + count_on_page + 1,
				value: value,
			}),
			headers: {
				'Origin': origin
			}
		})
			.then(response => response.json())
			.then((data) => {
				if (data != "Error") {
					console.log(data)
					setStudents(data)
					return (data)
				}
				else {
					setSnackbar(<Snackbar
						layout="vertical"
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
					>
						Ошибка подключения
						</Snackbar>);
					console.error('search_payouts:', data)
					return null
				}
			},
				(error) => {
					setSnackbar(<Snackbar
						layout="vertical"
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
					>
						Ошибка подключения
						</Snackbar>);
					console.error('search_payouts:', error)
					return null
				})
	}

	function button_list_click(value) {
		set_list_left_end(list_left_end + value);
		search_users(searchValue, list_left_end + value)
	}

	function on_students_click(post) {
		console.log(post.login)
		setLogin(post.login);
		go("User");
	}
	
	function check_selected(){
		var arr = document.getElementsByName('users');
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].checked && list_of_login.indexOf(arr[i].id) == -1){
				list_of_login.push(arr[i].id);
				list_of_users.push({
					login:arr[i].dataset.login,
					vk_id:arr[i].dataset.vk_id,
					name:arr[i].dataset.name,
					group:arr[i].dataset.group,
				});
			}else if (!arr[i].checked && list_of_login.indexOf(arr[i].id) > -1){
				var p = list_of_login.indexOf(arr[i].id);
				list_of_login.splice(p, 1);
				list_of_users.push(p, 1);
			}
		}
		console.log(arr[0].dataset.boo)
		console.log(list_of_login)
		console.log(list_of_users)
	}

	function set_selected() {
		var arr = document.getElementsByName("users");
		for (var i = 0; i < arr.length; i++) {
				arr[i].checked = list_of_login.indexOf(arr[i].id) > -1;
		}
	}

	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader 
				left={<PanelHeaderBack onClick={() => {
					search_users('', 0)
					setSearchValue('');
					set_list_left_end(0);
					goBack();
				}} />}
			>Выбор студентов для рассылки</PanelHeader>

			<FixedLayout vertical="top">
				<Search
					value={searchValue}
					placeholder={"Поиск по фамилии или студ. билету"}
					onChange={(e) => {
						const { value } = e.currentTarget;
						search_users(value, 0)
						setSearchValue(value);
						set_list_left_end(0);
					}}
					after={null}
				/>
			</FixedLayout>
			<Div style={{  paddingTop: 40, paddingBottom: 60 }}>
				{students.slice(0, count_on_page).map((post, i) =>
					(<Group key={i}>
						<Cell 
							size="l" 
							name="users"
							id={post.login}
							selectable={post.vk_id.length > 0}
							
							data-login={post.login}
							data-vk_id={post.vk_id}
							data-name={post.name}
							data-group={post.group}

							// defaultChecked={list_of_login.indexOf(post.login) > -1}
							// onClick={(e) => {
							// 	on_students_click(post);
							// }}

							// asideContent={
							// 	<Icon28AddOutline name="icon" style={blueIcon} />
							// }

							bottomContent={
								<HorizontalScroll>
									<div style={{ display: 'flex' }}>
										<Button 
											size="m" 
											mode="outline"
											onClick={(e) => {
												on_students_click(post);
											}}
										>{post.group}</Button>
										<Button 
											size="m" 
											mode="outline" 
											onClick={(e) => {
												on_students_click(post);
											}}
											style={{ marginLeft: 8 }}
										>{post.login}</Button>
									</div>
								</HorizontalScroll>
							}>{post.name}</Cell>
					</Group>))}
			</Div>

			<FixedLayout vertical="bottom" filled>
				<Separator wide />
				<Div style={{ display: 'flex' }}>
					{list_left_end > 0 ?
						<Button size="l" before={<Icon24BrowserBack />}
							stretched mode="secondary" style={{ marginRight: 8 }}
							onClick={() => button_list_click(-count_on_page)}
						>Назад</Button>
						: <Button size="l" stretched mode="tertiary" style={{ marginRight: 8 }} ></Button>}

					{(students.length > count_on_page && tabsState == "students") ?
						<Button size="l" after={<Icon24BrowserForward />}
							stretched mode="secondary"
							onClick={() => button_list_click(count_on_page)}
						>Вперед</Button>
						: <Button size="l" stretched mode="tertiary"></Button>}
				</Div>
			</FixedLayout>

			{snackbar}
		</Panel>
	return Home;
}

export default App;
