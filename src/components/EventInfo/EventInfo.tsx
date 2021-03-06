import React, { FunctionComponent } from 'react';
import { Group, MiniInfoCell } from '@vkontakte/vkui';
import {
    Icon20PlaceOutline,
    Icon20ArticleOutline,
    Icon16ClockOurline,
    Icon20EducationOutline
} from '@vkontakte/icons';
import { eventTypesIcons, TDepartmentName } from '../../consts/events';
import { Event } from '../../models/Event';
import { getDatesTitle, getDateTitle } from '../../utils/date';

type EventInfoProps = {
    event: Event;
    date?: Date;
};

export const EventInfo: FunctionComponent<EventInfoProps> = ({ event, date }: EventInfoProps ) => {
    return (
        <Group>
            {event.title && event.title.length > 0 && (
                <MiniInfoCell before={eventTypesIcons[event.eventType]} textLevel="primary" textWrap="short">
                    {event.title}
                </MiniInfoCell>
            )}
            {event.address && event.address.length > 0 && (
                <MiniInfoCell before={<Icon20PlaceOutline />} textWrap="full">
                    {event.address}
                </MiniInfoCell>
            )}
            {date && (
                <MiniInfoCell before={<Icon16ClockOurline />} textWrap="full">
                    Посетил: {getDateTitle(date)}
                </MiniInfoCell>
            )}
            {!date && event.start && event.end && (
                <MiniInfoCell before={<Icon16ClockOurline />} textWrap="full">
                    {getDatesTitle(new Date(event.start), new Date(event.end))}
                </MiniInfoCell>
            )}
            {event.description && event.description.length > 0 && (
                <MiniInfoCell before={<Icon20ArticleOutline />} textWrap="full">
                    {event.description}
                </MiniInfoCell>
            )}
            {event.department && event.department.length > 0 && (
                <MiniInfoCell before={<Icon20EducationOutline />} textWrap="full">
                    {TDepartmentName[event.department]}
                </MiniInfoCell>
            )}
        </Group>
    );
};
