import React, { useState, useEffect, FunctionComponent } from 'react';
import {
    Group,
    MiniInfoCell,
    Header,
    Tabs,
    TabsItem,
    Counter,
    List,
    RichCell
} from '@vkontakte/vkui';
import { Icon20EducationOutline, Icon20UserOutline, Icon20Users3Outline } from '@vkontakte/icons';
import StudentModel, { IStudent } from '../../models/Student';
import { IEvent } from '../../models/Event';
import { EventInfo } from '../EventInfo/EventInfo';
import {
    checkPeriodArray,
    checkPeriodCurrentAcademicYear,
    checkPeriodCurrentSemestr,
    checkPeriodObject,
    checkPeriodType,
    getDateTitle
} from '../../utils/date';
import ReportSubsModel, { IReportSubs, IResponsePaginationReportSubs } from '../../models/ReportSubscription';
import { UnpinReportSubs } from '../UnpinReportSubs/UnpinReportSubs';
import VisitModel, { IResponsePaginationVisit, IVisit } from '../../models/Visit';
import { callSnackbar, catchSnackbar } from '../../panels/style';
import { InfiniteScroll } from '../InfiniteScroll/InfiniteScroll';
import { thisAdmin } from '../../consts/roles';

type StudentInfoProps = {
    student: IStudent;
    updateModalHeight?: Function;
};

export const StudentInfo: FunctionComponent<StudentInfoProps> = ({ student, updateModalHeight }) => {
    const [visits, setVisits] = useState<IVisit[]>([]);
    const [searchPeriod, setSearchPeriod] = useState<checkPeriodType>('all');
    const [usersReportsSubs, setUsersReportsSubs] = useState<IReportSubs[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);

    function getStudentsVisits(limit?: number, offset?: number) {
        return VisitModel.getVisits({ student: student?.id || StudentModel?.thisStudent?.id, limit, offset })
            .then((response: IResponsePaginationVisit) => {
                if (!response.ok) {
                    callSnackbar({ success: false, statusCodeForText: response.status });
                    return;
                }
                if (!response.json.next) {
                    setHasMore(false);
                }
                setVisits(visits.concat(response.json.results));
            })
            .catch(catchSnackbar);
    }

    const getUsersReportsSubs = () => {
        if (student?.id) {
            ReportSubsModel.getReportSubses({
                student: student?.id
            })
                .then((response: IResponsePaginationReportSubs) => {
                    if (response.ok) {
                        setUsersReportsSubs(response.json.results);
                    }
                })
                .catch();
        }
    };

    useEffect(() => {
        getStudentsVisits();
        getUsersReportsSubs();
    }, []);

    const filterVisitPeriod = (visit: IVisit, period: checkPeriodType) => {
        switch (period) {
            case 'currentSemestr':
                return checkPeriodCurrentSemestr(visit.event_data.start);
            case 'currentAcademicYear':
                return checkPeriodCurrentAcademicYear(visit.event_data.start);
            case 'all':
            default:
                return true;
        }
    };

    return (
        <>
            {student && student.full_name && (
                <Group>
                    <MiniInfoCell before={<Icon20UserOutline />} textLevel="primary">
                        {student.full_name}
                    </MiniInfoCell>
                    {student.group && (
                        <MiniInfoCell before={<Icon20Users3Outline />} textLevel="primary">
                            {student.group}
                        </MiniInfoCell>
                    )}
                    {student.teacher && (
                        <MiniInfoCell before={<Icon20EducationOutline />} textLevel="primary">
                            {student.teacher}
                        </MiniInfoCell>
                    )}
                </Group>
            )}
            {student?.id && (
                <Group header={<Header>Рефераты</Header>}>
                    <List>
                        {usersReportsSubs.map((item: IReportSubs, i: number) => {
                            return (
                                <RichCell
                                    disabled
                                    key={item.id}
                                    caption={`Взят ${getDateTitle(item.date)}`}
                                    after={
                                        <UnpinReportSubs
                                            reportSubs={item}
                                            OnUnpin={() => {
                                                usersReportsSubs.splice(i, 1);
                                                setUsersReportsSubs(usersReportsSubs);
                                            }}
                                        />
                                    }
                                >
                                    {item.report_title}
                                </RichCell>
                            );
                        })}
                    </List>
                </Group>
            )}
            <Group header={<Header>Период</Header>}>
                <Tabs mode="buttons">
                    {checkPeriodArray.map((item: checkPeriodType) => {
                        return (
                            <TabsItem
                                key={item}
                                onClick={() => {
                                    setSearchPeriod(item);
                                }}
                                selected={searchPeriod === item}
                                after={
                                    <Counter size="s">
                                        {visits.filter((visit) => filterVisitPeriod(visit, item)).length}
                                    </Counter>
                                }
                            >
                                {checkPeriodObject[item as keyof typeof checkPeriodObject]}
                            </TabsItem>
                        );
                    })}
                </Tabs>
            </Group>
            <InfiniteScroll
                next={getStudentsVisits.bind(this)}
                hasMore={hasMore}
                length={visits.filter((visit) => filterVisitPeriod(visit, searchPeriod)).length}
                height={thisAdmin ? 550 : 730}
            >
                {visits
                    .filter((visit) => filterVisitPeriod(visit, searchPeriod))
                    .map((visit) => (
                        <EventInfo key={visit.id} event={visit.event_data as IEvent} date={visit.date} />
                    ))}
            </InfiniteScroll>
        </>
    );
};
