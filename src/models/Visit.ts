import { TAuthOrder } from '../consts/events';
import { getOffsetLimitQStr } from '../consts/limit';
import HttpRequests, { IResponseData, parseJson } from '../utils/requests';
import { IPagination } from './Other';

export interface IVisitsEvent {
    title: string;
    start: Date;
    end: Date;
    address?: string;
    description?: string;
}

export interface IVisitsStudent {
    full_name?: string;
    id?: number;
    vk_id?: string;
    login?: string;
    login_eng?: string;
    name?: string;
    surname?: string;
    second_name?: string;
    group?: string;
    birthday?: string;
    phone?: string;
    email?: string;
    department?: string;
    teacher?: string;
}

export interface IVisit {
    url?: string;
    id?: number;
    student: number;
    event: number;
    auth_order: TAuthOrder;
    date?: Date;
    student_data: IVisitsStudent;
    event_data: IVisitsEvent;
}

export interface IPaginationVisit extends IPagination {
    results: Array<IVisit>;
}

export interface IResponsePaginationVisit extends IResponseData {
    json: IPaginationVisit;
}

export const parseDateVisit = (visit: IVisit): IVisit => {
    visit.date = new Date(visit.date as Date);
    visit.event_data.start = new Date(visit.event_data.start as Date);
    visit.event_data.end = new Date(visit.event_data.end as Date);
    return visit;
};

export const parseDateVisitArray = (visits: IVisit[]): IVisit[] => {
    return visits.map(parseDateVisit);
};

export const parseDateResponsePaginationVisit = (
    response: IResponsePaginationVisit
): IResponsePaginationVisit => {
    if (response.ok) {
        response.json.results = parseDateVisitArray(response.json.results);
    }
    return response;
};

export class VisitModel {
    getVisits(searchObj?: {
        event?: number;
        student?: number;
        search?: string;
        offset?: number;
        limit?: number;
    }): Promise<IResponsePaginationVisit> {
        return HttpRequests.get(
            `/visit/?event=${searchObj?.event || ''}&student=${searchObj?.student || ''}&search=${
                searchObj?.search || ''
            }&${getOffsetLimitQStr(searchObj?.offset, searchObj?.limit)}`
        )
            .then(parseJson)
            .then(parseDateResponsePaginationVisit);
    }
}

class VisitModelInstance {
    static instance: VisitModel | null = null;

    static getInstance(): VisitModel {
        if (!VisitModelInstance.instance) {
            VisitModelInstance.instance = new VisitModel();
        }

        return VisitModelInstance.instance;
    }
}

export default VisitModelInstance.getInstance();
