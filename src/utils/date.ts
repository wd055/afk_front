import { Event } from '../models/Event';

export function getDayOfWeek(date: Date): number {
    if (!date) date = new Date();
    return date.getDay() === 0 ? 6 : date.getDay() - 1;
}

export function getDateForRequest(date: Date): string {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}
export const optionsFull: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
};

export const optionsShort: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
};

export function getDateTitle(date: Date): string {
    return date.toLocaleDateString('ru-RU', optionsFull);
}

export function getDatesTitle(start: Date, end: Date): string {
    return (
        start.toLocaleDateString('ru-RU', optionsFull) +
        ' - ' +
        end.toLocaleTimeString('ru-RU', optionsShort)
    );
}

export function getHoursAndMinutes(time: Date): string {
    return time.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function splitInputTime(value: string): { hour: number; minute: number } {
    return {
        hour: Number(value.split(':')[0]),
        minute: Number(value.split(':')[1])
    };
}

export function setHoursAndMinutes(
    date: Date,
    time: { hour: string | number; minute: string | number }
): Date {
    const newDate = new Date(date);
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

export function formsEventIsValid(formsEvent: Event): boolean {
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

export type checkPeriodType = 'all' | 'currentSemestr' | 'currentAcademicYear';
export const checkPeriodArray: checkPeriodType[] = ['all', 'currentSemestr', 'currentAcademicYear'];
export const checkPeriodObject = {
    all: 'Весь',
    currentSemestr: 'Семестр',
    currentAcademicYear: 'Учебный год'
};

export const checkPeriodCurrentSemestr = (date: Date): boolean => {
    let startMonth = 0,
        endMonth = 6;

    if (new Date().getMonth() >= 7) {
        startMonth = 7;
        endMonth = 11;
    }

    const begin = new Date(new Date().getFullYear(), startMonth);
    const end = new Date(new Date().getFullYear(), endMonth, 31);
    return date >= begin && date <= end;
};

export const checkPeriodCurrentAcademicYear = (date: Date): boolean => {
    if (new Date().getMonth() >= 7) {
        return (
            (date.getFullYear() === new Date().getFullYear() && date.getMonth() >= 6)
        );
    }

    return (
        (date.getFullYear() === new Date().getFullYear() - 1 && date.getMonth() >= 7) ||
        (date.getFullYear() === new Date().getFullYear() && date.getMonth() <= 6)
    );
};
