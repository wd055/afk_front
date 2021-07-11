import { TAuth, TAuthOrder, TEvent } from '../consts/events';
import { dateToString, getDateForRequest } from '../utils/date';
import HttpRequests, { IResponseData, parseJson } from '../utils/requests';
import { IResponsePaginationStudent, IResponseStudent } from './Student';

export type TEventDate = string | Date;

export interface IEvent {
    id?: number;
    title: string;
    start: Date;
    end: Date;
    auth_type: TAuth;
    favorite?: boolean;
    eventType: TEvent;
    address?: string;
    description?: string;
}

interface IEventRequest {
    id?: number;
    title: string;
    start: string;
    end: string;
    auth_type: TAuth;
    favorite?: boolean;
    eventType: TEvent;
    address?: string;
    description?: string;
}

export interface IResponsePaginationEvent extends IResponseData {
    json: Array<IEvent>;
}

export interface IResponseEvent extends IResponseData {
    json: IEvent;
}

export interface IResponseEvents extends IResponseData {
    json: IEvent[];
}

export interface ISetVisit {
    student_vk_id: number;
    auth_order: TAuthOrder;
}

export const parseDateEvent = (event: IEvent): IEvent => {
    event.start = new Date(event.start);
    event.end = new Date(event.end);
    return event;
};

export const parseDateEventArray = (events: IEvent[]): IEvent[] => {
    return events.map(parseDateEvent);
};

export const parseDateResponseEvent = (response: IResponseEvent): IResponseData => {
    if (response.ok) {
        response.json = parseDateEvent(response.json);
    }
    return response;
};

export const parseDateResponseEvents = (response: IResponseEvents): IResponseData => {
    if (response.ok) {
        response.json = response.json.map((item: IEvent): IEvent => parseDateEvent(item));
    }
    return response;
};

export const parseDateResponsePaginationEvent = (
    response: IResponsePaginationEvent
): IResponsePaginationEvent => {
    if (response.ok) {
        response.json = parseDateEventArray(response.json);
    }
    return response;
};

export class EventModel {
    currentEvent: IEvent | null = null;

    getEvents(time?: { start?: string | Date; end?: string | Date }, page?: number): Promise<IResponsePaginationEvent> {
        let start = '',
            end = '';
        if (time?.start) {
            start = getDateForRequest(new Date(time.start));
        }
        if (time?.end) {
            end = getDateForRequest(new Date(time.end));
        }
        return HttpRequests.get(`/event/?start=${start}&end=${end}&page=${page || 1}`)
            .then(parseJson)
            .then(parseDateResponsePaginationEvent);
    }
    getEvent(id: number): Promise<IResponseEvent> {
        return HttpRequests.get(`/event/${id}`).then(parseJson).then(parseDateResponseEvent);
    }
    deleteEvent(id: number): Promise<IResponseData> {
        return HttpRequests.delete(`/event/${id}`).then(parseJson);
    }
    postEvent(event: IEvent): Promise<IResponseEvent> {
        const eventRequest: IEventRequest = {
            ...event,
            start: dateToString(event.start),
            end: dateToString(event.end)
        };
        return HttpRequests.post(`/event/`, eventRequest).then(parseJson).then(parseDateResponseEvent);
    }
    putEvent(id: number, event: IEvent): Promise<IResponseEvent> {
        const eventRequest: IEventRequest = {
            ...event,
            start: dateToString(event.start),
            end: dateToString(event.end)
        };
        return HttpRequests.put(`/event/${id}`, eventRequest).then(parseJson).then(parseDateResponseEvent);
    }
    sendReportEvent(id: number, authOrder?: TAuthOrder): Promise<IResponseEvent> {
        return HttpRequests.post(`/event/${id}/send_report/?auth_order=${authOrder}`)
            .then(parseJson)
            .then(parseDateResponseEvent);
    }
    searchNewStudentsEvent(id: number, search?: string, page?: number): Promise<IResponsePaginationStudent> {
        return HttpRequests.get(`/event/${id}/search_new_students/?search=${search}&page=${page || 1}`).then(parseJson);
    }
    setVisitEvent(id: number, obj: ISetVisit): Promise<IResponseStudent> {
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
