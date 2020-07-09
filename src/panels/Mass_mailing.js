import React, { useState, useEffect } from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';

import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Counter from '@vkontakte/vkui/dist/components/Counter/Counter';

import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Select from '@vkontakte/vkui/dist/components/Select/Select';
import Textarea from '@vkontakte/vkui/dist/components/Textarea/Textarea';

import { redIcon, blueIcon, orangeBackground, blueBackground, redBackground } from './style';

var origin = "https://thingworx.asuscomm.com:10888"
var main_url = "https://profkom-bot-bmstu.herokuapp.com/"
// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = ({ id, go, goBack, 
	snackbar,
	mailingCategories, setMailingCategories,
	messageValue, setMessageValue,
	payments_edu, setPayments_edu,
}) => {
	
	const [countAttachments, setCountAttachments] = useState(1);

	useEffect(() => {
	});

	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderBack onClick={goBack} />}
			>Массовая рассылка</PanelHeader>

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

				{/* <Separator /> */}
				<SimpleCell
					expandable
					onClick={() => go('Set_cats_mass_mailing')}
					description="Не забудьте подтвердить выбор"
					indicator={mailingCategories && mailingCategories.length > 0 && <Counter>{mailingCategories.length}</Counter>}
				>Выбор категорий
				</SimpleCell>
				{/* <Separator /> */}

				<Select
					top="Форма обучения"
					placeholder="Не учитывать форму обучения"
					id='payments_edu'
					name="payments_edu"
					onChange={(e) => {
						const { value } = e.currentTarget;
						setPayments_edu(value);
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
					// onClick={onEmailClick}
					// onChange={(e) => {
					// 	const { value } = e.currentTarget;
					// 	setEmail(value.slice(0, 100));
					// }}
					// value={email}
				/>

			</FormLayout>
			<FixedLayout vertical="bottom" filled>
				<FormLayout>
					<Button 
						size="xl" 
						disabled={!messageValue}
					>Отправить</Button>
				</FormLayout>
			</FixedLayout>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
