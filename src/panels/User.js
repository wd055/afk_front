import { parsePhoneNumberFromString } from 'libphonenumber-js'
import React, { useState, useEffect } from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';

import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';
import Link from '@vkontakte/vkui/dist/components/Link/Link';
import InfoRow from '@vkontakte/vkui/dist/components/InfoRow/InfoRow';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import HorizontalScroll from '@vkontakte/vkui/dist/components/HorizontalScroll/HorizontalScroll';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import CellButton from '@vkontakte/vkui/dist/components/CellButton/CellButton';

import Icon24Error from '@vkontakte/icons/dist/24/error';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon28HistoryForwardOutline from '@vkontakte/icons/dist/28/history_forward_outline';
import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import Icon28ErrorOutline from '@vkontakte/icons/dist/28/error_outline';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28LogoVkOutline from '@vkontakte/icons/dist/28/logo_vk_outline';
import Icon28MailOutline from '@vkontakte/icons/dist/28/mail_outline';
import Icon28PhoneOutline from '@vkontakte/icons/dist/28/phone_outline';
import Icon16Chevron from '@vkontakte/icons/dist/16/chevron';
import Icon24Copy from '@vkontakte/icons/dist/24/copy';

import bridge from '@vkontakte/vk-bridge';

import { redIcon, blueIcon, orangeBackground, blueBackground, redBackground } from './style';

var origin = "https://thingworx.asuscomm.com:10888"
var main_url = "https://profkom-bot-bmstu.herokuapp.com/"
// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = ({ id, go, goBack,
	login,
	snackbar, setSnackbar,
	setModalData,
	student, setStudent
}) => {

	const [set_accepted_temp, set_set_accepted_temp] = useState(0);
	const [tabsState, setTabsState] = useState("actual");
	const [payoutsShow, setPayoutsShow] = useState("users_payouts");


	useEffect(() => {
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppCopyTextResult') {
				setSnackbar(<Snackbar
					layout="vertical"
					onClose={() => setSnackbar(null)}
					before={<Avatar size={24} style={blueBackground}><Icon24Copy fill="#fff" width={14} height={14} /></Avatar>}
				>
					Скопировано в буфер обмена
				  </Snackbar>);
			}
			if (type === 'VKWebAppCopyTextFailed') {
				setSnackbar(<Snackbar
					layout="vertical"
					onClose={() => setSnackbar(null)}
					before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
				>
					Ошибка копирования
				  </Snackbar>);
			}
		});

		if (student.login != login)
			get_users_info();
		console.log(student, login)
	});

	function copy_in_bufer(text) {
		bridge.send("VKWebAppCopyText", { text: text });
	}

	function get_users_info() {
		var url = main_url + "profkom_bot/get_users_info/";
		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				querys: window.location.search,
				students_login: login
			}),
			headers: {
				'Origin': origin
			}
		})
			.then(response => response.json())
			.then((data) => {
				if (data != "Error") {
					console.log("users get_users_info", data)
					data.login = login;

					if (data.phone) {
						const phoneNumber = parsePhoneNumberFromString(data.phone, 'RU')
						if (phoneNumber) {
							console.log(phoneNumber.formatNational());
							data.phone = phoneNumber.formatNational();
						}
					}

					setStudent(data)
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

	function set_accepted(id) {
		var temp_arr = student.users_payouts;
		for (var i in temp_arr) {
			if (temp_arr[i].id == id) {
				temp_arr[i].status = "accepted";

				var url = main_url + "profkom_bot/edit_payout/";
				var data = temp_arr[i];
				data.querys = window.location.search;
				console.log(data)
				fetch(url, {
					method: 'POST',
					body: JSON.stringify(data),
					headers: {
						'Origin': origin
					}
				})
					.then(response => response.json())
					.then((data) => {
						if (data != "Error") {
							
							var temp_all_arr = student.users_all_payouts;
							for (var i in temp_all_arr) {
								if (temp_all_arr[i].id == id) {
									console.log(temp_all_arr[i])
									temp_all_arr[i].status = "accepted";
								}
							}

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
							console.error('edit_payout_data:', data)
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
		set_set_accepted_temp(set_accepted_temp + 1)
	}

	function get_before_payouts(is_delete, status) {
		var before = <Icon28DoneOutline />;
		if (is_delete == true) before = <Icon28DeleteOutline style={redIcon} />
		else if (status == "filed") before = <Icon28HistoryForwardOutline />
		else if (status == "accepted") before = <Icon28DoneOutline />
		else if (status == "err") before = <Icon28ErrorOutline style={redIcon} />
		return before;
	}

	function on_payouts_click(e, post) {

		if (e.target.getAttribute('class') == "Cell__aside" ||
			e.target.parentNode.getAttribute('class') == "Cell__aside" ||
			e.target.parentNode.parentNode.getAttribute('class') == "Cell__aside" ||
			e.target.parentNode.parentNode.parentNode.getAttribute('class') == "Cell__aside") {

			set_accepted(post.id)
		}
		else {
			post.new = false;

			post.students_group = student.group;
			post.students_login = login;
			post.students_name = student.name;

			setModalData(post);
			go('payout', true);
		}
	}

	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				// left={<PanelHeaderBack onClick={goBack} />}
				left={<PanelHeaderBack onClick={goBack} />}
			>Профком МГТУ</PanelHeader>
			<Group>
				<Cell size="l" onClick={() => get_users_info()}
					before={(student.photo_100 && student.photo_100.length > 0) && <Avatar size={40} src={student.photo_100} />}
					bottomContent={
						<HorizontalScroll>
							<div style={{ display: 'flex' }}>
								<Button size="m" mode="outline">{student.group}</Button>
								<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{login}</Button>
							</div>
						</HorizontalScroll>
					}>{student.name}</Cell>
			</Group>

			<Header
				mode="secondary"
				aside={<Icon16Chevron />}
				onClick={() => go("Home")}
			>
				Подробнее
			</Header>

			<Group separator={"hide"}>

				{/* {(student.domain && student.domain.length > 0) &&
					<SimpleCell
						before={<Icon28LogoVkOutline />}
						onClick={() => copy_in_bufer(student.domain)}
					>
						<InfoRow>
							{student.domain}
						</InfoRow>
					</SimpleCell>}*/}


				{(student.domain && student.domain.length > 0) &&
					<Link href={"https://vk.com/" + student.domain} target="_blank">
						<CellButton
							before={<Icon28LogoVkOutline />}
						// onClick={() => copy_in_bufer(student.domain)}
						>{student.domain}</CellButton>
					</Link>}

				{/* {(student.phone != null && student.phone.length > 0) &&
					// <Link href={"tel:" + student.phone} target="_blank">
					<CellButton
						before={<Icon28PhoneOutline />}
						onClick={() => copy_in_bufer(student.phone)}
					>{student.phone}</CellButton>
					// </Link>
				}

				{(student.email != null && student.email.length > 0) &&
					// <Link href={"mailto:" + student.email} target="_blank">
					<CellButton
						before={<Icon28MailOutline />}
						onClick={() => copy_in_bufer(student.email)}
					>{student.email}</CellButton>
					// </Link>
				} */}

				{(student.phone != null && student.phone.length > 0) &&
					<SimpleCell
						before={<Icon28PhoneOutline />}
						onClick={() => copy_in_bufer(student.phone)}
					>
						<InfoRow>
							{student.phone}
						</InfoRow>
					</SimpleCell>}

				{(student.email != null && student.email.length > 0) &&
					<SimpleCell
						before={<Icon28MailOutline />}
						onClick={() => copy_in_bufer(student.email)}
					>
						<InfoRow>
							{student.email}
						</InfoRow>
					</SimpleCell>}
			</Group>


			<Group separator={"hide"}>
				<Div>
					<Button
						stretched
						size="xl"
						onClick={() => {
							var data = {
								new: true,
								students_group: student.group,
								students_login: login,
								students_name: student.name,
								error: "",
							}
							setModalData(data);
							go('payout', true);
						}}
					>Добавить заявление</Button>
				</Div>
			</Group>

			<Group>
				<Tabs mode="buttons">
					<TabsItem
						onClick={() => {
							setTabsState('actual');
							setPayoutsShow("users_payouts");
						}}
						selected={tabsState === 'actual'}
					>Актуальные заявления</TabsItem>
					<TabsItem
						onClick={() => {
							setTabsState('all');
							setPayoutsShow("users_all_payouts");
						}}
						selected={tabsState === 'all'}
					>Неактуальные заявления</TabsItem>
				</Tabs>

				{student[payoutsShow].map((post, i) => post.delete == false &&
					(<Group key={i} separator={"show"}>
						<Cell size="l" onClick={(e) => {
							on_payouts_click(e, post);
						}}
							before={get_before_payouts(post.delete, post.status)}
							asideContent={post.status == "filed" &&
								<Icon28DoneOutline style={blueIcon} />}
							// bottomContent={<Button size="m" mode="outline">{post.id}</Button>}
							description={post.id}
						>{post.payouts_type}</Cell>
					</Group>))}
			</Group>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
