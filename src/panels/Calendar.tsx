import React, { useState, useEffect } from 'react';
import {
    Panel,
    PanelHeader,
    Group,
    FormItem,
    DatePicker,
    FormLayoutGroup,
    List,
    Cell,
    CellButton,
    Footer
} from '@vkontakte/vkui';
import { Icon28AddOutline, Icon28CheckCircleFill, Icon28SearchOutline } from '@vkontakte/icons';
import { Roles, userRole } from '../consts/roles';
import EventModel, { IEvent } from '../models/Event';
import EventController from '../controllers/Event';
import { eventTypesIcons } from '../consts/events';
import { getDateTitle } from '../utils/date';
import StudentModel from '../models/Student';
import { EGo as go } from '../App';

export interface ICalendarPanel {
    id: string;
}

export const CalendarPanel = ({ id }: ICalendarPanel) => {
    const [events, setEvents] = useState([]);

    let date = new Date();
    let first = date.getDate();
    let last = first + 6;

    let start = new Date(date.setDate(first));
    let end = new Date(date.setDate(last));
    const [dateRange, setDateRange] = useState({ start: start, end: end });

    useEffect(() => {
        EventController.getEvents(dateRange.start, dateRange.end, setEvents);
    }, [dateRange]);

    return (
        <Panel id={id}>
            <PanelHeader>Календарь</PanelHeader>
            <Group>
                <FormLayoutGroup mode="horizontal">
                    <FormItem top="С">
                        <DatePicker
                            min={{
                                day: 1,
                                month: 1,
                                year: new Date().getFullYear() - 1
                            }}
                            onDateChange={(value) => {
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
                            onDateChange={(value) => {
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
            </Group>
            <Group>
                <List>
                    {!events || (events.length === 0 && <Footer>В выбранные даты мероприятий нет</Footer>)}
                    {events.map((event: IEvent) => (
                        <Cell
                            indicator={
                                event.favorite && userRole === Roles.admin ? <Icon28CheckCircleFill /> : <></>
                            }
                            before={eventTypesIcons[event.eventType]}
                            description={getDateTitle(event.start, event.end)}
                            key={event.id}
                            onClick={() => {
                                EventModel.currentEvent = event;
                                if (userRole !== Roles.student) {
                                    go('Event');
                                } else {
                                    go('eventInfo', true);
                                }
                            }}
                        >
                            {event.title}
                        </Cell>
                    ))}
                </List>
            </Group>
            <Group>
                <CellButton
                    onClick={() => {
                        StudentModel.currentStudent = null;
                        go('studentInfo');
                    }}
                >
                    Мои посещения
                </CellButton>
            </Group>
            {userRole === Roles.admin && (
                <Group>
                    <CellButton
                        before={<Icon28AddOutline />}
                        onClick={() => {
                            EventModel.currentEvent = null;
                            go('eventForm', true);
                        }}
                    >
                        Создать мероприятия
                    </CellButton>
                    <CellButton
                        before={<Icon28SearchOutline />}
                        onClick={() => {
                            go('Students');
                        }}
                    >
                        Студенты
                    </CellButton>
                </Group>
            )}
        </Panel>
    );
};
