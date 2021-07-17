import HttpRequests, { ResponseData, parseJson } from '../utils/requests';
import { Event, parseDateResponseEvents } from './Event';

export interface Pagination {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<any>;
}

export interface PaginationResponseData extends ResponseData {
    json: Pagination;
}

export interface ResponseGetAdminList extends ResponseData {
    json: Array<number>;
}

export interface ResponseGetStudentsEvents extends ResponseData {
    json: Array<Event>;
}

export class OtherModel {
    getAdminList(): Promise<ResponseGetAdminList> {
        return HttpRequests.get('/get_admin_list').then(parseJson);
    }
    getStudentsEvents(studentId?: number): Promise<ResponseGetStudentsEvents> {
        return HttpRequests.get(`/get_students_events/&student=${studentId || ''}`)
            .then(parseJson)
            .then(parseDateResponseEvents);
    }
    getUrl(url: string): Promise<ResponseData> {
        return HttpRequests.get(url).then(parseJson);
    }
}

class OtherModelInstance {
    static instance: OtherModel | null = null;

    static getInstance(): OtherModel {
        if (!OtherModelInstance.instance) {
            OtherModelInstance.instance = new OtherModel();
        }

        return OtherModelInstance.instance;
    }
}

export default OtherModelInstance.getInstance();
