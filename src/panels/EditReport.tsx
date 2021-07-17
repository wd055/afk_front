import {
    Button,
    Div,
    Footer,
    FormItem,
    Group,
    Input,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    RichCell,
    Tabs,
    TabsItem
} from '@vkontakte/vkui';
import React, { useEffect, useState } from 'react';
import { EGo, EGoBack } from '../App';
import { UnpinReportSubs } from '../components/UnpinReportSubs/UnpinReportSubs';
import ReportController from '../controllers/Report';
import { Report } from '../models/Report';
import ReportSubsModel, { ReportSubs } from '../models/ReportSubscription';
import StudentModel, { Student } from '../models/Student';
import { callSnackbar, catchSnackbar } from './style';

interface EditReportPanelProps {
    id: string;
    report?: Report | null;
    onSave?: Function;
    onDelete?: Function;
}

export const EditReportPanel = ({ id, report, onSave, onDelete }: EditReportPanelProps): JSX.Element => {
    const [reportTmp, setReportTmp] = useState<Report>({
        course: 0,
        title: '',
        ...report
    });
    const [reportsSubs, setReportsSubs] = useState<ReportSubs[]>([]);

    const getReportsSubs = (reportId: number): Promise<void> => {
        return ReportSubsModel.getReportSubses({ report: reportId })
            .then((response) => {
                if (!response.ok) {
                    callSnackbar({ success: false, statusCodeForText: response.status });
                    return;
                }

                setReportsSubs(response.json.results);
            })
            .catch(() => {
                catchSnackbar();
            });
    };

    useEffect(() => {
        if (report?.id) {
            getReportsSubs(report.id);
        }
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={(): void => EGoBack()} />}>
                Редактирование реферата
            </PanelHeader>
            <Group>
                <FormItem
                    status={reportTmp.course > 0 ? 'valid' : 'error'}
                    bottom={reportTmp.course > 0 ? '' : 'Выберите курс'}
                >
                    <Tabs mode="buttons">
                        {[1, 2, 3].map((item: number) => {
                            return (
                                <TabsItem
                                    key={item}
                                    onClick={(): void => setReportTmp({ ...reportTmp, course: item })}
                                    selected={item === reportTmp.course}
                                >
                                    {item}
                                </TabsItem>
                            );
                        })}
                    </Tabs>
                </FormItem>
                <FormItem status={reportTmp.title.length > 0 ? 'valid' : 'error'}>
                    <Input
                        type="text"
                        defaultValue={reportTmp.title}
                        onChange={(e): void =>
                            setReportTmp({ ...reportTmp, title: e.target.value.trim().replaceAll('  ', ' ') })
                        }
                    />
                </FormItem>
                <Div style={{ display: 'flex' }}>
                    <Button
                        size="l"
                        stretched
                        disabled={reportTmp.course <= 0 || reportTmp.title.length === 0}
                        onClick={(): void => {
                            if (onSave !== undefined) onSave(reportTmp);
                            if (!report) {
                                ReportController.postReport(reportTmp);
                            } else {
                                ReportController.putReport(reportTmp.id as number, reportTmp);
                            }
                        }}
                    >
                        {!report ? 'Добавить тему' : 'Сохранить изменения'}
                    </Button>
                    {reportTmp && reportTmp.id && (
                        <Button
                            size="l"
                            mode="destructive"
                            style={{ marginLeft: 8 }}
                            onClick={(): void => {
                                if (onDelete !== undefined) onDelete(reportTmp);
                                if (reportTmp.id) {
                                    ReportController.deleteReport(reportTmp, () => {
                                        EGoBack();
                                    });
                                }
                            }}
                        >
                            Удалить
                        </Button>
                    )}
                </Div>
            </Group>
            <Group>
                {reportsSubs.length === 0 && <Footer>Темы ни разу не выбиралась</Footer>}
                {reportsSubs.map((item: ReportSubs, i: number) => {
                    const student = item.student as Student;
                    return (
                        <RichCell
                            disabled
                            key={student.student}
                            onClick={(): void => {
                                StudentModel.currentStudent = student;
                                EGo('studentInfo');
                            }}
                            after={
                                <UnpinReportSubs
                                    reportSubs={item}
                                    OnUnpin={(): void => {
                                        reportsSubs.splice(i, 1);
                                        setReportsSubs(reportsSubs);
                                    }}
                                />
                            }
                        >
                            {student.full_name}
                        </RichCell>
                    );
                })}
            </Group>
        </Panel>
    );
};
