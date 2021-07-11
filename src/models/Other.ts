import HttpRequests, { IResponseData, parseJson } from '../utils/requests';
import { IEvent, parseDateResponseEvents } from './Event';

export interface IPagination {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<any>;
}

export interface IPaginationResponseData extends IResponseData {
    json: IPagination;
}

export interface IResponseGetAdminList extends IResponseData {
    json: Array<number>;
}

export interface IResponseGetStudentsEvents extends IResponseData {
    json: Array<IEvent>;
}

export class OtherModel {
    getAdminList(): Promise<IResponseGetAdminList> {
        return HttpRequests.get('/get_admin_list').then(parseJson);
    }
    getStudentsEvents(studentId?: number): Promise<IResponseGetStudentsEvents> {
        return HttpRequests.get(`/get_students_events/&student=${studentId || ''}`)
            .then(parseJson)
            .then(parseDateResponseEvents);
    }
    getUrl(url: string): Promise<IResponseData> {
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
