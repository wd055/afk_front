import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';

import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Card from '@vkontakte/vkui/dist/components/Card/Card';
import CardGrid from '@vkontakte/vkui/dist/components/CardGrid/CardGrid';

import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import File from '@vkontakte/vkui/dist/components/File/File';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';

import Icon28AttachOutline from '@vkontakte/icons/dist/28/attach_outline';

import { statusSnackbar, blueIcon } from './style';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';

var origin = "https://thingworx.asuscomm.com:10888"
var main_url = "https://profkom-bot-bmstu.herokuapp.com/"

// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const App = ({ id, go, goBack,
	setPopout, login,
	snackbar, setSnackbar,
	student, usersInfo,
	students_documents, set_students_documents,
}) => {

	// const [countAttachments, setCountAttachments] = useState(false);
	// const [attachments, setAttachments] = useState("");

	useEffect(() => {

	}, []);

	function kitcut(text, limit) {
		text = text.trim();
		if (text.length <= limit) return text;

		text = text.slice(0, limit);

		return text.trim() + "...";
	}

	function test(e) {
		e.preventDefault();

		var url = main_url + "profkom_bot/put_document/"
		var put_url = ""
		var theFormFile = e.target.files[0];		
		var file_name = theFormFile.name;

		console.log(file_name)

		const upload = (file) => {
			fetch(put_url, { // Your POST endpoint
				method: 'PUT',
				headers: {
					"Content-Type": "binary/octet-stream",
					'Origin': origin
				},
				processData: false,
				contentType: 'binary/octet-stream',
				body: file // This is your file object
			})
				.then(function (response) {
					if (!response.ok) {
						// delete_photo(name);
						statusSnackbar(response.code, setSnackbar);
						console.error('sendFile:', response)
						throw Error(response.statusText);
					}
					return response;
				})
				.then((data) => {
					console.log(data);
				})
				.catch((error) => {
						// delete_photo(name);
						statusSnackbar(0, setSnackbar)
						console.error('sendFile:', error)
					})
		};

		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				querys: window.location.search,
				students_login: login,
				file_name: file_name,
			}),
			headers: {'Origin': origin}
		})
			.then(function (response) {
				if (!response.ok) {
					statusSnackbar(response.code, setSnackbar);
					console.error('get_puts_url:', response)
					throw Error(response.statusText);
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
				// sendFile(e, data.get_url, data.put_url, data.name, data.date)
				put_url = data.put_url
				upload(theFormFile);

			})
			.catch((error) => {
					statusSnackbar(0, setSnackbar)
					console.error('get_puts_url:', error)
				})
	}

	function sendFile(e, get_url, put_url, name, date) {
		// get the reference to the actual file in the input
		var theFormFile = e.target.files[0];
		console.log(theFormFile.name)

		const upload = (file) => {
			fetch(put_url, { // Your POST endpoint
				method: 'PUT',
				headers: {
					"Content-Type": "binary/octet-stream",
					'Origin': origin
				},
				processData: false,
				contentType: 'binary/octet-stream',
				body: file // This is your file object
			})
				.then(function (response) {
					if (!response.ok) {
						delete_photo(name);
						statusSnackbar(response.code, setSnackbar);
						console.error('sendFile:', response)
						throw Error(response.statusText);
					}
					return response;
				})
				.then((data) => {
					console.log(data);
				})
				.catch((error) => {
						delete_photo(name);
						statusSnackbar(0, setSnackbar)
						console.error('sendFile:', error)
					})
		};
		upload(theFormFile);
	}

	function delete_photo(name) {
		var url = main_url + "profkom_bot/put_document/"

		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				querys: window.location.search,
				name: name,
			}),
			headers: {'Origin': origin}
		})
			.then(function (response) {
				if (!response.ok) {
					statusSnackbar(response.code, setSnackbar);
					console.error('cancel_uploud:', response)
					throw Error(response.statusText);
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
			})
			.catch((error) => {
					statusSnackbar(0, setSnackbar)
					console.error('cancel_uploud:', error)
				})
	}
	function get_puts_url(e) {
		var url = main_url + "profkom_bot/put_document/"
		
		e.preventDefault();
		var file_name = e.target.files[0].name;
		console.log(file_name)

		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				querys: window.location.search,
				file_name: file_name,
			}),
			headers: {'Origin': origin}
		})
			.then(function (response) {
				if (!response.ok) {
					statusSnackbar(response.code, setSnackbar);
					console.error('get_puts_url:', response)
					throw Error(response.statusText);
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
				sendFile(e, data.get_url, data.put_url, data.name, data.date)
			})
			.catch((error) => {
					statusSnackbar(0, setSnackbar)
					console.error('get_puts_url:', error)
				})
	}
	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderBack onClick={goBack} />}
			>Документы</PanelHeader>
			<Group separator="hide">
				<CardGrid>
					<Card size="m">
						<img
							style={{ width: "100%", borderRadius: "10px" }}
							src="https://sun9-32.userapi.com/impf/c824201/v824201969/173424/ayWCFmi538s.jpg?size=200x0&quality=90&sign=b461a01af900c4374512c2b13455c25d&ava=1" />
					</Card>
					<Card size="m">
						<img
							style={{ width: "100%", borderRadius: "10px" }}
							src="https://sun9-32.userapi.com/impf/c824201/v824201969/173424/ayWCFmi538s.jpg?size=200x0&quality=90&sign=b461a01af900c4374512c2b13455c25d&ava=1" />
					</Card>
					<CardGrid>
					</CardGrid>
					<Card size="m">
						<img
							style={{ width: "100%", borderRadius: "10px" }}
							src="https://sun9-32.userapi.com/impf/c824201/v824201969/173424/ayWCFmi538s.jpg?size=200x0&quality=90&sign=b461a01af900c4374512c2b13455c25d&ava=1" />
						<Div style={{ position: "absolute", bottom: 20, left: 12, borderRadius: "10px", backgroundColor: 'var(--content_tint_background)', padding: 6 }}>{kitcut("Справка о состоянии семьи на 2020 учебный год", 15)}</Div>
					</Card>
				</CardGrid>
			</Group>
			<FixedLayout vertical="bottom">
				<Cell asideContent={<File
					controlSize="l"
					accept="image/*"
					capture
					onChange={(e) => {
						test(e);
					}}
					id="theFile"
					style={{ background: "transparent" }}
				><Cell asideContent={<Avatar><Icon28AttachOutline name="icon" style={blueIcon} /></Avatar>} /></File>} />
			</FixedLayout>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
