import React, { useState, useEffect } from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';

import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';

import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import Checkbox from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Footer from '@vkontakte/vkui/dist/components/Footer/Footer';

const App = ({ id, go, goBack,
	categories, snackbar,
	setMailingCategories, mailingCategories,
	payouts_type, payouts_types,
}) => {

	const [checked, setChecked] = useState(false);
	const [payouts_types_categories, set_payouts_types_categories] = useState([]);

	useEffect(() => {
		if (payouts_type.length > 0) {
			var n = 0;
			for (var i in payouts_types) {
				if (payouts_types[i].payout_type === payouts_type) n = i;
			}
			set_payouts_types_categories(payouts_types[n].categories)
		} else {
			set_payouts_types_categories(categories)
		}
		// onLoadCategory();
	});

	function getChecked() {
		var temp = [];
		var categorys = document.getElementsByName("category");
		for (var i = 0; i < categorys.length; i++) {
			if (categorys[i].checked) {
				temp.push(payouts_types_categories[i]);
			}
		}
		setChecked(temp);
		return temp;
	}

	function clickAll() {
		var temp = getChecked();
		var categorys = document.getElementsByName("category");

		if (temp.length === payouts_types_categories.length) {
			for (var i = 0; i < categorys.length; i++) {
				categorys[i].checked = false;
			}
		} else {
			for (i = 0; i < categorys.length; i++) {
				categorys[i].checked = true;
			}
		}
	}

	// function onLoadCategory() {
	// 	if (checked) return;
	// 	setChecked(true);

	// 	var categorys = document.getElementsByName("category");
	// 	console.log(categorys, payouts_types_categories, categorys.length)

	// 	for (var i = 0; i < categorys.length; i++) {
	// 		categorys[i].checked = mailingCategories.indexOf(payouts_types_categories[i]) !== -1
	// 	}
	// 	if (mailingCategories.indexOf("Студентам без категорий") > -1){
	// 		document.getElementById("without").checked = true;
	// 	}
	// }

	function btnClck() {
		var temp = [];
		var categorys = document.getElementsByName("category");
		for (var i = 0; i < categorys.length; i++) {
			if (categorys[i].checked) {
				temp.push(payouts_types_categories[i]);
			}
		}
		if (document.getElementById("without").checked) {
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

				<Separator />
				<FormLayoutGroup top="Выберите подходящие категории">
					{payouts_types_categories.map((category, i) => (
						<Checkbox name="category" key={i} id={i.toString()} defaultChecked={mailingCategories.indexOf(payouts_types_categories[i]) !== -1}>{category}</Checkbox>
					))}
					{(payouts_types_categories.length === 0) &&
						<Footer>Нет категорий, удовлетворяющих условию</Footer>}
				</FormLayoutGroup>

				<Button size="xl" onClick={btnClck}>Подтвердить</Button>
			</FormLayout>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
