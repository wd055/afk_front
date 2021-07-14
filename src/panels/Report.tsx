import { Icon28DeleteOutline, Icon28SendOutline } from '@vkontakte/icons';
import {
    Alert,
    Cell,
    CellButton,
    Div,
    FormItem,
    FormLayoutGroup,
    Group,
    Header,
    IconButton,
    Input,
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
import { EGoBack, ESetPopout } from '../App';
import { InfiniteScroll } from '../components/InfiniteScroll/InfiniteScroll';
import { thisAdmin } from '../consts/roles';
import ReportController from '../controllers/Report';
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
    const [course, setCourse] = useState<number | undefined>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [editReports, setEditReports] = useState<boolean>(false);
    const [newReportTitle, setNewReportTitle] = useState<string>('');
    const [newReportCourse, setNewReportCourse] = useState<number>(0);

    const getReports = (
        thisSearchValue?: string,
        thisCourse?: number | undefined,
        offset?: number,
        limit?: number
    ) => {
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

    useEffect(() => {
        ReportController.getUsersReportsSubs(StudentModel.thisStudent?.id as number, setUsersReportsSubs);
        if (thisAdmin) {
            setCourse(undefined);
            getReports(searchValue);
        }
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

            {(usersReportsSubs.filter((item: IReportSubs) => {
                return checkPeriodCurrentSemestr(item.date);
            }).length === 0 ||
                thisAdmin) &&
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
                        {thisAdmin && (
                            <Cell
                                disabled
                                after={
                                    <Switch
                                        checked={editReports}
                                        onChange={(e) => setEditReports(e.target.checked)}
                                    />
                                }
                            >
                                Редактировать темы
                            </Cell>
                        )}
                        {editReports && (
                            <Div>
                                <FormLayoutGroup mode="horizontal">
                                    <FormItem status={newReportTitle.length > 0 ? 'valid' : 'error'}>
                                        <Input
                                            value={newReportTitle}
                                            onChange={(e) => setNewReportTitle(e.target.value)}
                                        />
                                    </FormItem>
                                    <FormItem status={newReportCourse !== 0 ? 'valid' : 'error'}>
                                        <Input
                                            value={newReportCourse}
                                            type="number"
                                            onChange={(e) => setNewReportCourse(Number(e.target.value))}
                                        />
                                    </FormItem>
                                </FormLayoutGroup>
                                <CellButton
                                    onClick={() => {
                                        if (newReportTitle.length > 0 && newReportCourse !== 0) {
                                            ReportController.postReport(newReportTitle, newReportCourse);
                                        }
                                    }}
                                >
                                    Добавить реферат
                                </CellButton>
                            </Div>
                        )}
                        <InfiniteScroll
                            next={getReports.bind(this, searchValue, course)}
                            hasMore={hasMore}
                            length={reports.length}
                        >
                            {reports.map((item: IReport, i: number) => {
                                return (
                                    <Cell
                                        disabled={editReports}
                                        key={item.id}
                                        onClick={() => ReportController.postReportSubs(item)}
                                        after={
                                            thisAdmin &&
                                            editReports && (
                                                <IconButton>
                                                    <Icon28DeleteOutline
                                                        onClick={() =>
                                                            ReportController.deleteReport(item, () => {
                                                                reports.splice(i, 1);
                                                                setReports([...reports]);
                                                            })
                                                        }
                                                    />
                                                </IconButton>
                                            )
                                        }
                                    >
                                        {editReports ? (
                                            <div style={{ display: 'flex' }}>
                                                <Input
                                                    type="number"
                                                    defaultValue={item.course}
                                                    onChange={(e) => {
                                                        item.course = Number(e.target.value);
                                                    }}
                                                    style={{ marginRight: 8 }}
                                                />
                                                <Input
                                                    type="text"
                                                    defaultValue={item.title}
                                                    onChange={(e) => {
                                                        item.title = e.target.value;
                                                    }}
                                                    after={
                                                        <IconButton hoverMode="opacity">
                                                            <Icon28SendOutline
                                                                onClick={() =>
                                                                    ReportController.putReport(
                                                                        item.id as number,
                                                                        item
                                                                    )
                                                                }
                                                            />
                                                        </IconButton>
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            item.title
                                        )}
                                    </Cell>
                                );
                            })}
                        </InfiniteScroll>
                    </Group>
                ))}
        </Panel>
    );
};
