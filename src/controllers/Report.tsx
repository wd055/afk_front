import { Alert } from '@vkontakte/vkui';
import React from 'react';
import { EGoBack, ESetPopout } from '../App';
import ReportModel, { IReport, IReportPut, IResponseReport } from '../models/Report';
import ReportSubsModel, { IReportSubs, IResponsePaginationReportSubs } from '../models/ReportSubscription';
import StudentModel from '../models/Student';
import { callSnackbar, catchSnackbar } from '../panels/style';

export class ReportController {
    postReport(title: string, course: number): void {
        ReportModel.postReport({ title, course })
            .then((response: IResponseReport) => {
                if (response.ok) {
                    callSnackbar({});
                } else {
                    callSnackbar({ success: false });
                }
            })
            .catch(catchSnackbar);
    }

    putReport(id: number, obj: IReportPut): void {
        ReportModel.putReport(id, obj)
            .then((response: IResponseReport) => {
                if (response.ok) {
                    callSnackbar({});
                } else {
                    callSnackbar({ success: false });
                }
            })
            .catch(catchSnackbar);
    }

    deleteReportRequest(id: number, onDelete?: Function): void {
        ReportModel.deleteReport(id)
            .then((response: IResponseReport) => {
                if (response.ok) {
                    if (onDelete) onDelete();
                    callSnackbar({});
                } else {
                    callSnackbar({ success: false });
                }
            })
            .catch(catchSnackbar);
    }

    deleteReport(report: IReport, onDelete?: Function): void {
        ESetPopout(
            <Alert
                actions={[
                    {
                        title: 'Отмена',
                        autoclose: true,
                        mode: 'cancel'
                    },
                    {
                        title: 'Удалить',
                        autoclose: true,
                        mode: 'destructive',
                        action: () => this.deleteReportRequest(report.id as number, onDelete)
                    }
                ]}
                actionsLayout="horizontal"
                onClose={() => ESetPopout(null)}
                header="Удаление темы"
                text={`Вы уверены, что хотите удалить тему: "${report.title}"? Будут удалены выборы этой темы у всех студентов, кто её брал!`}
            />
        );
    }

    postReportSubsRequest(reportId: number): void {
        ReportSubsModel.postReportSubs({
            student: StudentModel.thisStudent?.id as number,
            report: reportId
        })
            .then((data) => {
                if (data.ok) {
                    callSnackbar({});
                    EGoBack();
                } else {
                    callSnackbar({ success: false, statusCodeForText: data.status });
                }
            })
            .catch(() => {
                callSnackbar({ success: false, text: 'Ошибка запроса!' });
            });
    }

    postReportSubs(report: IReport): void {
        ESetPopout(
            <Alert
                actions={[
                    {
                        title: 'Отмена',
                        autoclose: true,
                        mode: 'cancel'
                    },
                    {
                        title: 'Выбрать',
                        autoclose: true,
                        mode: 'destructive',
                        action: () => this.postReportSubsRequest(report.id as number)
                    }
                ]}
                actionsLayout="horizontal"
                onClose={() => ESetPopout(null)}
                header="Выбор реферата"
                text={`Вы уверены, что хотите выбрать тему: "${report.title}"? Изменить выбор потом будет невозможно!`}
            />
        );
    }

    getUsersReportsSubs(studentId: number, setUsersReportsSubs: Function) {
        ReportSubsModel.getReportSubses({
            student: studentId
        })
            .then((response: IResponsePaginationReportSubs) => {
                if (response.ok) {
                    setUsersReportsSubs(response.json.results);
                }
            })
            .catch();
    }
}

class ReportControllerInstance {
    static instance: ReportController | null = null;

    static getInstance(): ReportController {
        if (!ReportControllerInstance.instance) {
            ReportControllerInstance.instance = new ReportController();
        }

        return ReportControllerInstance.instance;
    }
}

export default ReportControllerInstance.getInstance();
