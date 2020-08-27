import React, { useState, useEffect } from 'react';

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

const App = ({ id, go, goBack,
	main_url, origin,
	snackbar, setSnackbar, setPopout,
	payments_edu, setPayments_edu,
	group, setGroup,
	payouts_types,
	payouts_type, set_payouts_type,
	categories, queryParams,
	proforg, proforgsInfo,
}) => {

	const [category, set_category] = useState();
	const [status, set_status] = useState('all');
	const tabsStates = [
		'all',
		'submit',
		'not_submit',
	]
	useEffect(() => {
	}, []);

	async function download_contributions(method) {
		setPopout(<ScreenSpinner />)
		var url = main_url + "profkom_bot/download_contributions";
		var data = {
			querys: window.location.search,
			method: method,
			group: document.getElementById("download_contributions_input").value,
		}
		var group = document.getElementById("download_contributions_input").value
		if (group.length > 0){
			data.group = group;
		}else{
			group = proforgsInfo.group
		}

		console.log(data)
		try {
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Origin': origin
				}
			});
			if(!response.ok){
				statusSnackbar(response.status, setSnackbar);
				setPopout(null);
				return;
			}
			const reader = response.body.getReader();
			const contentLength = +response.headers.get('Content-Length');
			let receivedLength = 0;
			let chunks = [];
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					break;
				}

				chunks.push(value);
				receivedLength += value.length;

			}
			setPopout(null);
			let chunksAll = new Uint8Array(receivedLength);
			let position = 0;
			for (let chunk of chunks) {
				chunksAll.set(chunk, position);
				position += chunk.length;
			}
			let blob = new Blob([chunksAll]);
			let result = new TextDecoder("utf-8").decode(chunksAll);
			if (result === "Success") return;
			// let blob = new Blob([result], { type: "application/vnd.ms-excel" });
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = `Профвзнос ${group}.xlsx`;
			link.click();
		} catch (error) {
			setPopout(null);
			statusSnackbar(0, setSnackbar);
			console.error('download_csv:', error);
		}
	}


	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderBack onClick={goBack} />}
			>Бланки</PanelHeader>
			{/* <Group header={<Header mode="secondary">Бланк на профвзносы</Header>}>
				{queryParams.vk_platform.indexOf("mobile") > -1 ?
					<Div style={{ display: 'flex' }}>
						<Input
							id="download_contributions_input"
							placeholder="Введите название группы"
						// onClick={() => download_contributions('send')}
						/>
						<Button
							size="xl" style={{ marginLeft: 8 }}
							onClick={() => download_contributions('send')}
							after={< Icon24Send />}
						>Отправить себе</Button>
					</Div>
					: <Div style={{ display: 'flex' }}>
						<Input
							id="download_contributions_input"
							placeholder="Введите название группы"
						// onClick={() => download_contributions('send')}
						/>
						<Button
							size="l"
							stretched style={{ marginRight: 8, marginLeft: 8 }}
							onClick={() => download_contributions('send')}
							after={< Icon24Send />}
						>Отправить себе</Button>
						<Button
							size="l"
							stretched
							onClick={() => download_contributions('download')}
							after={< Icon24Download />}
						>Скачать</Button>
					</Div>}
			</Group> */}
			<Group header={<Header mode="secondary">Бланк на профвзносы</Header>}>
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
				{queryParams.vk_platform.indexOf("mobile") > -1 ?
					<Div style={{ display: 'flex' }}>
						<Button
							size="xl"
							onClick={() => download_contributions('send')}
							after={< Icon24Send />}
						>Отправить себе</Button>
					</Div>
					: <Div style={{ display: 'flex' }}>
						<Button
							size="l"
							stretched style={{ marginRight: 8 }}
							onClick={() => download_contributions('send')}
							after={< Icon24Send />}
						>Отправить себе</Button>
						<Button
							size="l"
							stretched
							onClick={() => download_contributions('download')}
							after={< Icon24Download />}
						>Скачать</Button>
					</Div>}
			</Group>
			<Group header={<Header mode="secondary">Бланк на все виды выплат</Header>}>
			<FormLayout>
				<FormStatus header="Скоро">
				В ближайшей перспективе
				</FormStatus>
			</FormLayout>
			{/* {queryParams.vk_platform.indexOf("mobile") > -1 ?
					<Div>
						<Button
							size="xl"
							onClick={() => download_csv('send')}
							after={< Icon24Send />}
						>Отправить себе</Button>
					</Div>
					: <Div style={{ display: 'flex' }}>
						<Button
							size="l"
							stretched style={{ marginRight: 8 }}
							onClick={() => download_csv('send')}
							after={< Icon24Send />}
						>Отправить себе</Button>
						<Button
							size="l"
							stretched
							onClick={() => download_csv('download')}
							after={< Icon24Download />}
						>Скачать</Button>
					</Div>} */}
			</Group>
			<Group header={<Header mode="secondary">Остальные заявления</Header>}>
				<FormLayout>
					<FormStatus header="Скоро">
					В ближайшей перспективе
					</FormStatus>
				</FormLayout>
			
			{/* <SimpleCell
					onClick={() => {
						window.open('https://vk.com/doc159317010_565524800?hash=3b4f2cb0344002ed4d&dl=FUYTSNJYHA4DINBY:1598412251:975180126586b2e39d&api=1&no_preview=1');
					}}
				>Скачать!</SimpleCell>
				<SimpleCell
					onClick={() => {
						window.open('https://profkom-bot-bmstu.herokuapp.com/profkom_bot/download_csv');
					}}
				>Скачать!</SimpleCell> */}
			</Group>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
