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
import { IReport } from '../models/Report';
import ReportSubsModel, { IReportSubs } from '../models/ReportSubscription';
import StudentModel, { IResponseStudent, IStudent } from '../models/Student';
import { callSnackbar, catchSnackbar } from './style';

interface EditReportPanelProps {
    id: string;
    report?: IReport | null;
    onSave?: Function;
    onDelete?: Function;
}
interface ISubsStudents {
    student: IStudent;
    report: number;
}

export const EditReportPanel = ({ id, report, onSave, onDelete }: EditReportPanelProps) => {
    const [reportTmp, setReportTmp] = useState<IReport>({
        course: 0,
        title: '',
        ...report
    });
    const [reportsSubs, setReportsSubs] = useState<IReportSubs[]>([]);
    const [subsStudents, setSubsStudents] = useState<ISubsStudents[]>([]);

    const getReportsSubs = (reportId: number) => {
        return ReportSubsModel.getReportSubses({ report: reportId })
            .then((response) => {
                if (!response.ok) {
                    callSnackbar({ success: false, statusCodeForText: response.status });
                    return;
                }

                setReportsSubs(response.json.results);
                response.json.results.forEach((item: IReportSubs) => {
                    StudentModel.getStudent(item.student)
                        .then((studentReponse: IResponseStudent) => {
                            if (response.ok) {
                                setSubsStudents([
                                    ...subsStudents,
                                    {
                                        student: studentReponse.json,
                                        report: item.id || 0
                                    }
                                ]);
                            }
                        })
                        .catch(catchSnackbar);
                });
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
            <PanelHeader left={<PanelHeaderBack onClick={() => EGoBack()} />}>
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
                                    onClick={() => setReportTmp({ ...reportTmp, course: item })}
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
                        onChange={(e) =>
                            setReportTmp({ ...reportTmp, title: e.target.value.trim().replaceAll('  ', ' ') })
                        }
                    />
                </FormItem>
                <Div style={{ display: 'flex' }}>
                    <Button
                        size="l"
                        stretched
                        disabled={reportTmp.course <= 0 || reportTmp.title.length === 0}
                        onClick={(e) => {
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
                            onClick={() => {
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
                {reportsSubs.map((item: IReportSubs, i: number) => {
                    const filteringStudents: ISubsStudents[] = subsStudents.filter(
                        (studentsItem: ISubsStudents) => studentsItem.report === item.id
                    );
                    if (filteringStudents.length > 0) {
                        const student: IStudent = filteringStudents[0].student;

                        return (
                            <RichCell
                                disabled
                                key={item.student}
                                onClick={() => {
                                    StudentModel.currentStudent = student;
                                    EGo('studentInfo');
                                }}
                                after={
                                    <UnpinReportSubs
                                        reportSubs={item}
                                        OnUnpin={() => {
                                            reportsSubs.splice(i, 1);
                                            setReportsSubs(reportsSubs);
                                        }}
                                    />
                                }
                            >
                                {student.full_name}
                            </RichCell>
                        );
                    }
                    return (
                        <RichCell after={<UnpinReportSubs reportSubs={item} />} key={item.student}>
                            Загрузка...
                        </RichCell>
                    );
                })}
            </Group>
        </Panel>
    );
};
