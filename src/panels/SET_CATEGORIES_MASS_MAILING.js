import React, { useState, useEffect } from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';

import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';

import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import Checkbox from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';
import Button from '@vkontakte/vkui/dist/components/Button/Button';

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

		if (temp.length === categories.length) {
			for (var i = 0; i < categorys.length; i++) {
				categorys[i].checked = false;
			}
		}else{
			for (i = 0; i < categorys.length; i++) {
				categorys[i].checked = true;
			}
		}
	}
	
	function onLoadCategory() {
		if (checked) return;
		setChecked(true);

		var categorys = document.getElementsByName("category");
		for (var i = 0; i < categorys.length; i++) {
			categorys[i].checked = mailingCategories.indexOf(categories[i]) !== -1
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
