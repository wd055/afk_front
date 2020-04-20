import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';

const output_graf = draw_graf();

const Home = ({ id, go, fetchedUser }) => (
	<Panel id={id}>
		<PanelHeader>Example</PanelHeader>

		<Group title="Navigation Example">
			<Div>
				<Button size="xl" level="2" onClick={go} data-to="persik">
					Show me the Persik, please
				</Button>
			</Div>
			
			<Div id="background_map">
				<img id="background_img" src="../img/GZ.png" alt="Фон карты не прогрузился" width="100"/>
			</Div>
			
			<Div id="point_map">
				<svg id="svg_map" viewBox="0 0 1059 873" width={Math.min(document.documentElement.clientWidth, 1059)} height="873">
					{output_graf}
				</svg>
			</Div>
		</Group>
	</Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

function draw_graf() {
	var dots = JSON.parse(`[{"id":0,"floor":1,"cx":1013,"cy":837,"near_dots":[1]},{"id":1,"floor":1,"cx":1003,"cy":578,"near_dots":[2,0]},{"id":2,"is_stairs":true,"floor":1,"cx":796,"cy":583,"near_dots":[3,1,19]},{"id":3,"floor":1,"cx":660,"cy":587,"near_dots":[9,2]},{"id":4,"floor":1,"cx":656,"cy":266,"near_dots":[9,5,14]},{"id":5,"floor":1,"cx":747,"cy":174,"near_dots":[4,6]},{"id":6,"floor":1,"cx":765,"cy":61,"near_dots":[5,7]},{"id":7,"floor":1,"cx":995,"cy":51,"near_dots":[6,8]},{"id":8,"floor":1,"cx":1001,"cy":344,"near_dots":[7]},{"id":9,"floor":1,"cx":638,"cy":562,"near_dots":[13,3,4]},{"id":10,"floor":1,"cx":416,"cy":654,"near_dots":[13]},{"id":11,"floor":1,"cx":67,"cy":594,"near_dots":[12,13]},{"id":12,"floor":1,"cx":65,"cy":853,"near_dots":[11]},{"id":13,"floor":1,"cx":385,"cy":586,"near_dots":[11,10,9,14]},{"id":14,"floor":1,"cx":401,"cy":266,"near_dots":[4,13,15]},{"id":15,"floor":1,"cx":311,"cy":172,"near_dots":[16,14]},{"id":16,"floor":1,"cx":296,"cy":59,"near_dots":[17,15]},{"id":17,"floor":1,"cx":53,"cy":61,"near_dots":[18,16]},{"id":18,"floor":1,"cx":62,"cy":364,"near_dots":[17]},{"is_stairs":false,"id":19,"floor":2,"cx":1003,"cy":585,"near_dots":[20,2]},{"is_stairs":false,"id":20,"floor":2,"cx":1011,"cy":846,"near_dots":[19]}]`);
	var floor = 1;
	var input_str = [];

	for (var i in dots) {
		var text_x = 10;
		if (dots[i].id > 9)
			text_x = 14;
		text_x -= 6;

		if (dots[i].floor == floor || dots[i].is_stairs == true) {
			input_str.push(<circle id={dots[i].id}
				cx={dots[i].cx} cy={dots[i].cy}
				r="12" stroke="black" fill="red" />);

			input_str.push(<text id={dots[i].id + "_text"}
				x={dots[i].cx - text_x} y={dots[i].cy + 6}
				fill="white">{dots[i].id}</text>);
			for (var j in dots[i].near_dots) {
				if (document.getElementById(`${dots[i].near_dots[j]}_${dots[i].id}`) == null && dots[dots[i].near_dots[j]].floor == floor)
				input_str.unshift(<line 
								id = {dots[i].id + "_" + dots[i].near_dots[j]}
								x1 = {dots[i].cx} y1 = {dots[i].cy}
								x2 = {dots[dots[i].near_dots[j]].cx} y2 = {dots[dots[i].near_dots[j]].cy}
								stroke = "red" stroke-width = "2" />);
			}
		}
	}
	console.log(input_str)
	return input_str;
}

export default Home;
