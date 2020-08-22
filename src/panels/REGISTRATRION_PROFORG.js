import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';

import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';

import HorizontalScroll from '@vkontakte/vkui/dist/components/HorizontalScroll/HorizontalScroll';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Counter from '@vkontakte/vkui/dist/components/Counter/Counter';
import TabbarItem from '@vkontakte/vkui/dist/components/TabbarItem/TabbarItem';

import { statusSnackbar, blueIcon } from './style';

import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon28QrCodeOutline from '@vkontakte/icons/dist/28/qr_code_outline';
import Icon28ShareOutline from '@vkontakte/icons/dist/28/share_outline';
import Button from '@vkontakte/vkui/dist/components/Button/Button';

var origin = "https://thingworx.asuscomm.com:10888"
var main_url = "https://profkom-bot-bmstu.herokuapp.com/"

// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = ({ id, go, goBack,
	setPopout, login, 
	snackbar, setSnackbar,
	student, usersInfo,
	queryParams,
}) => {

	const [tokens, setTokens] = useState([]);
	const [platform, setPlatform] = useState("");

	useEffect(() => {
		setPlatform(queryParams.vk_platform);
		getTokens();
	}, []);

	const proforg_levels = [
		"Не профорг",
		"Профорг группы",
		"Дежурный",
		"Председатель",
	]

	function getTokens() {
		var url = main_url + "profkom_bot/get_registrationProforg/";

		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				querys: window.location.search,
			}),
			headers: {
				'Origin': origin
			}
		})
			.then(function(response) {
				if (!response.ok) {
					statusSnackbar(response.code, setSnackbar);
					console.error('registrationProforg:', response)
					throw Error(response.statusText);
				}
				return response.json();				
			})
			.then((data) => {
				// console.log(data);
				setTokens(data);
			},
				(error) => {
					statusSnackbar(0, setSnackbar)
					console.error('registrationProforg:', error)
				})
	}

	function add_registrationProforg(proforg_level) {
		var url = main_url + "profkom_bot/add_registrationProforg/";

		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				querys: window.location.search,
				proforg_level: proforg_level,
			}),
			headers: {
				'Origin': origin
			}
		})
			.then(function(response) {
				if (!response.ok) {
					statusSnackbar(response.code, setSnackbar);
					console.error('add_registrationProforg:', response)
					throw Error(response.statusText);
				}
				return response.json();				
			})
			.then((data) => {
				// console.log(data);
				data.proforg_level = proforg_level;
				var temp = JSON.parse(JSON.stringify(tokens));
				temp.push(data);
				setTokens(temp);
			},
				(error) => {
					statusSnackbar(0, setSnackbar)
					console.error('add_registrationProforg:', error)
				})
	}

	function delete_registrationProforg(token, i) {
		var url = main_url + "profkom_bot/delete_registrationProforg/";

		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				querys: window.location.search,
				token: token,
			}),
			headers: {
				'Origin': origin
			}
		})
			.then(function(response) {
				if (!response.ok) {
					statusSnackbar(response.code, setSnackbar);
					console.error('delete_registrationProforg:', response)
					throw Error(response.statusText);
				}
				return response.json();				
			})
			.then((data) => {
				// console.log(data);
				var temp = JSON.parse(JSON.stringify(tokens));
				temp.splice(i, 1);
				setTokens(temp);
			},
				(error) => {
					statusSnackbar(0, setSnackbar)
					console.error('delete_registrationProforg:', error)
				})
	}

	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderBack onClick={goBack} />}
			>Приглашения</PanelHeader>
			<Group>
					<Header
						mode="secondary"
						indicator={tokens.length > 0 && <Counter>{tokens.length}</Counter>}
					aside={
						<div className="Tabbar Tabbar--l-vertical" style={{ position: "static" }}>
							<TabbarItem
								style={{ paddingRight: 8 }}
								onClick={() => add_registrationProforg(1)}
								selected={true}
								text="Профорг"
							><Icon28AddOutline /></TabbarItem>
							<TabbarItem
								style={{ paddingRight: 8 }}
								onClick={() => add_registrationProforg(2)}
								selected={true}
								text="Дежурный"
							><Icon28AddOutline /></TabbarItem>
							<TabbarItem
								style={{ paddingRight: 8 }}
								onClick={() => add_registrationProforg(3)}
								selected={true}
								text="Председатель"
							><Icon28AddOutline /></TabbarItem>
						</div>}
					>Приглашения</Header>
					{tokens.map((post, i) =>
						(<Group key={i}>
							<Cell
								size="l"
								asideContent={
									<div style={{ display: 'flex' }}>
										{/* <Icon28QrCodeOutline
											name="QR"
											style={{ color: 'var(--accent)' }}
											onClick={() =>
												bridge.send("VKWebAppCopyText",
													{ "text": `https://vk.com/app7446946#registrationProforg=${post.token}` })
											}
										/>	 */}
										<Icon28ShareOutline
											name="share"
											style={{ color: 'var(--accent)', marginLeft: 8 }}
											onClick={() =>
											// bridge.send("VKWebAppCopyText", {"text": `https://vk.com/app7446946#registrationProforg=${post.token}`})
											{
												if (platform === "mobile_android" || platform === "mobile_iphone")
													bridge.send("VKWebAppShare",
														{ "link": `https://vk.com/app7446946#registrationProforg=${post.token}` })
												else
													bridge.send("VKWebAppCopyText",
														{ "text": `https://vk.com/app7446946#registrationProforg=${post.token}` })
											}
											}
										/>
										<Icon28DeleteOutline
											name="delete"
											style={{ color: 'var(--destructive)', marginLeft: 8 }}
											onClick={() => delete_registrationProforg(post.token, i)}
										/>
									</div>
								}
								bottomContent={
									<HorizontalScroll>
										<div style={{ display: 'flex' }}>
											<Button size="m" mode="outline" >{proforg_levels[post.proforg_level]}</Button>
											<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{post.surname_and_initials}</Button>
											<Button size="m" mode="outline" style={{ marginLeft: 8 }}>{new Date(post.date_create).toLocaleString()}</Button>
										</div>
									</HorizontalScroll>}
							/>
						</Group>))}
				</Group>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
