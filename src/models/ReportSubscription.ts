import HttpRequests, { ResponseData, parseJson } from '../utils/requests';
import { Pagination } from './Other';
import { Student } from './Student';

export interface ReportSubs {
    id?: number;
    student: number | Student;
    report: number;
    report_title?: string;
    date: Date;
}

interface ReportSubsRequest {
    student: number | Student;
    report: number;
}

export interface PaginationReportSubs extends Pagination {
    results: Array<ReportSubs>;
}

export interface ResponsePaginationReportSubs extends ResponseData {
    json: PaginationReportSubs;
}

export interface ResponseReportSubs extends ResponseData {
    json: ReportSubs;
}

const parseDate = (reportSubs: ReportSubs): ReportSubs => {
    reportSubs.date = new Date(reportSubs.date);

    if ((reportSubs.student as Student).student) {
        (reportSubs.student as Student).id = (reportSubs.student as Student).student || (reportSubs.student as Student).id;
    }
    return reportSubs;
};

const parseDateResponseSubscriptions = (
    resposne: ResponsePaginationReportSubs
): ResponsePaginationReportSubs => {
    resposne.json.results = resposne.json.results.map(parseDate);
    return resposne;
};

const parseDateResponseSubscription = (resposne: ResponseReportSubs): ResponseReportSubs => {
    resposne.json = parseDate(resposne.json);
    return resposne;
};

export class ReportSubsModel {
    currentReportSubs: ReportSubs | null = null;

    getReportSubses(searchObj?: {
        student?: number;
        report?: number;
    }): Promise<ResponsePaginationReportSubs> {
        return HttpRequests.get(
            `/reportsubscription/?student=${searchObj?.student || ''}&report=${
                searchObj?.report || ''
            }&limit=${100}`
        )
            .then(parseJson)
            .then(parseDateResponseSubscriptions);
    }
    getReportSubs(ReportSubsId: number): Promise<ResponseReportSubs> {
        return HttpRequests.get(`/reportsubscription/${ReportSubsId}`)
            .then(parseJson)
            .then(parseDateResponseSubscription);
    }
    deleteReportSubs(ReportSubsId: number): Promise<ResponseData> {
        return HttpRequests.delete(`/reportsubscription/${ReportSubsId}/`).then(parseJson);
    }
    postReportSubs(data: ReportSubsRequest): Promise<ResponseReportSubs> {
        return HttpRequests.post('/reportsubscription/', data).then(parseJson);
    }
}

class ReportSubsModelInstance {
    static instance: ReportSubsModel | null = null;

    static getInstance(): ReportSubsModel {
        if (!ReportSubsModelInstance.instance) {
            ReportSubsModelInstance.instance = new ReportSubsModel();
        }

        return ReportSubsModelInstance.instance;
    }
}

export default ReportSubsModelInstance.getInstance();
