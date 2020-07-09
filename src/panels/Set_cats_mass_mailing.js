import { parsePhoneNumberFromString } from 'libphonenumber-js'
import React, { useState, useEffect } from 'react';
import PropTypes, { func } from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';

import Select from '@vkontakte/vkui/dist/components/Select/Select';
// import Radio from '@vkontakte/vkui/dist/components/Radio/Radio';
// import Textarea from '@vkontakte/vkui/dist/components/Textarea/Textarea';
import Checkbox from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';
import Link from '@vkontakte/vkui/dist/components/Link/Link';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';
import Icon16Done from '@vkontakte/icons/dist/16/done';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';

import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import InfoRow from '@vkontakte/vkui/dist/components/InfoRow/InfoRow';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';
import Radio from '@vkontakte/vkui/dist/components/Radio/Radio';

import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import PanelHeaderClose from '@vkontakte/vkui/dist/components/PanelHeaderClose/PanelHeaderClose';
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';
import Icon24Error from '@vkontakte/icons/dist/24/error';

import bridge from '@vkontakte/vk-bridge';

import { redIcon, blueIcon, orangeBackground, blueBackground, redBackground } from './style';

const check_valid = false;
const show_valid = true;

const contacts_bottom = "Почта и телефон не являются обязательными, но при наличии ошибок в документах и необходимости связаться с Вами мы сможем это сделать проще и быстрее, что упростит получение Вами вышей выплаты";

var origin = "https://thingworx.asuscomm.com:10888/";
var main_url = "https://profkom-bot-bmstu.herokuapp.com/";
// var main_url = "http://thingworx.asuscomm.com/";
// var main_url = "http://localhost:8000/";

const App = ({id, go, goBack,
	categories, snackbar,
	setMailingCategories, mailingCategories,
}) => {

	const [checked, setChecked] = useState(false);

	useEffect(() => {
		onLoadCategory();
	});

	function getChecked(){
		var temp = [];
		var categorys = document.getElementsByName("category");
		for (var i = 0; i < categorys.length; i++) {
			if (categorys[i].checked) {
				temp.push(categories[i]);
			}
		}
		setChecked(temp);
		return temp;
	}

	function clickAll(){
		var temp = getChecked();
		var categorys = document.getElementsByName("category");

		if (temp.length == categories.length) {
			for (var i = 0; i < categorys.length; i++) {
				categorys[i].checked = false;
			}
		}else{
			for (var i = 0; i < categorys.length; i++) {
				categorys[i].checked = true;
			}
		}
	}
	
	function onLoadCategory() {
		if (checked) return;
		setChecked(true);

		var categorys = document.getElementsByName("category");
		for (var i = 0; i < categorys.length; i++) {
			categorys[i].checked = mailingCategories.indexOf(categories[i]) != -1
		}
		if (mailingCategories.indexOf("Студентам без категорий") > -1){
			document.getElementById("without").checked = true;
		}
	}
	
	function btnClck(){
		var temp = [];
		var categorys = document.getElementsByName("category");
		for (var i = 0; i < categorys.length; i++) {
			if (categorys[i].checked) {
				temp.push(categories[i]);
			}
		}
		if (document.getElementById("without").checked){
			temp.push('Студентам без категорий')
		}
		setMailingCategories(temp);
		goBack();
	}

	const Home =
		<Panel id={id}>
			<PanelHeader
				left={<PanelHeaderBack onClick={goBack} />}
			>Выбор категорий</PanelHeader>
			<FormLayout>
				<Button name="all" onClick={clickAll}>Выбрать все</Button>
				<Checkbox name="without" id="without">Студентам без категорий</Checkbox>

				<Separator/>
				<FormLayoutGroup top="Выберите подходящие категории">
					{categories.map((category, i) => (
						<Checkbox name="category" key={i} id={i.toString()}>{category}</Checkbox>
					))}
				</FormLayoutGroup>

				<Button size="xl" onClick={btnClck}>Подтвердить</Button>
			</FormLayout>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
