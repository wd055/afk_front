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

import Icon28EditOutline from '@vkontakte/icons/dist/28/edit_outline';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';

import { statusSnackbar } from './style';
import CellButton from '@vkontakte/vkui/dist/components/CellButton/CellButton';

var origin = "https://thingworx.asuscomm.com:10888"
var main_url = "https://profkom-bot-bmstu.herokuapp.com/"
// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = ({ id, go, goBack,
	snackbar, setSnackbar, setPopout,
	messageValue, setMessageValue,
	countAttachments, setCountAttachments,
	attachments, setAttachments,
	Attachments, queryParams,
	modalData, setStudents
}) => {

	const [countSenders, setCountSenders] = useState();

	useEffect(() => {
		console.log(modalData, modalData.message);
		setMessageValue(modalData.message);
		var attachments_arr = modalData.attachment.split(',');
		console.log(attachments_arr)
		if (attachments_arr.length === 1 && attachments_arr[0] === "")
			attachments_arr = []
		setAttachments(attachments_arr);
		setCountAttachments(attachments_arr.length)
	}, [modalData]);

	async function edit_message(delet) {
		var url = main_url + "profkom_bot/edit_message";

		var data = {
			querys: window.location.search,
			message: messageValue,
			random_id:modalData.random_id,
			delete:delet,
		}
		if (countAttachments > 0)
			data.attachment = attachments.join();

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
				setStudents([]);
				goBack();
			} else {
				statusSnackbar(response.status, setSnackbar);
				console.error('edit_message:', data);
			}
		} catch (error) {
			setPopout(null);
			statusSnackbar(0, setSnackbar);
			console.error('edit_message:', error);
		}
	}


	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderBack onClick={goBack} />}
			>Редактирование рассылки</PanelHeader>

			<FormLayout>
				<Textarea
					top="Текст сообщения"
					id="text"
					onChange={(e) => {
						const { value } = e.currentTarget;
						setMessageValue(value);
					}}
					defaultValue={modalData.message}
				/>
				<Attachments />
			</FormLayout>
			<FixedLayout vertical="bottom" filled>
				<FormLayout>
					<CellButton
						mode="danger"
						before={<Icon28DeleteOutline />}
						onClick={() => setPopout(<Alert
							actionsLayout="vertical"
							actions={[{
								title: 'Удалить',
								autoclose: true,
								mode: 'destructive',
								action: () => {
									edit_message(true);
								},
							}, {
								title: 'Отмена',
								autoclose: true,
								mode: 'cancel'
							}]}
							onClose={() => setPopout(null)}
						>
							<h2>Подтвердите действие</h2>
							<p>Вы уверены, что хотите удалить сообщения?</p>
						</Alert>)}
					>Удалить сообщения
							</CellButton>
					<CellButton
						disabled={!messageValue}
						before={<Icon28EditOutline />}
						onClick={() => setPopout(<Alert
							actionsLayout="vertical"
							actions={[{
								title: 'Отредактировать',
								autoclose: true,
								mode: 'destructive',
								action: () => {
									edit_message(false);
								},
							}, {
								title: 'Отмена',
								autoclose: true,
								mode: 'cancel'
							}]}
							onClose={() => setPopout(null)}
						>
							<h2>Подтвердите действие</h2>
							<p>Вы уверены, что хотите отредактировать сообщения?</p>
						</Alert>)}
					>Отредактировать сообщения
							</CellButton>
				</FormLayout>
			</FixedLayout>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
