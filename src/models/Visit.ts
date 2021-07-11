import { TAuthOrder } from '../consts/events';
import HttpRequests, { IResponseData, parseJson } from '../utils/requests';
import { IPagination } from './Other';

export interface IVisitsEvent {
    title: string;
    start: string;
    end: string;
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
    date?: string;
    student_data: IVisitsStudent;
    event_data: IVisitsEvent;
}

export interface IPaginationVisit extends IPagination {
    results: Array<IVisit>;
}

export interface IResponsePaginationVisit extends IResponseData {
    json: IPaginationVisit;
}

export class VisitModel {
    getVisit(searchObj?: {
        event?: number;
        student?: number;
        search?: string;
        page?: number;
    }): Promise<IResponsePaginationVisit> {
        return HttpRequests.get(
            `/visit/?event=${searchObj?.event || ''}&student=${searchObj?.student || ''}&search=${
                searchObj?.search || ''
            }&page=${searchObj?.page || 1}`
        ).then(parseJson);
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
