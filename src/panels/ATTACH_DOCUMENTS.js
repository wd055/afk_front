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
import Icon16CancelCircleOutline from '@vkontakte/icons/dist/16/cancel_circle_outline';
import Icon28CancelCircleOutline from '@vkontakte/icons/dist/28/cancel_circle_outline';

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
	const [Grid, set_Grid] = useState([]);

	useEffect(() => {
		console.log("ASDAS")
		draw_grid();
	}, [usersInfo, students_documents]);

	function kitcut(text, limit) {
		text = text.trim();
		if (text.length <= limit) return text;

		text = text.slice(0, limit);

		return text.trim() + "...";
	}

	function sendFile(e) {
		e.preventDefault();

		var url = main_url + "profkom_bot/put_document/"
		var theFormFile = e.target.files[0];
		var file_name = theFormFile.name;
		var files_data = null;

		console.log(file_name)

		const upload = (file) => {
			fetch(files_data.put_url, { // Your POST endpoint
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
						delete_photo(files_data.name);
						statusSnackbar(response.code, setSnackbar);
						console.error('sendFile:', response)
						throw Error(response.statusText);
					}
					return response;
				})
				.then((data) => {
					console.log(data);
					var temp = students_documents;
					files_data.url = files_data.get_url;
					temp.push(files_data);
					set_students_documents(temp);
					// students_documents.push(files_data);
					draw_grid();
					console.log(students_documents);
				})
				.catch((error) => {
					delete_photo(files_data.name);
					statusSnackbar(0, setSnackbar)
					console.error('sendFile:', error)
				})
		};

		var data = {
			querys: window.location.search,
			file_name: file_name,
		}
		if (login !== null) {
			data.students_login = login;
		}
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'Origin': origin }
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
				files_data = data;
				upload(theFormFile);

			})
			.catch((error) => {
				statusSnackbar(0, setSnackbar)
				console.error('get_puts_url:', error)
			})
	}

	function delete_photo(name) {
		var url = main_url + "profkom_bot/delete_document/"

		var data = {
			querys: window.location.search,
			name: name,
		}
		if (login !== null) {
			data.students_login = login;
		}
		console.log(data)
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { 'Origin': origin }
		})
			.then(function (response) {
				if (!response.ok) {
					statusSnackbar(response.code, setSnackbar);
					console.error('delete_photo:', response)
					throw Error(response.statusText);
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);				
				var len = students_documents.length / 2;
				var temp = students_documents;
				for (var i = 0; i < len; i++){
					if (temp[i].name === name){
						temp.splice(i, 1);
					}
				}
				set_students_documents(temp);
				draw_grid();
			})
			.catch((error) => {
				statusSnackbar(0, setSnackbar)
				console.error('delete_photo:', error)
			})
	}

	function draw_grid() {
		var output = [];
		var output1 = [];
		var output2 = [];

		var row = {
			display: "flex",
			flexWrap: "wrap",
			padding: "0 4px",
		}
		var column = {
			flex: "49%",
			maxWidth: "49%",
		}
		var column_right = {marginLeft: "8px"}
		var column_img = {
			marginTop: "8px",
			verticalAlign: "middle",
			width: "100%",
		}

		var len = Math.floor(students_documents.length / 2);
		console.log(len);
		for (var i = 0; i < len; i++) {
			output.push(<div>
					<Card size="m">
						<div 
							style={{position: "absolute", top: 12, right: 12,
							borderRadius: "10px",
							backgroundColor: 'var(--content_tint_background)'}} 
							data-name={students_documents[i * 2].name}
							onClick={(e) => {delete_photo(e.currentTarget.dataset.name)}}
							><Icon28CancelCircleOutline /></div>
						<img
							style={{ width: "100%", borderRadius: "10px" }}
							src={students_documents[i * 2].url} />
						<Div style={{
							position: "absolute", bottom: 20,
							left: 12, borderRadius: "10px",
							backgroundColor: 'var(--content_tint_background)', padding: 6
						}}>{kitcut(students_documents[i * 2].name, 15)}</Div>
					</Card>
					<Card size="m">
						<div 
							style={{position: "absolute", top: 12, right: 12,
							borderRadius: "10px",
							backgroundColor: 'var(--content_tint_background)'}} 
							data-name={students_documents[i * 2].name}
							onClick={(e) => {delete_photo(e.currentTarget.dataset.name)}}
							><Icon28CancelCircleOutline /></div>
						<img
							style={{ width: "100%", borderRadius: "10px" }}
							src={students_documents[i * 2 + 1].url} />
						<Div style={{
							position: "absolute", bottom: 20,
							left: 12, borderRadius: "10px",
							backgroundColor: 'var(--content_tint_background)', padding: 6
						}}>{kitcut(students_documents[i * 2].name, 15)}</Div>
					</Card>
					</div>
			)
			output1.push(
					<Card size="m" style={column_img}>
						<div 
							style={{position: "absolute", top: 12, right: 12,
							borderRadius: "10px",
							backgroundColor: 'var(--content_tint_background)'}} 
							data-name={students_documents[i * 2].name}
							onClick={(e) => {delete_photo(e.currentTarget.dataset.name)}}
							><Icon28CancelCircleOutline /></div>
						<img
							style={{ width: "100%", borderRadius: "10px" }}
							src={students_documents[i * 2].url} />
						<Div style={{
							position: "absolute", bottom: 20,
							left: 12, borderRadius: "10px",
							backgroundColor: 'var(--content_tint_background)', padding: 6
						}}>{kitcut(students_documents[i * 2].name, 15)}</Div>
					</Card>)
			output2.push(
				<Card size="m" style={column_img}>
						<div 
							style={{position: "absolute", top: 12, right: 12,
							borderRadius: "10px",
							backgroundColor: 'var(--content_tint_background)'}} 
							data-name={students_documents[i * 2].name}
							onClick={(e) => {delete_photo(e.currentTarget.dataset.name)}}
							><Icon28CancelCircleOutline /></div>
						<img
							style={{ width: "100%", borderRadius: "10px" }}
							src={students_documents[i * 2 + 1].url} />
						<Div style={{
							position: "absolute", bottom: 20,
							left: 12, borderRadius: "10px",
							backgroundColor: 'var(--content_tint_background)', padding: 6
						}}>{kitcut(students_documents[i * 2].name, 15)}</Div>
					</Card>
			)
		}
		if (students_documents.length % 2) {
			var students_document = students_documents[students_documents.length - 1];
			output.push(
				<CardGrid key={students_documents.length - 1} >
					<Card size="m">
						<div 
							style={{position: "absolute", top: 12, right: 12,
							borderRadius: "10px",
							backgroundColor: 'var(--content_tint_background)'}} 
							data-name={students_document.name}
							onClick={(e) => {delete_photo(e.currentTarget.dataset.name)}}
							><Icon28CancelCircleOutline /></div>
						<img
							style={{ width: "100%", borderRadius: "10px" }}
							src={students_document.url} />
						<Div style={{
							position: "absolute", bottom: 20,
							left: 12, borderRadius: "10px",
							backgroundColor: 'var(--content_tint_background)', padding: 6
						}}>{kitcut(students_document.name, 15)}</Div>
					</Card>
				</CardGrid>
			)
			output1.push(
					<Card size="m" style={column_img}>
						<div 
							style={{position: "absolute", top: 12, right: 12,
							borderRadius: "10px",
							backgroundColor: 'var(--content_tint_background)'}} 
							data-name={students_document.name}
							onClick={(e) => {delete_photo(e.currentTarget.dataset.name)}}
							><Icon28CancelCircleOutline /></div>
						<img
							style={{ width: "100%", borderRadius: "10px" }}
							src={students_document.url} />
						<Div style={{
							position: "absolute", bottom: 20,
							left: 12, borderRadius: "10px",
							backgroundColor: 'var(--content_tint_background)', padding: 6
						}}>{kitcut(students_document.name, 15)}</Div>
					</Card>
			)
		}
		// set_Grid(output);
		set_Grid(
			<div style={row} >
				<div style={column} >{output1}</div>
				<div style={Object.assign(column_right, column)} >{output2}</div>
			</div>
		);
		return output;
	}
	const Home =
		<Panel id={id} style={{ 'maxWidth': 630, margin: 'auto' }}>
			<PanelHeader
				left={<PanelHeaderBack onClick={goBack} />}
			>Документы</PanelHeader>
			<Group separator="hide">
				{Grid}
			</Group>
			<FixedLayout vertical="bottom">
				<Cell asideContent={<File
					controlSize="l"
					accept="image/*"
					capture
					onChange={(e) => {
						sendFile(e);
					}}
					id="theFile"
					style={{ background: "transparent" }}
				><Cell asideContent={<Avatar
					style={{
						background: '#eceef0'
					}} >
					<Icon28AttachOutline name="icon" style={{ color: 'var(--accent)' }} />
				</Avatar>} /></File>} />
			</FixedLayout>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
