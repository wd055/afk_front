import { IEvent } from '../models/Event';

export function getDayOfWeek(date: Date): number {
    if (!date) date = new Date();
    return date.getDay() === 0 ? 6 : date.getDay() - 1;
}

export function getDateForRequest(date: Date): string {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}
export const options_full: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
};

export const options_short: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
};

export function getDateTitle(start: Date, end: Date): string {
    return (
        start.toLocaleDateString('ru-RU', options_full) +
        ' - ' +
        end.toLocaleTimeString('ru-RU', options_short)
    );
}

export function getHoursAndMinutes(time: Date): string {
    return time.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function splitInputTime(value: string): { hour: number; minute: number } {
    let result = {
        hour: Number(value.split(':')[0]),
        minute: Number(value.split(':')[1])
    };
    return result;
}

export function setHoursAndMinutes(date: Date, time: {hour: string | number, minute: string | number}): Date {
    let newDate = new Date(date);
    newDate.setHours(Number(time.hour));
    newDate.setMinutes(Number(time.minute));
    return newDate;
}

export type IDateFormat = {
    day: number;
    month: number;
    year: number;
};

export function getEventDate(date: Date): IDateFormat {
    return {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
    };
}

export function eventDateComposition(eventDate: IDateFormat, date: Date): Date {
    return new Date(eventDate.year, eventDate.month - 1, eventDate.day, date.getHours(), date.getMinutes());
}

export const dateToString = (date: Date | string): string => {
    if (date instanceof Date) {
        return date.toISOString();
    }
    return date;
};

export function formsEventIsValid(formsEvent: IEvent): boolean {
    return (formsEvent.title &&
        formsEvent.title.length > 0 &&
        formsEvent.auth_type &&
        formsEvent.auth_type.length > 0 &&
        formsEvent.start &&
        formsEvent.end &&
        formsEvent.start > new Date(2020, 0, 1) &&
        formsEvent.end > new Date(2020, 0, 1) &&
        formsEvent.start < formsEvent.end) as boolean;
}
