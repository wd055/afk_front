import { Icon28EditOutline } from '@vkontakte/icons';
import {
    Button,
    Cell,
    Div,
    Group,
    Header,
    IconButton,
    List,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    RichCell,
    Search,
    Switch,
    Tabs,
    TabsItem
} from '@vkontakte/vkui';
import React, { useEffect, useState } from 'react';
import { EGo, EGoBack } from '../App';
import { InfiniteScroll } from '../components/InfiniteScroll/InfiniteScroll';
import { thisAdmin } from '../consts/roles';
import ReportController from '../controllers/Report';
import ReportModel, { Report } from '../models/Report';
import { ReportSubs } from '../models/ReportSubscription';
import StudentModel from '../models/Student';
import { checkPeriodCurrentSemestr, getDateTitle } from '../utils/date';
import { callSnackbar, catchSnackbar } from './style';

interface ReportPanelProps {
    id: string;
}

export const ReportPanel = ({ id }: ReportPanelProps): JSX.Element => {
    const [reports, setReports] = useState<Report[]>([]);
    const [usersReportsSubs, setUsersReportsSubs] = useState<ReportSubs[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [course, setCourse] = useState<number | undefined>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [selectInCurSem, setSelectInCurSem] = useState<boolean>(false);
    const [shawAllReports, setShawAllReports] = useState<boolean>(thisAdmin);

    const getReports = (
        thisSearchValue?: string,
        thisCourse?: number | undefined,
        offset?: number,
        limit?: number
    ): Promise<void> => {
        return ReportModel.getReports(
            { search: thisSearchValue, course: thisCourse, showAll: shawAllReports },
            offset,
            limit
        )
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

    useEffect(() => {
        ReportController.getUsersReportsSubs(StudentModel.thisStudent?.id as number, setUsersReportsSubs);
        if (thisAdmin) {
            setCourse(undefined);
            getReports(searchValue);
        }
    }, []);

    useEffect(() => {
        console.log('shawAllReports hook');
        getReports(searchValue, course);
    }, [shawAllReports]);

    useEffect(() => {
        setSelectInCurSem(
            usersReportsSubs.filter((item: ReportSubs) => {
                return checkPeriodCurrentSemestr(item.date);
            }).length === 0
        );
    }, [usersReportsSubs]);

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={(): void => EGoBack()} />}>Реферат</PanelHeader>
            {usersReportsSubs.length > 0 && (
                <Group header={<Header>Мои рефераты</Header>}>
                    <List>
                        {usersReportsSubs.map((item: ReportSubs) => {
                            return (
                                <RichCell disabled key={item.id} caption={`Взят ${getDateTitle(item.date)}`}>
                                    {item.report_title}
                                </RichCell>
                            );
                        })}
                    </List>
                </Group>
            )}

            {(selectInCurSem || thisAdmin) && (
                <>
                    {(course === 0 || thisAdmin) && (
                        <Group header={<Header>Выберите курс перед выбором реферата!</Header>}>
                            <Tabs mode="buttons">
                                {[1, 2, 3].map((item: number) => {
                                    return (
                                        <TabsItem
                                            key={item}
                                            onClick={(): void => {
                                                setCourse(item);
                                                getReports(searchValue, item);
                                            }}
                                            selected={item === course}
                                        >
                                            {item}
                                        </TabsItem>
                                    );
                                })}
                                {thisAdmin && (
                                    <TabsItem
                                        key={'all'}
                                        onClick={(): void => {
                                            setCourse(undefined);
                                            getReports(searchValue);
                                        }}
                                        selected={undefined === course}
                                    >
                                        Все
                                    </TabsItem>
                                )}
                            </Tabs>
                        </Group>
                    )}
                    {thisAdmin && (
                        <Group>
                            <Cell
                                disabled
                                after={
                                    <Switch
                                        checked={shawAllReports}
                                        onChange={(e): void => {
                                            setReports([]);
                                            setShawAllReports(e.target.checked);
                                        }}
                                    />
                                }
                            >
                                Показать все рефераты
                            </Cell>
                        </Group>
                    )}
                    {(course !== 0 || thisAdmin) && (
                        <Group header={<Header>Выбор реферата</Header>}>
                            <Search
                                value={searchValue}
                                onChange={(e): void => {
                                    const { value } = e.currentTarget;
                                    setSearchValue(value);
                                    getReports(value, course);
                                }}
                                placeholder="Поиск"
                            />
                            {thisAdmin && (
                                <Div>
                                    <Button
                                        size="l"
                                        mode="outline"
                                        onClick={(): void => {
                                            ReportModel.currentReport = null;
                                            EGo('EditReport');
                                        }}
                                    >
                                        Добавить реферат
                                    </Button>
                                </Div>
                            )}
                            <InfiniteScroll
                                next={getReports.bind(this, searchValue, course)}
                                hasMore={hasMore}
                                length={reports.length}
                                height={thisAdmin ? 390 : 500}
                            >
                                {reports.map((item: Report) => {
                                    return (
                                        <Cell
                                            disabled={!selectInCurSem}
                                            key={item.id}
                                            onClick={(): void => ReportController.postReportSubs(item)}
                                            after={
                                                thisAdmin && (
                                                    <IconButton onClick={(e): void => e.stopPropagation()}>
                                                        <Icon28EditOutline
                                                            onClick={(): void => {
                                                                ReportModel.currentReport = item;
                                                                EGo('EditReport');
                                                            }}
                                                        />
                                                    </IconButton>
                                                )
                                            }
                                        >
                                            {item.title}
                                        </Cell>
                                    );
                                })}
                            </InfiniteScroll>
                        </Group>
                    )}
                </>
            )}
        </Panel>
    );
};
