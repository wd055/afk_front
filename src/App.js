import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';


import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	useRouteMatch,
	useParams
} from "react-router-dom";

import Home from './panels/Home';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	bridge.send("VKWebAppGetUserInfo", {});

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
			if (type === 'VKWebAppGetEmailResult') {
				document.getElementById('email').value = data.email;
			}
			if (type === 'VKWebAppGetPhoneNumberResult') {
				document.getElementById('phone').value = data.phone_number;
			}
			if (type === 'VKWebAppGetUserInfoResult') {
				setUser(data.id)
			}
			console.log(type, data)
		});
		async function fetchData() {
			// const user = await bridge.send('VKWebAppGetUserInfo');
			// setUser(user);
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	const redIcon = {
		color: 'red'
	};
	const blueIcon = {
		color: 'var(--accent)'
	};

	return (

		<Router>
			{/* <div>
				<ul>
					<li>
						<Link to="/"></Link>
					</li>
					<li>
						<Link to="/success"></Link>
					</li>
					<li>
						<Link to="/error"></Link>
					</li>
				</ul> */}

				<Switch>
					<Route path="/success">
						<View activePanel="Success" popout={popout}>
							<Panel id="Success">
								<PanelHeader>Успешная авторизация</PanelHeader>
								<Placeholder
									icon={<Icon56CheckCircleOutline style={blueIcon} />}
									stretched
									id="Placeholder"
								>
									Успешная авторизация!
							</Placeholder>
							</Panel>
						</View>
					</Route>
					<Route path="/error">
						<View activePanel="Error" popout={popout}>
							<Panel id="Error">
								<PanelHeader>Ошибка авторизации</PanelHeader>
								<Placeholder
									icon={<Icon56ErrorOutline style={redIcon} />}
									stretched
									id="Placeholder"
								>
									Ошибка авторизации<br />Попробуйте позже или свяжитесь с администратором группы!
							</Placeholder>
							</Panel>
						</View>
					</Route>
					<Route path="/">
						{/* <Home /> */}
						<View activePanel={activePanel} popout={popout}>
							<Home id='home' fetchedUser={fetchedUser} go={go} setPopout={setPopout} />
						</View>
					</Route>
				</Switch>
			{/* </div> */}
		</Router>
	);
}

export default App;

