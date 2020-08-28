import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';

import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Counter from '@vkontakte/vkui/dist/components/Counter/Counter';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';

import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Select from '@vkontakte/vkui/dist/components/Select/Select';
import Textarea from '@vkontakte/vkui/dist/components/Textarea/Textarea';
import Alert from '@vkontakte/vkui/dist/components/Alert/Alert';

import { statusSnackbar, blueIcon } from './style';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Checkbox from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';
import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';
import Footer from '@vkontakte/vkui/dist/components/Footer/Footer';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';

import Icon28MessagesOutline from '@vkontakte/icons/dist/28/messages_outline';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';
import Icon24Education from '@vkontakte/icons/dist/24/education';
import Icon28TagOutline from '@vkontakte/icons/dist/28/tag_outline';
import Icon28EmployeeOutline from '@vkontakte/icons/dist/28/employee_outline';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Icon24Download from '@vkontakte/icons/dist/24/download';
import Icon24Send from '@vkontakte/icons/dist/24/send';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import FormStatus from '@vkontakte/vkui/dist/components/FormStatus/FormStatus';
import List from '@vkontakte/vkui/dist/components/List/List';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';

import Icon24Chevron from '@vkontakte/icons/dist/24/chevron';

const App = ({ id, go, goBack,
	main_url, origin,
	snackbar, setSnackbar, setPopout,
	group,
	queryParams,
	proforg, proforgsInfo,
	can_AppDownloadFile,
}) => {
	const [this_mobile, set_this_mobile] = useState(queryParams.vk_platform.indexOf("mobile") > -1);

	useEffect(() => {
	}, []);

	async function send_contributions() {
		setPopout(<ScreenSpinner />)
		var url = `${main_url}profkom_bot/download_contributions${window.location.search}&method=send`;

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Origin': origin
				}
			});
			setPopout(null);
			// const json = await response.json();
			if (response.ok) {
				console.log('download_contributions: Success');
				// statusSnackbar(200, setSnackbar);
			} else {
				console.error('download_contributions');
			}
		} catch (error) {
			setPopout(null);
			statusSnackbar(0, setSnackbar);
			console.error('download_contributions:', error);
		}
	}

	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderBack onClick={goBack} />}
			>Бланки</PanelHeader>
			<Group
				header={<Header mode="secondary">Бланк на профвзносы</Header>}
				description={(this_mobile && !can_AppDownloadFile &&
					queryParams.vk_platform === "mobile_android")
					? "Для загрузки документов обновите клиент ВК" : ""}
			>
				<FormLayout>

					<Input
						id="download_contributions_input"
						top="Введите название группы"
						placeholder="Введите название группы"
						defaultValue={proforg === 1 ? proforgsInfo.group : ""}
						readOnly={proforg === 1}
					// onClick={() => download_contributions('send')}
					/>
				</FormLayout>
				<Div style={{ display: 'flex' }} >
					<Button
						size="l"
						stretched style={{ marginRight: 8 }}
						onClick={send_contributions}
						after={< Icon24Send />}
					>Отправить себе</Button>
					<Button
						size="l"
						stretched
						disabled={(this_mobile && !can_AppDownloadFile)}
						onClick={() => {
							if (this_mobile) {
								bridge.send("VKWebAppDownloadFile",
									{
										"url": `${main_url}profkom_bot/download_contributions${window.location.search}`,
										"filename": "Профвзносы.xlsx"
									});
							} else {
								var link = document.createElement('a');
								link.href = `${main_url}profkom_bot/download_contributions${window.location.search}`;
								link.download = `Профвзнос ${group}.xlsx`;
								link.click();
							}
						}}
						after={< Icon24Download />}
					>Скачать</Button>
				</Div>
			</Group>


			{/* <Group header={<Header mode="secondary">Бланк на все виды выплат</Header>}>
				<FormLayout>
					<FormStatus header="Скоро">
						В ближайшей перспективе
					</FormStatus>
				</FormLayout>
			</Group> */}
			<Group header={<Header mode="secondary">Остальные бланки</Header>}>
				<List>
					<SimpleCell
						after={ < Icon24Chevron /> }
						onClick={() => {
							window.open("https:\/\/vk.com\/doc159317010_565926376?hash=76f0bd78ae5516916e&dl=FUYTSNJYHA4DINBY:1598634694:966ebe7f6af14f7462&api=1&no_preview=1");
							// bridge.send("VKWebAppDownloadFile", { "url": `${main_url}profkom_bot/download_contributions${window.location.search}`, "filename": "Профвзносы.xlsx" });
						}}
					>Бланк на все виды выплат</SimpleCell>
					<SimpleCell
						after={ < Icon24Chevron /> }
						onClick={() => {
							window.open("https://vk.com/doc6162384_439876627");
							// bridge.send("VKWebAppDownloadFile", { "url": `${main_url}profkom_bot/download_contributions${window.location.search}`, "filename": "Профвзносы.xlsx" });
						}}
					>Заявление на мат. помощь мэрии Москвы</SimpleCell>
				</List>
				<FormLayout>
					<FormStatus header="Скоро">
						Скоро будут еще различные бланки
					</FormStatus>
				</FormLayout>
			</Group>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
