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

import { statusSnackbar } from './style';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Checkbox from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';
import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';
import Footer from '@vkontakte/vkui/dist/components/Footer/Footer';

var origin = "https://thingworx.asuscomm.com:10888"
var main_url = "https://profkom-bot-bmstu.herokuapp.com/"
// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = ({ id, go, goBack,
	snackbar, setSnackbar, setPopout,
	mailingCategories, setMailingCategories,
	messageValue, setMessageValue,
	payments_edu, setPayments_edu,
	group, setGroup,
	countAttachments, setCountAttachments,
	attachments, setAttachments,
	Attachments, queryParams,
	payouts_types,
	payouts_type, set_payouts_type,
	tabsState, setTabsState,
}) => {

	const [countSenders, setCountSenders] = useState([,]);
	const tabsStates = [
		'all',
		'submit',
		'not_submit',
	]
	useEffect(() => {
		if (countSenders.length === 1)
			mass_mailing_count();
		if (tabsStates.indexOf(tabsState) === -1)
			setTabsState('all');
	});

	function on_btn_click() {
		test_message();
		setPopout(<Alert
			actionsLayout="vertical"
			actions={[{
				title: 'Разослать',
				autoclose: true,
				mode: 'destructive',
				action: () => {
					send_mass_mailing();
				},
			}, {
				title: 'Отмена',
				autoclose: true,
				mode: 'cancel'
			}]}
			onClose={() => setPopout(null)}
		>
			<h2>Подтвердите отправку</h2>
			<p>Вы уверены, что хотите разослать сообщение? Сначала проверьте тестовое сообщение!</p>
		</Alert>)
	}

	async function send_mass_mailing() {
		var url = main_url + "profkom_bot/mass_mailing";

		var data = {
			querys: window.location.search,
			message: messageValue,
		}
		if (mailingCategories.length > 0) data.mailingCategories = mailingCategories;
		if (payments_edu) data.payments_edu = payments_edu;
		if (group) data.group = group;
		if (countAttachments > 0) data.attachment = attachments.join();
		if (payouts_type.length > 0) data.payouts_type = payouts_type;

		var agree = document.getElementById("agree");
		data.agree = agree.checked
		
		console.log(data)
		try {
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Origin': origin
				}
			});
			// const json = await response.json();
			if (response.ok) {
				statusSnackbar(200, setSnackbar);
				setMessageValue();
				setCountAttachments(0);
				setAttachments([]);
				setMailingCategories([]);
				setPayments_edu();
				setGroup();
				setTabsState("students");
				goBack();
			} else {
				statusSnackbar(response.status, setSnackbar);
				console.error('send_mass_mailing:', data);
			}
		} catch (error) {
			setPopout(null);
			statusSnackbar(0, setSnackbar);
			console.error('send_mass_mailing:', error);
		}
	}

	async function test_message() {
		var url = main_url + "profkom_bot/test_message";

		var data = {
			querys: window.location.search,
			message: messageValue,
			user_id: queryParams.vk_user_id,
		}

		if (countAttachments > 0)
			data.attachment = attachments.join();

		try {
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Origin': origin
				}
			});
			// const json = await response.json();
			if (response.ok) {
				statusSnackbar(200, setSnackbar);
			} else {
				statusSnackbar(response.status, setSnackbar);
				console.error('MASS_MAILING test_message:', data);
			}
		} catch (error) {
			setPopout(null);
			statusSnackbar(0, setSnackbar);
			console.error('MASS_MAILING test_message:', error);
		}
	}

	async function mass_mailing_count(name, value) {
		var url = main_url + "profkom_bot/mass_mailing_count";

		var data = {
			querys: window.location.search,
			message: messageValue,
		}
		if (mailingCategories.length > 0 && name !== "mailingCategories") data.mailingCategories = mailingCategories;
		if (payments_edu && name !== "payments_edu") data.payments_edu = payments_edu;
		if (group && name !== "group") data.group = group;
		if (countAttachments > 0 && name !== "countAttachments") data.attachment = attachments.join();
		if (payouts_type.length > 0 && name !== "payouts_type") data.payouts_type = payouts_type;

		var agree = document.getElementById("agree");
		data.agree = agree.checked

		if (name && value && value.length > 0) {
			data[name] = value;
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
			const json = await response.json();
			if (response.ok) {
				console.log(json)
				setCountSenders(json);
			} else {
				statusSnackbar(response.status, setSnackbar);
				console.error('mass_mailing_count:', data);
			}
		} catch (error) {
			setPopout(null);
			statusSnackbar(0, setSnackbar);
			console.error('mass_mailing_count:', error);
		}
	}


	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderBack onClick={goBack} />}
			>Массовая рассылка</PanelHeader>

			<Div style={{ paddingBottom: 60 }}>
				<FormLayout>
					<Textarea
						top="Текст сообщения"
						id="text"
						onChange={(e) => {
							const { value } = e.currentTarget;
							setMessageValue(value);
						}}
						defaultValue={messageValue}
					/>
					<Attachments />

					<Separator />
					<Select
						top="Тип заявление"
						placeholder="Выберите тип заявление"
						bottom="При изменении типа заявления категории сбрасываются"
						onChange={(e) => {
							const { value } = e.currentTarget;
							set_payouts_type(value);
							var temp = [];
							setMailingCategories([]);
							mass_mailing_count('payouts_type', value);
						}}
						defaultValue={payouts_type}
					>
						{payouts_types.map((payouts_type, i) => (
							<option
								key={payouts_type.payout_type}
								value={payouts_type.payout_type}
								id={payouts_type.payout_type}
							>{payouts_type.payout_type}</option>
						))}
					</Select>
					{payouts_type.length > 0 &&
						<>
							<Tabs mode="buttons">
								<TabsItem
									onClick={() => {
										setTabsState('all');
									}}
									selected={tabsState === 'all'}
								>Всем</TabsItem>
								<TabsItem
									onClick={() => {
										setTabsState('submit');
									}}
									selected={tabsState === 'submit'}
								>Кто подал</TabsItem>
								<TabsItem
									onClick={() => {
										setTabsState('not_submit');
									}}
									selected={tabsState === 'not_submit'}
								>Кто НЕ подал</TabsItem>
							</Tabs>
							<Footer>Заявление подало {countSenders[1]} из {countSenders[0]} (с учетом других фильтров)</Footer>
						</>}
					<Separator />

					<SimpleCell
						expandable
						onClick={() => go('SET_CATEGORIES_MASS_MAILING')}
						bottom="У студента есть хоть одна выбранная категория (не забудьте подтвердить выбор)"
						indicator={mailingCategories && mailingCategories.length > 0 && <Counter>{mailingCategories.length}</Counter>}
					>Выбор категорий</SimpleCell>

					<Separator />

					<Select
						top="Форма обучения"
						placeholder="Не учитывать форму обучения"
						id='payments_edu'
						name="payments_edu"
						onChange={(e) => {
							const { value } = e.currentTarget;
							setPayments_edu(value);
							mass_mailing_count('payments_edu', value);
						}}
						defaultValue={String(payments_edu)}
					>
						<option value="free" id="select_free">Бюджетная</option>
						<option value="paid" id="select_paid">Платная</option>
					</Select>

					<Input
						type="text"
						top="Префикс группы"
						name="group"
						id="group"
						bottom='Можно использовать для факультетов, кафедр, потоков или групп, пример: "ИУ", "ИУ7", "ИУ7-2", "ИУ7-21Б"'
						onChange={(e) => {
							const { value } = e.currentTarget;
							setGroup(value);
							mass_mailing_count("group", value);
						}}
						defaultValue={group}
					/>
					<Checkbox id="agree" onClick={mass_mailing_count}>Отправить только тем, кто дал согласие на рассылку</Checkbox>

				</FormLayout>
			</Div>
			<FixedLayout vertical="bottom" filled>
				<FormLayout>
					<Button
						size="xl"
						disabled={!messageValue}
						onClick={on_btn_click}
						after={<Counter>{countSenders[0]}</Counter>}
					>Отправить</Button>
				</FormLayout>
			</FixedLayout>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
