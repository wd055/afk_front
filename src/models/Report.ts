import { getOffsetLimitQStr } from '../consts/limit';
import HttpRequests, { IResponseData, parseJson } from '../utils/requests';
import { IPagination } from './Other';

export interface IReport {
    id?: number;
    course: number;
    title: string;
}

export interface IReportPut {
    id?: number;
    course?: number;
    title?: string;
}

export interface IPaginationReport extends IPagination {
    results: Array<IReport>;
}

export interface IResponsePaginationReport extends IResponseData {
    json: IPaginationReport;
}

export interface IResponseReport extends IResponseData {
    json: IReport;
}

export class ReportModel {
    getReports(
        search?: string,
        course?: number,
        offset?: number,
        limit?: number
    ): Promise<IResponsePaginationReport> {
        return HttpRequests.get(
            `/report/?search=${search || ''}&course=${course || ''}&${getOffsetLimitQStr(offset, limit)}`
        ).then(parseJson);
    }
    getReport(reportId: number): Promise<IResponseReport> {
        return HttpRequests.get(`/report/${reportId}/`).then(parseJson);
    }
    deleteReport(reportId: number): Promise<IResponseReport> {
        return HttpRequests.delete(`/report/${reportId}/`).then(parseJson);
    }
    postReport(data: IReport): Promise<IResponseReport> {
        return HttpRequests.post(`/report/`, data).then(parseJson);
    }
    putReport(reportId: number, data: IReportPut): Promise<IResponseReport> {
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
