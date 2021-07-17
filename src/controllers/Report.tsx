import { Alert } from '@vkontakte/vkui';
import React from 'react';
import { EGoBack, ESetPopout } from '../App';
import ReportModel, { Report, ReportPut, ResponseReport } from '../models/Report';
import ReportSubsModel, { ResponsePaginationReportSubs } from '../models/ReportSubscription';
import StudentModel from '../models/Student';
import { callSnackbar, catchSnackbar } from '../panels/style';

export class ReportController {
    postReport(obj: ReportPut): Promise<void> {
        return ReportModel.postReport(obj)
            .then((response: ResponseReport) => {
                if (response.ok) {
                    callSnackbar({});
                    EGoBack();
                } else {
                    callSnackbar({ success: false });
                }
            })
            .catch(catchSnackbar);
    }

    putReport(id: number, obj: ReportPut): Promise<void> {
        return ReportModel.putReport(id, obj)
            .then((response: ResponseReport) => {
                if (response.ok) {
                    callSnackbar({});
                    EGoBack();
                } else {
                    callSnackbar({ success: false });
                }
            })
            .catch(catchSnackbar);
    }

    deleteReportRequest(id: number, onDelete?: Function): Promise<void> {
        return ReportModel.deleteReport(id)
            .then((response: ResponseReport) => {
                if (response.ok) {
                    if (onDelete) onDelete();
                    callSnackbar({});
                } else {
                    callSnackbar({ success: false });
                }
            })
            .catch(catchSnackbar);
    }

    deleteReport(report: Report, onDelete?: Function): void {
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
                        action: (): Promise<void> => this.deleteReportRequest(report.id as number, onDelete)
                    }
                ]}
                actionsLayout="horizontal"
                onClose={(): void => ESetPopout(null)}
                header="Удаление темы"
                text={`Вы уверены, что хотите удалить тему: "${report.title}"? Будут удалены выборы этой темы у всех студентов, кто её брал!`}
            />
        );
    }

    postReportSubsRequest(reportId: number): Promise<void> {
        return ReportSubsModel.postReportSubs({
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

    postReportSubs(report: Report): void {
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
                        action: (): Promise<void> => this.postReportSubsRequest(report.id as number)
                    }
                ]}
                actionsLayout="horizontal"
                onClose={(): void => ESetPopout(null)}
                header="Выбор реферата"
                text={`Вы уверены, что хотите выбрать тему: "${report.title}"? Изменить выбор потом будет невозможно!`}
            />
        );
    }

    getUsersReportsSubs(studentId: number, setUsersReportsSubs: Function): Promise<void> {
        return ReportSubsModel.getReportSubses({
            student: studentId
        })
            .then((response: ResponsePaginationReportSubs) => {
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
