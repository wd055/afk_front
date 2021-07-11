import React, { FunctionComponent } from 'react';
import { Group, MiniInfoCell } from '@vkontakte/vkui';
import { Icon20PlaceOutline, Icon20ArticleOutline, Icon16ClockOurline } from '@vkontakte/icons';
import { eventTypesIcons } from '../../consts/events';
import { IEvent } from '../../models/Event';
import { getDateTitle } from '../../utils/date';

type EventInfoProps = {
    event: IEvent;
};

export const EventInfo: FunctionComponent<EventInfoProps> = ({ event }, props) => {
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
            {event.start && event.end && (
                <MiniInfoCell before={<Icon16ClockOurline />} textWrap="full">
                    {getDateTitle(new Date(event.start), new Date(event.end))}
                </MiniInfoCell>
            )}
            {event.description && event.description.length > 0 && (
                <MiniInfoCell before={<Icon20ArticleOutline />} textWrap="full">
                    {event.description}
                </MiniInfoCell>
            )}
        </Group>
    );
};

export type EventItem = {
    id: Number;
    title: String;
    auth_type: String;
    start: String;
    end: String;
};
