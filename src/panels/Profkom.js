import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';

import Search from '@vkontakte/vkui/dist/components/Search/Search';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import HorizontalScroll from '@vkontakte/vkui/dist/components/HorizontalScroll/HorizontalScroll';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';
import File from '@vkontakte/vkui/dist/components/File/File';

import Icon24Error from '@vkontakte/icons/dist/24/error';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/browser_forward';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon28HistoryForwardOutline from '@vkontakte/icons/dist/28/history_forward_outline';
import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import Icon28ErrorOutline from '@vkontakte/icons/dist/28/error_outline';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import Icon28MoneyCircleOutline from '@vkontakte/icons/dist/28/money_circle_outline';
import Icon28CancelCircleOutline from '@vkontakte/icons/dist/28/cancel_circle_outline';

import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';
import Tooltip from '@vkontakte/vkui/dist/components/Tooltip/Tooltip';

import { redIcon, blueIcon, greenIcon, blueBackground, redBackground } from './style';
import Footer from '@vkontakte/vkui/dist/components/Footer/Footer';

import circle from "../img/circle_outline_28.svg"
import education_circle from "../img/education_circle_outline_28.svg"

var origin = "https://thingworx.asuscomm.com:10888"
var main_url = "https://profkom-bot-bmstu.herokuapp.com/"
// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = ({ id, go, setPopout,
	setModal, setLogin,
	students, setStudents,
	snackbar, setSnackbar,
	searchValue, setSearchValue,
	setModalData,
	tabsState, setTabsState,
	searchPayouts, setSearchPayouts,
	tooltips, proforg,
}) => {

	const count_on_page = 6;
	const [set_accepted_temp, set_set_accepted_temp] = useState(0);
	const [list_left_end, set_list_left_end] = useState(0);
	const [tooltip_payouts_tips, set_tooltip_payouts_tips] = useState(false);

	useEffect(() => {
		if (tabsState !== "students" && tabsState !== "payouts"){
			setTabsState("students")
			search_users('', 0);
		}

		if (tabsState === "students" && students.length === 0 && searchValue.length === 0)
			search_users('', 0);
		else if (tabsState === "payouts" && searchPayouts.length === 0 && searchValue.length === 0)
			search_payouts('', 0);

		bridge.subscribe(({ detail: { type, data } }) => {
			// if (type === 'VKWebAppStorageGetKeysResult') {
			// 	console.log(data.keys)
			// }
			// if (type === 'VKWebAppStorageGetKeysFailed') {
			// 	console.error(data)
			// }

			// if (type === 'VKWebAppStorageSetResult') {
			// 	console.log(data)
			// }
			// if (type === 'VKWebAppStorageSetFailed') {
			// 	console.error(data)
			// }

			if (type === 'VKWebAppStorageGetResult') {
				if (data.keys[0].key === "tooltip_payouts_tips" &&
					(data.keys[0].value === false || data.keys[0].value === "false")) {
					bridge.send("VKWebAppStorageSet", { "key": "tooltip_payouts_tips", "value": "true" });
					set_tooltip_payouts_tips(true);
				}
			}
			// if (type === 'VKWebAppStorageGetFailed') {
			// 	console.error(data)
			// }
		});
	}, [searchPayouts]);

	function search_payouts(value, list_left_end) {
		var url = main_url + "profkom_bot/search_payouts/";
		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				querys: window.location.search,
				payouts_id: value,
				from: list_left_end,
				to: list_left_end + count_on_page + 1,
			}),
			headers: {
				'Origin': origin
			}
		})
			.then(response => response.json())
			.then((data) => {
				if (data !== "Error") {
					setSearchPayouts(data)
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

	function search_users(value, list_left_end) {

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
				if (data !== "Error") {
					setStudents(data)
					console.log(data)
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

	function set_accepted(id) {
		var temp_arr = searchPayouts;
		for (var i in temp_arr) {
			if (temp_arr[i].id === id) {
				temp_arr[i].status = "accepted";

				var url = main_url + "profkom_bot/edit_payout/";
				var data = temp_arr[i];
				data.querys = window.location.search;
				fetch(url, {
					method: 'POST',
					body: JSON.stringify(data),
					headers: {
						'Origin': origin
					}
				})
					.then(response => response.json())
					.then((data) => {
						if (data !== "Error") {
							console.log("edit_payout", data)
							setSnackbar(<Snackbar
								layout="vertical"
								onClose={() => setSnackbar(null)}
								before={<Avatar size={24} style={blueBackground}><Icon28CheckCircleOutline fill="#fff" width={14} height={14} /></Avatar>}
							>
								Успешно!
							  </Snackbar>);
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
							console.error('edit_payout:', data)
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
							console.error('edit_payout:', error)
							return null
						})
				break;
			}
		}
		setSearchPayouts(temp_arr);
		set_set_accepted_temp(set_accepted_temp + 1)
	}

	function get_before_payouts(is_delete, status) {
		var before = <Icon28DoneOutline />;
		if (is_delete === true) before = <Icon28DeleteOutline style={redIcon} />
		else if (status === "filed") before = <Icon28HistoryForwardOutline />
		else if (status === "accepted") before = <Icon28DoneOutline />
		else if (status === "err") before = <Icon28ErrorOutline style={redIcon} />
		return before;
	}

	function button_list_click(value) {
		set_list_left_end(list_left_end + value);

		if (tabsState === "payouts")
			search_payouts(searchValue, list_left_end + value);
		else if (tabsState === "students")
			search_users(searchValue, list_left_end + value)
	}

	function on_students_click(e, post) {
		// console.log(e.target.getAttribute('class') === "Cell__aside",
		// 	e.target.parentNode.getAttribute('class') === "Cell__aside",
		// 	e.target.parentNode.parentNode.getAttribute('class') === "Cell__aside",
		// 	e.target.parentNode.parentNode.parentNode.getAttribute('class') === "Cell__aside")

		if (e.target.getAttribute('class') === "Cell__aside" ||
			e.target.parentNode.getAttribute('class') === "Cell__aside" ||
			e.target.parentNode.parentNode.getAttribute('class') === "Cell__aside" ||
			e.target.parentNode.parentNode.parentNode.getAttribute('class') === "Cell__aside" ||
			e.target.parentNode.parentNode.parentNode.parentNode.getAttribute('class') === "Cell__aside") {

			var name = "add";
			
			if (e.target.getAttribute('name') !== null) name = e.target.getAttribute('name')
			else if (e.target.parentNode.getAttribute('name') !== null) name = e.target.parentNode.getAttribute('name')
			else if (e.target.parentNode.parentNode.getAttribute('name') !== null) name = e.target.parentNode.parentNode.getAttribute('name')
			console.log(name)
			if (name === "add"){
				var temp = JSON.parse(JSON.stringify(post));
				temp.new = true;
				temp.students_group = post.group;
				temp.students_login = post.login;
				temp.students_name = post.name;
				temp.error = "";
				// console.log(post)
				// console.log(temp)
				setModalData(temp);
				go("payout", true);
			}else if (name === "сontributions"){
				var temp = JSON.parse(JSON.stringify(post));
				temp.group = post.group;
				temp.login = post.login;
				temp.name = post.name;
				temp.сontributions = post.сontributions;
				// console.log(post)
				// console.log(temp)
				setModalData(temp);
				go("сontributions", true);
			}
		} else {
			setLogin(post.login);
			go("User");
		}
	}

	function on_payouts_click(e, post) {

		if (e.target.getAttribute('class') === "Cell__aside" ||
			e.target.parentNode.getAttribute('class') === "Cell__aside" ||
			e.target.parentNode.parentNode.getAttribute('class') === "Cell__aside" ||
			e.target.parentNode.parentNode.parentNode.getAttribute('class') === "Cell__aside") {

			set_accepted(post.id)
		} else if (e.target.getAttribute('class') &&
			e.target.getAttribute('class').toLowerCase().indexOf("button") > -1) {

			var obj = e.target
			for (var i = 0; i < 3; i++) {
				if (obj.name && obj.name === "login")
					break;
				else
					obj = obj.parentNode;
			}
			setLogin(post.students_login);
			go("User");
		} else {
			post.new = false;
			setModalData(post);
			go('payout', true);
		}
	}

	const proforg_levels = [
		"Не профорг",
		"Профорг группы",
		"Дежурный",
		"Председатель",
	]
	const сontributions_icon = {
		"none": <img src={circle} style={{ width:28, height:28 }} name="сontributions" />,
		"studentship": <img src={education_circle} style={{ width:28, height:28 }} name="сontributions" />,
		"paid": <Icon28MoneyCircleOutline name="icon" style={greenIcon} name="сontributions" />,
		"deny": <Icon28CancelCircleOutline name="icon" style={redIcon} name="сontributions" />,
	}
	// function payouts_tip_click(keys) {
	// 	if (keys.value === false || keys.value === "false") {
	// 		bridge.send("VKWebAppStorageSet", { "key": "tooltip_payouts_tips", "value": "true"});
	// 		set_tooltip_payouts_tips(true);
	// 	}
	// }

	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderButton><Icon28SettingsOutline onClick={() => go("Settings")} /></PanelHeaderButton>}
			>Профком МГТУ</PanelHeader>

			<FixedLayout vertical="top">
				{proforg > 1 && <Tabs mode="buttons">
					<TabsItem
						onClick={() => {
							search_users('', 0);
							setTabsState('students');
							setSearchValue("");
							setStudents([]);
							set_list_left_end(0);
						}}
						selected={tabsState === 'students'}
					>Студенты</TabsItem>
					<TabsItem
						onClick={() => {
							search_payouts('', 0);
							setTabsState('payouts')
							setSearchValue("");
							setSearchPayouts([]);
							set_list_left_end(0);
							if (tooltips.indexOf("tooltip_payouts_tips") === -1) {
								bridge.send("VKWebAppStorageGet", { "keys": ["tooltip_payouts_tips"] });
								tooltips.push("tooltip_payouts_tips");
							}
						}}
						selected={tabsState === 'payouts'}
					>Заявления</TabsItem>
				</Tabs>}
				<Search
					value={searchValue}
					placeholder={tabsState === 'payouts' ? "Номер заявления" : "Фамилия, группа или студ. билет"}
					onChange={(e) => {
						const { value } = e.currentTarget;
						if (tabsState === "payouts")
							search_payouts(value, 0);
						else if (tabsState === "students")
							search_users(value, 0)
						setSearchValue(value);
						set_list_left_end(0);
					}}
					// icon={tabsState === 'payouts' && <Icon24Send />}
					after={null}
				/>
			</FixedLayout>
			<Tooltip
				// mode="light"
				text="У заявления можете нажать на Фио или Студ билет для открытия студента"
				isShown={tooltip_payouts_tips}
				onClose={() => set_tooltip_payouts_tips(false)}
				offsetX={100}
				offsetY={0}
				cornerOffset={80}
			>
				<Div style={{ paddingTop: 80, paddingBottom: 60 }}>
					{tabsState === "students" && students.slice(0, count_on_page).map((post, i) =>
						(<Group key={i}>
							<Cell size="l" onClick={(e) => {
								on_students_click(e, post);
							}}
								asideContent={proforg > 1 &&
									<div style={{ display: 'flex' }}>
										{сontributions_icon[post.сontributions]}
										<Icon28AddOutline name="add" style={{ color: 'var(--accent)', marginLeft: 8}} />
									</div>
								}
								bottomContent={
									<HorizontalScroll>
										<div style={{ display: 'flex' }}>
											<Button size="m" mode="outline">{post.group}</Button>
											<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{post.login}</Button>
											{post.proforg > 0 && <Button size="m" mode="outline" style={{ marginLeft: 8 }}>{proforg_levels[post.proforg]}</Button>}
										</div>
									</HorizontalScroll>
								}>{post.name}</Cell>
						</Group>))}
					{/* {tabsState === "payouts" && get_payouts().map((post) => */}
					{tabsState === "payouts" && searchPayouts.slice(0, count_on_page).map((post, i) =>
						(<Group key={i}>
							<Cell size="l" onClick={(e) => {
								on_payouts_click(e, post);
							}}
								before={get_before_payouts(post.delete, post.status)}
								asideContent={(post.status === "filed" && post.delete === false) &&
									// <div style={{ display: 'flex' }}>
									<Icon28DoneOutline style={blueIcon} />}
								// <Icon28CancelCircleOutline style={{ marginLeft: 8, color: 'red' }} />
								// </div>}
								bottomContent={
									<HorizontalScroll>
										<div style={{ display: 'flex' }}>
											<Button size="m" mode="outline">{post.id}</Button>


											<Button size="m" mode="outline"
												style={{ marginLeft: 8 }} id={post.students_login} name="login"
											>{post.students_login}</Button>
											<Button size="m" mode="outline"
												style={{ marginLeft: 8 }} id={post.students_login} name="login"
											>{post.surname_and_initials}</Button>
										</div>
									</HorizontalScroll>
								}>{post.payouts_type}</Cell>
						</Group>))}
					{((students.length === 0 && tabsState === "students") || (searchPayouts.length === 0 && tabsState === "payouts")) &&
						<Footer>По вашему запросу ничего не найдено</Footer>}
				</Div>
			</Tooltip>
			<FixedLayout vertical="bottom" filled>
				<Separator wide />
				<Div style={{ display: 'flex' }}>
					{list_left_end > 0 ?
						<Button size="l" before={<Icon24BrowserBack />}
							stretched mode="secondary" style={{ marginRight: 8 }}
							onClick={() => button_list_click(-count_on_page)}
						>Назад</Button>
						: <Button size="l" stretched mode="tertiary" style={{ marginRight: 8 }} ></Button>}

					{(students.length > count_on_page && tabsState === "students") ||
						(searchPayouts.length > count_on_page && tabsState === "payouts") ?
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
