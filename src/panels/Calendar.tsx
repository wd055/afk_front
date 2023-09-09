import React, { useState, useEffect } from 'react';
import {
	Panel,
	PanelHeader,
	Group,
	FormItem,
	FormStatus,
	DatePicker,
	FormLayoutGroup,
	List,
	Cell,
	CellButton,
	Footer,
	Tabs,
	TabsItem,
	Header
} from '@vkontakte/vkui';
import { Icon28AddOutline, Icon28CheckCircleFill, Icon28SearchOutline } from '@vkontakte/icons';
import { Roles, userRole } from '../consts/roles';
import EventModel, { Event } from '../models/Event';
import EventController from '../controllers/Event';
import { eventTypesIcons, TDepartment, TDepartmentArray, TDepartmentName } from '../consts/events';
import { getDatesTitle } from '../utils/date';
import StudentModel from '../models/Student';
import { EGo as go } from '../App';

export interface CalendarPanelProps {
	id: string;
	nonCurrnetStudent?: boolean;
}

export const CalendarPanel = ({ id, nonCurrnetStudent }: CalendarPanelProps): JSX.Element => {
	const [events, setEvents] = useState<Event[]>([]);
	const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
	const [selectDepartment, setSelectDepartment] = useState<TDepartment>('');

	const date = new Date();
	const first = date.getDate();
	const last = first + 6;

	const start = new Date(date.setDate(first));
	const end = new Date(date.setDate(last));
	const [dateRange, setDateRange] = useState({ start: start, end: end });

	useEffect(() => {
		EventController.getEvents(dateRange.start, dateRange.end, setEvents, selectDepartment);
		EventController.getFavorite(setFavoriteEvents);
	}, [dateRange, selectDepartment]);

    return (
		<Panel id={id}>
			<PanelHeader>Календарь</PanelHeader>
			{nonCurrnetStudent ? (
				<Group>
					<FormItem>
						<FormStatus header="Не заполнена форма" mode="error">
							Для использования всех функций приложения, пожалуйста, заполните форму через
							чат бота группы АФК МГТУ
						</FormStatus>
					</FormItem>
				</Group>
			) : (
				<>
					<Group>
						<CellButton
							onClick={(): void => {
								StudentModel.currentStudent = null;
								go('studentInfo');
							}}
						>
							Мои посещения
						</CellButton>
						{/*<CellButton onClick={(): void => go('Report')}>Реферат</CellButton>*/}
					</Group>

					{userRole === Roles.admin && (
						<Group>
							<CellButton
								before={<Icon28AddOutline />}
								onClick={(): void => {
									EventModel.currentEvent = null;
									go('eventForm', true);
								}}
							>
								Создать мероприятия
							</CellButton>
							<CellButton
								before={<Icon28SearchOutline />}
								onClick={(): void => go('Students')}
							>
								Студенты
							</CellButton>
						</Group>
					)}
				</>
			)}
			{favoriteEvents.length > 0 && (
				<Group header={<Header>Избранные мероприятия</Header>}>
					<List>
						{favoriteEvents.map((event: Event) => (
							<Cell
								indicator={
									event.favorite && userRole === Roles.admin ? (
										<Icon28CheckCircleFill />
									) : (
										<></>
									)
								}
								before={eventTypesIcons[event.eventType]}
								description={getDatesTitle(event.start, event.end)}
								key={event.id}
								onClick={(): void => {
									EventModel.currentEvent = event;
									if (userRole !== Roles.student) {
										go('Event');
									} else {
										go('eventInfo', true);
									}
								}}
							>
								{event.title}{' '}
								{event.department && `(${TDepartmentName[event.department]})`}
							</Cell>
						))}
					</List>
				</Group>
			)}
			<Group>
				<FormLayoutGroup mode="horizontal">
					<FormItem top="С">
						<DatePicker
							min={{
								day: 1,
								month: 1,
								year: 2019
							}}
							onDateChange={(value): void => {
								setDateRange({
									...dateRange,
									start: new Date(value.year, value.month - 1, value.day)
								});
							}}
							defaultValue={{
								day: dateRange.start.getDate(),
								month: dateRange.start.getMonth() + 1,
								year: dateRange.start.getFullYear()
							}}
							dayPlaceholder="Д"
							monthPlaceholder="ММ"
							yearPlaceholder="ГГ"
						/>
					</FormItem>
					<FormItem top="По">
						<DatePicker
							min={{
								day: 1,
								month: 1,
								year: new Date().getFullYear() - 1
							}}
							onDateChange={(value): void => {
								setDateRange({
									...dateRange,
									end: new Date(value.year, value.month - 1, value.day)
								});
							}}
							defaultValue={{
								day: dateRange.end.getDate(),
								month: dateRange.end.getMonth() + 1,
								year: dateRange.end.getFullYear()
							}}
							dayPlaceholder="Д"
							monthPlaceholder="ММ"
							yearPlaceholder="ГГ"
						/>
					</FormItem>
				</FormLayoutGroup>
				<FormItem top="Кафедра">
					<Tabs mode="buttons">
						{TDepartmentArray.map((item: TDepartment) => {
							return (
								<TabsItem
									key={item}
									onClick={(): void => setSelectDepartment(item)}
									selected={selectDepartment === item}
								>
									{TDepartmentName[item as keyof typeof TDepartmentName]}
								</TabsItem>
							);
						})}
					</Tabs>
				</FormItem>
			</Group>

			<Group>
				<List>
					{!events ||
						(events.length === 0 && <Footer>В выбранные даты мероприятий нет</Footer>)}
					{events.map((event: Event) => (
						<Cell
							indicator={
								event.favorite && userRole === Roles.admin ? (
									<Icon28CheckCircleFill />
								) : (
									<></>
								)
							}
							before={eventTypesIcons[event.eventType]}
							description={getDatesTitle(event.start, event.end)}
							key={event.id}
							onClick={(): void => {
								EventModel.currentEvent = event;
								if (userRole !== Roles.student) {
									go('Event');
								} else {
									go('eventInfo', true);
								}
							}}
						>
							{event.title}{' '}
							{event.department && `(${TDepartmentName[event.department]})`}
						</Cell>
					))}
				</List>
			</Group>
		</Panel>
	);
};
