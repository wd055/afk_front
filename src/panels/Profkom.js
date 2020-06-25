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

import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';

import bridge from '@vkontakte/vk-bridge';

var origin = "https://thingworx.asuscomm.com:10888"
var main_url = "https://profkom-bot-bmstu.herokuapp.com/"
// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = ({ id, fetchedUser, go, setPopout, setModal }) => {
	const redIcon = {
		color: 'red'
	};
	const blueIcon = {
		color: 'var(--accent)'
	};
	const orangeBackground = {
		backgroundImage: 'linear-gradient(135deg, #ffb73d, #ffa000)'
	};

	const blueBackground = {
		backgroundColor: 'var(--accent)'
	};
	const redBackground = {
		backgroundColor: 'var(--field_error_border)'
	};

	const [students, setStudents] = useState([]);
	const [searchPayouts, setSearchPayouts] = useState([]);
	const [snackbar, setSnackbar] = useState();
	const [tabsState, setTabsState] = useState('students');
	const [searchValue, setSearchValue] = useState("");

	const count_on_page = 8;
	const [search_lenght, set_search_lenght] = useState(4000);
	const [list_left_end, set_list_left_end] = useState(0);
	const [list_right_end, set_list_right_end] = useState(count_on_page);

	// fetch(main_url + "profkom_bot/get_users_info/", {
	// 	method: 'POST',
	// 	body: JSON.stringify({
	// 		querys: window.location.search,
	// 		students_login:"19У153"
	// 	}),
	// 	headers: {
	// 		'Origin': origin
	// 	}
	// })
	// 	.then(response => response.json())
	// 	.then((data) => {
	// 		console.log("get_users_info", data)
	// 	},
	// 		(error) => {
	// 			console.error('get_users_info:', error)
	// 		})

	useEffect(() => {
		if (students.length == 0)
			get_all_users();
		if (searchPayouts.length == 0) {
			search_payouts("");
			get_paoyuts();
		}
	});

	function search_payouts(value) {
		var url = main_url + "profkom_bot/search_payouts/";
		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				querys: window.location.search,
				payouts_id: value
			}),
			headers: {
				'Origin': origin
			}
		})
			.then(response => response.json())
			.then((data) => {
				if (data != "Error") {
					console.log(data)
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

	function get_all_users() {
		var url = main_url + "profkom_bot/get_all_users/";
		if (students.length == 0 && students != null) {
			fetch(url, {
				method: 'POST',
				body: JSON.stringify({
					querys: window.location.search,
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
						console.error('get_all_users:', error)
						return null
					})
		}
	}

	function getSearchFilter() {
		return students.filter(({ name, login }) =>
			(name.toLowerCase().indexOf(searchValue.toLowerCase()) == 0 ||
				login.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
		)
	}

	function getPayoutsSearchFilter() {
		return searchPayouts.filter(({ id }) => (id.toString().toLowerCase().indexOf(searchValue.toLowerCase()) == 0))
	}

	function getLenghtSearchFilter() {
		return tabsState == "students" ? getSearchFilter().length : getPayoutsSearchFilter().length;
	}

	function set_accepted(id) {
		console.log(id);
	}

	function drow_payouts_list() {
		var rows = [];
		var temp_arr = getPayoutsSearchFilter();
		var search_arr = temp_arr.slice(list_left_end, list_right_end);

		for (var i in search_arr) {
			var before = <Icon28DoneOutline />;
			if (search_arr[i].delete == true) before = <Icon28DeleteOutline style={redIcon} />
			else if (search_arr[i].status == "filed") before = <Icon28HistoryForwardOutline />
			else if (search_arr[i].status == "accepted") before = <Icon28DoneOutline />
			else if (search_arr[i].status == "err") before = <Icon28ErrorOutline style={redIcon} />

			rows.push(<Cell key={i} size="l"
				before={before}
				asideContent={search_arr[i].status == "filed" &&
					<div style={{ display: 'flex' }}>
						<Icon28DoneOutline style={blueIcon} onClick={set_accepted} />
						<Icon28CancelCircleOutline style={{ marginLeft: 8, color: 'red' }} />
					</div>
				}
				bottomContent={
					<HorizontalScroll>
						<div style={{ display: 'flex' }}>
							<Button size="m" mode="outline">{search_arr[i].id}</Button>
							<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{search_arr[i].students_login}</Button>
							<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{search_arr[i].surname_and_initials}</Button>
						</div>
					</HorizontalScroll>
				}>{search_arr[i].payouts_type}</Cell>);

			rows.push(<Separator style={{ margin: '2px 0' }} />)
		}
		rows = rows.slice(0, -1)
		return rows
	}

	function get_paoyuts() {
		var temp_arr = getPayoutsSearchFilter();
		var search_arr = temp_arr.slice(list_left_end, list_right_end);
		return search_arr;
	}

	function get_students() {
		var temp_arr = getSearchFilter();
		var search_arr = temp_arr.slice(list_left_end, list_right_end);
		return search_arr;
	}

	function get_before_payouts(is_delete, status){
		var before = <Icon28DoneOutline />;
		if (is_delete == true) before = <Icon28DeleteOutline style={redIcon} />
		else if (status == "filed") before = <Icon28HistoryForwardOutline />
		else if (status == "accepted") before = <Icon28DoneOutline />
		else if (status == "err") before = <Icon28ErrorOutline style={redIcon} />
		return before;
	}
	
	function drow_students_list() {
		var rows = [];
		var temp_arr = getSearchFilter();
		var search_arr = temp_arr.slice(list_left_end, list_right_end);

		for (var i in search_arr) {
			rows.push(<Cell key={i} size="l"
				asideContent={
					<Icon28AddOutline style={blueIcon} />
				}
				bottomContent={
					<HorizontalScroll>
						<div style={{ display: 'flex' }}>
							<Button size="m" mode="outline">{search_arr[i].group}</Button>
							<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{search_arr[i].login}</Button>
						</div>
					</HorizontalScroll>
				}>{search_arr[i].name}</Cell>);

			rows.push(<Separator style={{ margin: '2px 0' }} />)
		}
		rows = rows.slice(0, -1)
		return rows
	}

	function left_button_list_click() {
		set_list_left_end(list_left_end - count_on_page);
		set_list_right_end(list_right_end - count_on_page);
	}
	function right_button_list_click() {
		set_list_left_end(list_left_end + count_on_page);
		set_list_right_end(list_right_end + count_on_page);
	}

	const Home =
		<Panel id={id} style={{ 'max-width': 600, margin: 'auto' }}>
			<PanelHeader>Профком МГТУ</PanelHeader>

			<Tabs mode="buttons">
				<TabsItem
					onClick={() => setTabsState('students')}
					selected={tabsState === 'students'}
				>Студенты</TabsItem>
				<TabsItem
					onClick={() => {
						if (searchPayouts.length == 0)
							search_payouts('');
						setTabsState('payouts')
					}}
					selected={tabsState === 'payouts'}
				>Заявления</TabsItem>
			</Tabs>

			<Search
				value={searchValue}
				placeholder={tabsState === 'payouts' ? "Поиск по номеру заявления" : "Поиск по ФИО или студ. билету"}
				onChange={(e) => {
					const { value } = e.currentTarget;
					setSearchValue(value);
					set_list_left_end(0);
					set_list_right_end(count_on_page);
				}}
				// icon={tabsState === 'payouts' && <Icon24Send />}
				after={null}
			/>
			<List>
				{tabsState == "payouts" && get_paoyuts().map((post) =>
					(<Group>
						<Cell key={post.i} size="l"
							before={get_before_payouts(post.delete, post.status)}
							asideContent={post.status == "filed" &&
								<div style={{ display: 'flex' }}>
									<Icon28DoneOutline style={blueIcon} onClick={() => console.log(post.id)} />
									<Icon28CancelCircleOutline style={{ marginLeft: 8, color: 'red' }} />
								</div>}
							bottomContent={
								<HorizontalScroll>
									<div style={{ display: 'flex' }}>
										<Button size="m" mode="outline">{post.id}</Button>
										<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{post.students_login}</Button>
										<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{post.surname_and_initials}</Button>
									</div>
								</HorizontalScroll>
							}>{post.payouts_type}</Cell>
					</Group>))}
				{tabsState == "students" && get_students().map((post) =>
					(<Group>
						<Cell key={post.i} size="l"
							asideContent={
								<Icon28AddOutline style={blueIcon} />
							}
							bottomContent={
								<HorizontalScroll>
									<div style={{ display: 'flex' }}>
										<Button size="m" mode="outline">{post.group}</Button>
										<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{post.login}</Button>
									</div>
								</HorizontalScroll>
							}>{post.name}</Cell>
					</Group>))}
			</List>

			<Div style={{ display: 'flex' }}>
				{list_left_end > 0 ?
					<Button size="l" before={<Icon24BrowserBack />} stretched mode="secondary" style={{ marginRight: 8 }} onClick={left_button_list_click}>Назад</Button>
					: <Button size="l" stretched mode="tertiary" style={{ marginRight: 8 }} ></Button>}

				{list_right_end <= getLenghtSearchFilter() ?
					<Button size="l" after={<Icon24BrowserForward />} stretched mode="secondary" onClick={right_button_list_click}>Вперед</Button>
					: <Button size="l" stretched mode="tertiary"></Button>}
			</Div>

			{snackbar}
		</Panel>
	return Home;
}

export default App;
