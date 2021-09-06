import { TAuthOrder } from '../consts/events';
import { getOffsetLimitQStr } from '../consts/limit';
import HttpRequests, { ResponseData, parseJson } from '../utils/requests';
import { Pagination } from './Other';

export interface VisitsEvent {
    title: string;
    start: Date;
    end: Date;
    address?: string;
    description?: string;
}

export interface VisitsStudent {
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

export interface Visit {
    url?: string;
    id?: number;
    student: number;
    teacher: string;
    event: number;
    auth_order: TAuthOrder;
    date?: Date;
    student_data: VisitsStudent;
    event_data: VisitsEvent;
}

export interface PaginationVisit extends Pagination {
    results: Array<Visit>;
}

export interface ResponsePaginationVisit extends ResponseData {
    json: PaginationVisit;
}

export const parseDateVisit = (visit: Visit): Visit => {
    visit.date = new Date(visit.date as Date);
    visit.event_data.start = new Date(visit.event_data.start as Date);
    visit.event_data.end = new Date(visit.event_data.end as Date);
    return visit;
};

export const parseDateVisitArray = (visits: Visit[]): Visit[] => {
    return visits.map(parseDateVisit);
};

export const parseDateResponsePaginationVisit = (
    response: ResponsePaginationVisit
): ResponsePaginationVisit => {
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
    }): Promise<ResponsePaginationVisit> {
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
