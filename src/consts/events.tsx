import {
    Icon28SchoolOutline,
    Icon28Users3Outline,
    Icon28MasksOutline,
    Icon28SunOutline
} from '@vkontakte/icons';
import React, { ReactChild } from 'react';

export type TAuth = 'double' | 'single';
export const TAuthArray = ['double', 'single'];
export const TAuthName = {
    double: 'Двойной',
    single: 'Одинарный'
};

export type TAuthOrder = 'initial' | 'final' | 'final_anyway';
export const TAuthOrderArray = ['initial', 'final', 'final_anyway'];
export const TAuthOrderName = {
    initial: 'Начальная',
    final: 'Конечная',
    final_anyway: 'Принудительная конечная'
};

export type TDepartment = 'afk' | 'fv' | '';
export const TDepartmentArray: TDepartment[] = ['afk', 'fv', ''];
export const TDepartmentName = {
    afk: 'АФК',
    fv: 'ФВ',
    '': 'Обе'
};

export type TEvent = 'open_air' | 'lecture' | 'culture' | 'volunteering' | 'other';
export const TEventArray = ['open_air', 'lecture', 'culture', 'volunteering', 'other'];
export const TEventName = {
    open_air: 'Занятия на свежем воздухе',
    lecture: 'Лекции',
    culture: 'Культурные мероприятия',
    volunteering: 'Волонтерская деятельность',
    other: 'Другое'
};

export const eventTypesIcons = {
    open_air: <Icon28SunOutline fill="var(--accent)" />,
    lecture: <Icon28SchoolOutline fill="var(--accent)" />,
    culture: <Icon28MasksOutline fill="var(--accent)" />,
    volunteering: <Icon28Users3Outline fill="var(--accent)" />,
    other: <></>
};

type customSelectType = {
    value: TEvent | TDepartment;
    label: string;
    icon: ReactChild;
}[];

export const eventTypes: customSelectType = [
    {
        value: 'open_air',
        label: 'Занятия на свежем воздухе',
        icon: eventTypesIcons.open_air
    },
    {
        value: 'lecture',
        label: 'Лекции',
        icon: eventTypesIcons.lecture
    },
    {
        value: 'culture',
        label: 'Культурные мероприятия',
        icon: eventTypesIcons.culture
    },
    {
        value: 'volunteering',
        label: 'Волонтерская деятельност',
        icon: eventTypesIcons.volunteering
    },
    { value: 'other', label: 'Другое', icon: eventTypesIcons.other }
];

export const departmentSelect: customSelectType = [
    {
        value: 'afk',
        label: 'АФК',
        icon: eventTypesIcons.other
    },
    {
        value: 'fv',
        label: 'ФВ',
        icon: eventTypesIcons.other
    },
    {
        value: '',
        label: 'Обе',
        icon: eventTypesIcons.other
    }
];
