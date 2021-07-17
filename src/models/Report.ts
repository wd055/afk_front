import { getOffsetLimitQStr } from '../consts/limit';
import HttpRequests, { ResponseData, parseJson } from '../utils/requests';
import { Pagination } from './Other';

export interface Report {
    id?: number;
    course: number;
    title: string;
}

export interface ReportPut {
    id?: number;
    course?: number;
    title?: string;
}

export interface PaginationReport extends Pagination {
    results: Array<Report>;
}

export interface ResponsePaginationReport extends ResponseData {
    json: PaginationReport;
}

export interface ResponseReport extends ResponseData {
    json: Report;
}

export class ReportModel {
    currentReport: Report | null = null;

    getReports(
        searchObj: {
            search?: string;
            course?: number;
            showAll?: boolean;
        },
        offset?: number,
        limit?: number
    ): Promise<ResponsePaginationReport> {
        return HttpRequests.get(
            `/report/?search=${searchObj.search || ''}&course=${searchObj.course || ''}&${getOffsetLimitQStr(
                offset,
                limit
            )}${searchObj.showAll ? '&show_all' : ''}`
        ).then(parseJson);
    }
    getReport(reportId: number): Promise<ResponseReport> {
        return HttpRequests.get(`/report/${reportId}/`).then(parseJson);
    }
    deleteReport(reportId: number): Promise<ResponseReport> {
        return HttpRequests.delete(`/report/${reportId}/`).then(parseJson);
    }
    postReport(data: ReportPut): Promise<ResponseReport> {
        return HttpRequests.post('/report/', data).then(parseJson);
    }
    putReport(reportId: number, data: ReportPut): Promise<ResponseReport> {
        return HttpRequests.put(`/report/${reportId}/`, data).then(parseJson);
    }
}

class ReportModelInstance {
    static instance: ReportModel | null = null;

    static getInstance(): ReportModel {
        if (!ReportModelInstance.instance) {
            ReportModelInstance.instance = new ReportModel();
        }

        return ReportModelInstance.instance;
    }
}

export default ReportModelInstance.getInstance();
