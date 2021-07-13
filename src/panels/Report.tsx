import {
    Alert,
    Cell,
    Group,
    Header,
    List,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    RichCell,
    Search,
    Tabs,
    TabsItem
} from '@vkontakte/vkui';
import React, { useEffect, useState } from 'react';
import { EGo, EGoBack, ESetPopout } from '../App';
import { InfiniteScroll } from '../components/InfiniteScroll/InfiniteScroll';
import ReportModel, { IReport } from '../models/Report';
import ReportSubsModel, { IReportSubs, IResponsePaginationReportSubs } from '../models/ReportSubscription';
import StudentModel from '../models/Student';
import { checkPeriodCurrentSemestr, getDateTitle } from '../utils/date';
import { callSnackbar, catchSnackbar } from './style';

interface ReportPanelProps {
    id: string;
}

export const ReportPanel = ({ id }: ReportPanelProps) => {
    const [reports, setReports] = useState<IReport[]>([]);
    const [usersReportsSubs, setUsersReportsSubs] = useState<IReportSubs[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [course, setCourse] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const getReports = (thisSearchValue?: string, thisCourse?: number, offset?: number, limit?: number) => {
        return ReportModel.getReports(thisSearchValue, thisCourse, offset, limit)
            .then((response) => {
                if (!response.ok) {
                    callSnackbar({ success: false, statusCodeForText: response.status });
                    return;
                }

                if (!response.json.next) {
                    setHasMore(false);
                }

                if (searchValue === thisSearchValue && course === thisCourse) {
                    setReports(reports.concat(response.json.results));
                } else {
                    setReports(response.json.results);
                }
            })
            .catch(() => {
                catchSnackbar();
            });
    };

    const getUsersReportsSubs = () => {
        ReportSubsModel.getReportSubses({
            student: StudentModel.thisStudent?.id
        })
            .then((response: IResponsePaginationReportSubs) => {
                if (response.ok) {
                    setUsersReportsSubs(response.json.results);
                }
            })
            .catch();
    };

    const postReportRequest = (reportId: number): void => {
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
    };

    const postReport = (report: IReport): void => {
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
                        action: () => postReportRequest(report.id as number)
                    }
                ]}
                actionsLayout="horizontal"
                onClose={() => ESetPopout(null)}
                header="Выбор реферата"
                text={`Вы уверены, что хотите выбрать тему: "${report.title}"? Изменить выбор потом будет невозможно!`}
            />
        );
    };

    useEffect(() => {
        getUsersReportsSubs();
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => EGoBack()} />}>Реферат</PanelHeader>
            {usersReportsSubs.length > 0 && (
                <Group header={<Header>Мои рефераты</Header>}>
                    <List>
                        {usersReportsSubs.map((item: IReportSubs) => {
                            return (
                                <RichCell disabled key={item.id} caption={`Взят ${getDateTitle(item.date)}`}>
                                    {item.report_title}
                                </RichCell>
                            );
                        })}
                    </List>
                </Group>
            )}

            {usersReportsSubs.filter((item: IReportSubs) => {
                return checkPeriodCurrentSemestr(item.date);
            }).length === 0 &&
                (course === 0 ? (
                    <Group header={<Header>Выберите курс перед выбором реферата!</Header>}>
                        <Tabs mode="buttons">
                            {[1, 2, 3].map((item: number) => {
                                return (
                                    <TabsItem
                                        key={item}
                                        onClick={() => {
                                            setCourse(item);
                                            getReports(searchValue, item);
                                        }}
                                    >
                                        {item}
                                    </TabsItem>
                                );
                            })}
                        </Tabs>
                    </Group>
                ) : (
                    <Group header={<Header>Выбор реферата</Header>}>
                        <Search
                            value={searchValue}
                            onChange={(e) => {
                                const { value } = e.currentTarget;
                                setSearchValue(value);
                                getReports(value, course);
                            }}
                            placeholder="Поиск"
                        />
                        <InfiniteScroll
                            next={getReports.bind(this, searchValue, course)}
                            hasMore={hasMore}
                            length={reports.length}
                        >
                            {reports.map((item: IReport) => {
                                return (
                                    <Cell key={item.id} onClick={() => postReport(item)}>
                                        {item.title}
                                    </Cell>
                                );
                            })}
                        </InfiniteScroll>
                    </Group>
                ))}
        </Panel>
    );
};
