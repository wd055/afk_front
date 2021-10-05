import { TAuth, TAuthOrder, TDepartment, TEvent } from '../consts/events';
import { getOffsetLimitQStr } from '../consts/limit';
import { dateToString, getDateForRequest } from '../utils/date';
import HttpRequests, { ResponseData, parseJson } from '../utils/requests';
import { ResponsePaginationStudent, ResponseStudent } from './Student';

export type TEventDate = string | Date;

export interface Event {
    id?: number;
    title: string;
    start: Date;
    end: Date;
    auth_type: TAuth;
    favorite?: boolean;
    eventType: TEvent;
    address?: string;
    description?: string;
    department?: TDepartment;
}

interface EventRequest {
    id?: number;
    title: string;
    start: string;
    end: string;
    auth_type: TAuth;
    favorite?: boolean;
    eventType: TEvent;
    address?: string;
    description?: string;
    department?: TDepartment;
}

export interface ResponseEvent extends ResponseData {
    json: Event;
}

export interface ResponseEvents extends ResponseData {
    json: Event[];
}

export interface SetVisit {
    student_vk_id: number;
    auth_order: TAuthOrder;
}

export const parseDateEvent = (event: Event): Event => {
    event.start = new Date(event.start);
    event.end = new Date(event.end);
    return event;
};

export const parseDateEventArray = (events: Event[]): Event[] => {
    return events.map(parseDateEvent);
};

export const parseDateResponseEvent = (response: ResponseEvent): ResponseData => {
    if (response.ok) {
        response.json = parseDateEvent(response.json);
    }
    return response;
};

export const parseDateResponseEvents = (response: ResponseEvents): ResponseData => {
    if (response.ok) {
        response.json = response.json.map((item: Event): Event => parseDateEvent(item));
    }
    return response;
};

export const parseDateResponsePaginationEvent = (
    response: ResponseEvents
): ResponseEvents => {
    if (response.ok) {
        response.json = parseDateEventArray(response.json);
    }
    return response;
};

export class EventModel {
    currentEvent: Event | null = null;

    getEvents(
        time?: { start?: string | Date; end?: string | Date },
        page?: number,
        department?: TDepartment
    ): Promise<ResponseEvents> {
        let start = '',
            end = '';
        if (time?.start) {
            start = getDateForRequest(new Date(time.start));
        }
        if (time?.end) {
            end = getDateForRequest(new Date(time.end));
        }
        return HttpRequests.get(`/event/?start=${start}&end=${end}&page=${page || 1}&department=${department || ''}`)
            .then(parseJson)
            .then(parseDateResponsePaginationEvent);
    }
    getFavorite(): Promise<ResponseEvents> {
        return HttpRequests.get('/event/get_favorite').then(parseJson).then(parseDateResponseEvents);
    }
    getEvent(id: number): Promise<ResponseEvent> {
        return HttpRequests.get(`/event/${id}`).then(parseJson).then(parseDateResponseEvent);
    }
    deleteEvent(id: number): Promise<ResponseData> {
        return HttpRequests.delete(`/event/${id}`).then(parseJson);
    }
    postEvent(event: Event): Promise<ResponseEvent> {
        const eventRequest: EventRequest = {
            ...event,
            start: dateToString(event.start),
            end: dateToString(event.end)
        };
        return HttpRequests.post('/event/', eventRequest).then(parseJson).then(parseDateResponseEvent);
    }
    putEvent(id: number, event: Event): Promise<ResponseEvent> {
        const eventRequest: EventRequest = {
            ...event,
            start: dateToString(event.start),
            end: dateToString(event.end)
        };
        return HttpRequests.put(`/event/${id}`, eventRequest).then(parseJson).then(parseDateResponseEvent);
    }
    sendReportEvent(id: number, authOrder?: TAuthOrder): Promise<ResponseEvent> {
        return HttpRequests.post(`/event/${id}/send_report/?auth_order=${authOrder}`)
            .then(parseJson);
    }
    searchNewStudentsEvent(id: number, search?: string, offset?: number, limit?: number): Promise<ResponsePaginationStudent> {
        return HttpRequests.get(`/event/${id}/search_new_students/?search=${search}&${getOffsetLimitQStr(offset, limit)}`).then(
            parseJson
        );
    }
    setVisitEvent(id: number, obj: SetVisit): Promise<ResponseStudent> {
        return HttpRequests.post(`/event/${id}/set_visit/`, obj).then(parseJson);
    }
}

class EventModelInstance {
    static instance: EventModel | null = null;

    static getInstance(): EventModel {
        if (!EventModelInstance.instance) {
            EventModelInstance.instance = new EventModel();
        }

        return EventModelInstance.instance;
    }
}

export default EventModelInstance.getInstance();
