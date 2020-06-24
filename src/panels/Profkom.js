import React, { useState, useEffect } from 'react';
import PropTypes, { func } from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';

import Select from '@vkontakte/vkui/dist/components/Select/Select';
import Radio from '@vkontakte/vkui/dist/components/Radio/Radio';
import Textarea from '@vkontakte/vkui/dist/components/Textarea/Textarea';
import Checkbox from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';
import Link from '@vkontakte/vkui/dist/components/Link/Link';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';
import Icon16Done from '@vkontakte/icons/dist/16/done';

import Group from '@vkontakte/vkui/dist/components/Group/Group';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import InfoRow from '@vkontakte/vkui/dist/components/InfoRow/InfoRow';
import RichCell from '@vkontakte/vkui/dist/components/RichCell/RichCell';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import HorizontalScroll from '@vkontakte/vkui/dist/components/HorizontalScroll/HorizontalScroll';
import List from '@vkontakte/vkui/dist/components/List/List';
import Search from '@vkontakte/vkui/dist/components/Search/Search';
import Gallery from '@vkontakte/vkui/dist/components/Gallery/Gallery';
import Div from '@vkontakte/vkui/dist/components/Div/Div';

import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';
import Icon24Error from '@vkontakte/icons/dist/24/error';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon24Send from '@vkontakte/icons/dist/24/send';

import Icon28HistoryForwardOutline from '@vkontakte/icons/dist/28/history_forward_outline';
import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import Icon28CancelCircleOutline from '@vkontakte/icons/dist/28/cancel_circle_outline';

import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';

import bridge from '@vkontakte/vk-bridge';

var origin = "https://thingworx.asuscomm.com:10888"
var main_url = "https://profkom-bot-bmstu.herokuapp.com/"
// var main_url = "http://thingworx.asuscomm.com/"
// var main_url = "http://localhost:8000/"

const redIcon = {
	color: 'red'
};
const blueIcon = {
	color: 'var(--accent)'
};
const orangeBackground = {
	backgroundImage: 'linear-gradient(135deg, #ffb73d, #ffa000)'
};

const blueBackground = {
	backgroundColor: 'var(--accent)'
};
const redBackground = {
	backgroundColor: 'var(--field_error_border)'
};
  
function Is_list(props) {
	var rows = [];
	for (var i = 0; i < props.count; i++) {
		rows.push(<Cell
			key = {i}
			size="l"
			// description="Друзья в Facebook"
			asideContent={
				<div style={{ display: 'flex' }}>
				</div>
			}
			bottomContent={
				<HorizontalScroll>
					<div style={{ display: 'flex' }}>
						<Button size="m" mode="outline" style={{ marginLeft: 8 }}>19У153</Button>
						<Button size="m" mode="outline" style={{ marginLeft: 8 }}>ИУ7-21Б</Button>
					</div>
				</HorizontalScroll>
			}
		>Власов Денис Владимирович</Cell>);
	}

	const list = 
	<Group>
		<List>
			{rows}
			<Cell
				before={<Icon28HistoryForwardOutline />}
				size="l"
				// description="Друзья в Facebook"
				asideContent={
					<div style={{ display: 'flex' }}>
						<Icon28DoneOutline style={blueIcon} />
						<Icon28CancelCircleOutline style={{ marginLeft: 8, color: 'red' }} />
					</div>
				}
				bottomContent={
					<HorizontalScroll>
						<div style={{ display: 'flex' }}>
							<Button size="m" mode="outline">1234</Button>
							<Button size="m" mode="outline" style={{ marginLeft: 8 }}>19У153</Button>
							<Button size="m" mode="outline" style={{ marginLeft: 8 }}>Власов Д.В.</Button>
						</div>
					</HorizontalScroll>
				}
			>Компенсация за проживание в общежитии</Cell>
			<Cell
				before={<Icon28DoneOutline />}
				size="l"
				// description="Друзья в Facebook"
				asideContent={
					<div style={{ display: 'flex' }}>
					</div>
				}
				bottomContent={
					<HorizontalScroll>
						<div style={{ display: 'flex' }}>
							<Button size="m" mode="outline">1234</Button>
							<Button size="m" mode="outline" style={{ marginLeft: 8 }}>19У153</Button>
							<Button size="m" mode="outline" style={{ marginLeft: 8 }}>Власов Д.В.</Button>
						</div>
					</HorizontalScroll>
				}
			>Выплаты старостам и профоргам</Cell>
			<Cell
				before={<Icon28CancelCircleOutline style={redIcon} />}
				size="l"
				// description="Друзья в Facebook"
				asideContent={
					<div style={{ display: 'flex' }}>
					</div>
				}
				bottomContent={
					<HorizontalScroll>
						<div style={{ display: 'flex' }}>
							<Button size="m" mode="outline">1234</Button>
							<Button size="m" mode="outline" style={{ marginLeft: 8 }}>19У153</Button>
							<Button size="m" mode="outline" style={{ marginLeft: 8 }}>Власов Д.В.</Button>
						</div>
					</HorizontalScroll>
				}
			>Выплаты старостам и профоргам</Cell>
			<Cell
				size="l"
				// description="Друзья в Facebook"
				asideContent={
					<div style={{ display: 'flex' }}>
					</div>
				}
				bottomContent={
					<HorizontalScroll>
						<div style={{ display: 'flex' }}>
							<Button size="m" mode="outline" style={{ marginLeft: 8 }}>19У153</Button>
							<Button size="m" mode="outline" style={{ marginLeft: 8 }}>ИУ7-21Б</Button>
						</div>
					</HorizontalScroll>
				}
			>Власов Денис Владимирович</Cell>
		</List>
	</Group>
	return list;
}

const App = ({ id, fetchedUser, go, setPopout, setModal }) => {
	const redIcon = {
		color: 'red'
	};
	const blueIcon = {
		color: 'var(--accent)'
	};
	const orangeBackground = {
		backgroundImage: 'linear-gradient(135deg, #ffb73d, #ffa000)'
	};

	const blueBackground = {
		backgroundColor: 'var(--accent)'
	};
	const redBackground = {
		backgroundColor: 'var(--field_error_border)'
	};

	var params = window
		.location
		.search
		.replace('?', '')
		.split('&')
		.reduce(
			function (p, e) {
				var a = e.split('=');
				p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
				return p;
			},
			{}
		);

	const [students, setStudents] = useState([]);
	const [snackbar, setSnackbar] = useState();
	const [tabsState, setTabsState] = useState('students');
	const [searchValue, setSearchValue] = useState("");

	useEffect(() => {
		var url = main_url + "profkom_bot/get_all_users/";
		if (students.length == 0) {
			fetch(url, {
				method: 'POST',
				headers: {
					'Origin': origin
				}
			})
				.then(response => response.json())
				.then((data) => {
					setStudents(data)
					console.log(data)
				},
					(error) => {
						console.error('get category:', error)
					})
		}
	});

	const onEmailClick = e => {
		console.log("qweqweqwe")
		bridge.send("VKWebAppGetEmail", {});
	};

	// get thematics () {
	// 	const search = this.state.search.toLowerCase();
	// 	return thematics.filter(({name}) => name.toLowerCase().indexOf(search) > -1);
	//   }

	function getSearchFilter() {
		return students.filter(({ name }) => name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
	}

	const Home =
		<Panel id={id} style={{ 'max-width': 600, margin: 'auto' }}>
			<PanelHeader>Форма</PanelHeader>
			
			<Div style={{display: 'flex'}}>
				<Button size="l" stretched style={{ marginRight: 8 }}>Stretched</Button>
				<Button size="l" stretched mode="secondary">Stretched</Button>
			</Div>

			<Tabs mode="buttons">
				<TabsItem
					onClick={() => setTabsState('students')}
					selected={tabsState === 'students'}
				>Студенты</TabsItem>
				<TabsItem
					onClick={() => setTabsState('payouts')}
					selected={tabsState === 'payouts'}
				>Заявления</TabsItem>
			</Tabs>

			<Search
				value={searchValue}
				onChange={(e) => {
					const { value } = e.currentTarget;
					setSearchValue(value);
				}}
				icon={tabsState === 'payouts' && <Icon24Send />}
				after={null}
			/>
			<Group>
				<List>
					<Cell
						before={<Icon28HistoryForwardOutline />}
						size="l"
						// description="Друзья в Facebook"
						asideContent={
							<div style={{ display: 'flex' }}>
								<Icon28DoneOutline style={blueIcon} />
								<Icon28CancelCircleOutline style={{ marginLeft: 8, color: 'red' }} />
							</div>
						}
						bottomContent={
							<HorizontalScroll>
								<div style={{ display: 'flex' }}>
									<Button size="m" mode="outline">1234</Button>
									<Button size="m" mode="outline" style={{ marginLeft: 8 }}>19У153</Button>
									<Button size="m" mode="outline" style={{ marginLeft: 8 }}>Власов Д.В.</Button>
								</div>
							</HorizontalScroll>
						}
					>Компенсация за проживание в общежитии</Cell>
					<Cell
						before={<Icon28DoneOutline />}
						size="l"
						// description="Друзья в Facebook"
						asideContent={
							<div style={{ display: 'flex' }}>
							</div>
						}
						bottomContent={
							<HorizontalScroll>
								<div style={{ display: 'flex' }}>
									<Button size="m" mode="outline">1234</Button>
									<Button size="m" mode="outline" style={{ marginLeft: 8 }}>19У153</Button>
									<Button size="m" mode="outline" style={{ marginLeft: 8 }}>Власов Д.В.</Button>
								</div>
							</HorizontalScroll>
						}
					>Выплаты старостам и профоргам</Cell>
					<Cell
						before={<Icon28CancelCircleOutline style={redIcon} />}
						size="l"
						// description="Друзья в Facebook"
						asideContent={
							<div style={{ display: 'flex' }}>
							</div>
						}
						bottomContent={
							<HorizontalScroll>
								<div style={{ display: 'flex' }}>
									<Button size="m" mode="outline">1234</Button>
									<Button size="m" mode="outline" style={{ marginLeft: 8 }}>19У153</Button>
									<Button size="m" mode="outline" style={{ marginLeft: 8 }}>Власов Д.В.</Button>
								</div>
							</HorizontalScroll>
						}
					>Выплаты старостам и профоргам</Cell>
					<Cell
						size="l"
						// description="Друзья в Facebook"
						asideContent={
							<div style={{ display: 'flex' }}>
							</div>
						}
						bottomContent={
							<HorizontalScroll>
								<div style={{ display: 'flex' }}>
									<Button size="m" mode="outline" style={{ marginLeft: 8 }}>19У153</Button>
									<Button size="m" mode="outline" style={{ marginLeft: 8 }}>ИУ7-21Б</Button>
								</div>
							</HorizontalScroll>
						}
					>Власов Денис Владимирович</Cell>
				</List>
			</Group>
			{snackbar}
		</Panel>
	return Home;
}

export default App;
