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

import Icon28MessagesOutline from '@vkontakte/icons/dist/28/messages_outline';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';
import Icon24Education from '@vkontakte/icons/dist/24/education';
import Icon28TagOutline from '@vkontakte/icons/dist/28/tag_outline';
import Icon28EmployeeOutline from '@vkontakte/icons/dist/28/employee_outline';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Icon24Download from '@vkontakte/icons/dist/24/download';
import Icon24Send from '@vkontakte/icons/dist/24/send';

const App = ({ id, go, goBack,
	main_url, origin,
	snackbar, setSnackbar, setPopout,
	payments_edu, setPayments_edu,
	group, setGroup,
	payouts_types,
	payouts_type, set_payouts_type,
	categories, queryParams,
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

	async function download_csv(method) {
		var url = main_url + "profkom_bot/download_csv";


		var data = {
			querys: window.location.search,
			method: method,
			status: status,
		}
		if (category) data.category = category;
		if (payments_edu) data.payments_edu = payments_edu;
		if (group) data.group = group;
		if (payouts_type.length > 0) data.payouts_type = payouts_type;
		// console.log(data)
		try {
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Origin': origin
				}
			});
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
			let chunksAll = new Uint8Array(receivedLength);
			let position = 0;
			for (let chunk of chunks) {
				chunksAll.set(chunk, position);
				position += chunk.length;
			}
			let result = new TextDecoder("utf-8").decode(chunksAll);
			result = "\ufeff" + result
			let blob = new Blob([result], { encoding: "UTF-8", type: "text/csv;charset=UTF-8" });
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'Отчет.csv';
			link.click();

		} catch (error) {
			setPopout(null);
			statusSnackbar(0, setSnackbar);
			console.error('download_csv:', error);
		}
	}

	function Draw_div(node, icon = undefined, top = undefined, bottom = undefined) {
		return (<Div
			style={{
				display: "flex", alignItems: "center",
				paddingLeft: 12, paddingTop: 8, paddingBottom: 8, paddingRight: 12
			}}
		>
			<Div style={{ display: "block", flexShrink: 0, paddingRight: 12, paddingLeft: 4 }}>
				{icon}
			</Div>
			<Div style={{ display: "block", flexGrow: 1, flexShrink: 1, padding: 0 }}>
				<Header mode="secondary" >{top}</Header>
				{node}
				<div className="SimpleCell__description" style={{ marginLeft: 12, marginRight: 12 }} >
					{bottom}
				</div>
			</Div>
		</Div>)
	}

	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderBack onClick={goBack} />}
			>Отчеты</PanelHeader>
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
			<FormLayout>
				<Select
					top="Тип заявление"
					placeholder="По всем заявлениям"
					onChange={(e) => {
						const { value } = e.currentTarget;
						set_payouts_type(value);
					}}
				>
					{payouts_types.map((payouts_type, i) => (
						<option
							key={payouts_type.payout_type}
							value={payouts_type.payout_type}
							id={payouts_type.payout_type}
						>{payouts_type.payout_type}</option>
					))}
				</Select>
			</FormLayout>
			<Tabs mode="buttons">
				<TabsItem
					onClick={() => {
						set_status('all');
					}}
					selected={status === 'all'}
				>Все</TabsItem>
				<TabsItem
					onClick={() => {
						set_status('filed');
					}}
					selected={status === 'filed'}
				>Подано</TabsItem>
				<TabsItem
					onClick={() => {
						set_status('accepted');
					}}
					selected={status === 'accepted'}
				>Принята</TabsItem>
				<TabsItem
					onClick={() => {
						set_status('err');
					}}
					selected={status === 'err'}
				>Ошибка в документах</TabsItem>
			</Tabs>

			{Draw_div(
				<Select
					placeholder=""
					id='category'
					name="category"
					placeholder="По всем причинам"
					onChange={(e) => {
						const { value } = e.currentTarget;
						set_category(value);
					}}
				>
					{categories.map((category, i) => (
						<option
							key={category}
							value={category}
							id={category}
						>{category}</option>
					))}
				</Select>,
				<Icon28ListOutline style={blueIcon} size={28} />,
				"Выбор причины",
			)}


			{Draw_div(
				<Select
					placeholder="Не учитывать форму обучения"
					id='payments_edu'
					name="payments_edu"
					onChange={(e) => {
						const { value } = e.currentTarget;
						setPayments_edu(value);
					}}
				>
					<option value="free" id="select_free">Бюджетная</option>
					<option value="paid" id="select_paid">Платная</option>
				</Select>,
				<Icon24Education style={blueIcon} size={28} />,
				"Форма обучения",
			)}

			{Draw_div(
				<Input
					type="text"
					name="group"
					id="group"
					onChange={(e) => {
						const { value } = e.currentTarget;
						setGroup(value);
					}}
					defaultValue={group}
				/>,
				<Icon28TagOutline style={blueIcon} />,
				"Префикс группы",
				'Можно использовать для факультетов, кафедр, потоков или групп, пример: "ИУ", "ИУ7", "ИУ7-2", "ИУ7-21Б"',
			)}
			<FixedLayout vertical="bottom" filled>

				{queryParams.vk_platform.indexOf("mobile") > -1 ?
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
					</Div>}
			</FixedLayout>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
