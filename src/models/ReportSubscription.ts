import HttpRequests, { IResponseData, parseJson } from '../utils/requests';
import { IPagination } from './Other';

export interface IReportSubs {
    id?: number;
    student: number;
    report: number;
    report_title?: string;
    date: Date;
}

interface IReportSubsRequest {
    student: number;
    report: number;
}

export interface IPaginationReportSubs extends IPagination {
    results: Array<IReportSubs>;
}

export interface IResponsePaginationReportSubs extends IResponseData {
    json: IPaginationReportSubs;
}

export interface IResponseReportSubs extends IResponseData {
    json: IReportSubs;
}

const parseDate = (reportSubs: IReportSubs): IReportSubs => {
    reportSubs.date = new Date(reportSubs.date);
    return reportSubs;
};

const parseDateResponseSubscriptions = (
    resposne: IResponsePaginationReportSubs
): IResponsePaginationReportSubs => {
    resposne.json.results = resposne.json.results.map(parseDate);
    return resposne;
};

const parseDateResponseSubscription = (resposne: IResponseReportSubs): IResponseReportSubs => {
    resposne.json = parseDate(resposne.json);
    return resposne;
};

export class ReportSubsModel {
    getReportSubses(searchObj?: {
        student?: number;
        report?: number;
    }): Promise<IResponsePaginationReportSubs> {
        return HttpRequests.get(
            `/reportsubscription/?student=${searchObj?.student || ''}&report=${
                searchObj?.report || ''
            }&limit=${100}`
        )
            .then(parseJson)
            .then(parseDateResponseSubscriptions);
    }
    getReportSubs(ReportSubsId: number): Promise<IResponseReportSubs> {
        return HttpRequests.get(`/reportsubscription/${ReportSubsId}`)
            .then(parseJson)
            .then(parseDateResponseSubscription);
    }
    postReportSubs(data: IReportSubsRequest): Promise<IResponseReportSubs> {
        return HttpRequests.post(`/reportsubscription/`, data).then(parseJson);
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
