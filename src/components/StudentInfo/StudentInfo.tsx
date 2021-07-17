import React, { useState, useEffect, FunctionComponent } from 'react';
import { Group, MiniInfoCell, Header, Tabs, TabsItem, Counter, List, RichCell } from '@vkontakte/vkui';
import { Icon20EducationOutline, Icon20UserOutline, Icon20Users3Outline } from '@vkontakte/icons';
import StudentModel, { Student } from '../../models/Student';
import { Event } from '../../models/Event';
import { EventInfo } from '../EventInfo/EventInfo';
import {
    checkPeriodArray,
    checkPeriodCurrentAcademicYear,
    checkPeriodCurrentSemestr,
    checkPeriodObject,
    checkPeriodType,
    getDateTitle
} from '../../utils/date';
import ReportSubsModel, { ReportSubs, ResponsePaginationReportSubs } from '../../models/ReportSubscription';
import { UnpinReportSubs } from '../UnpinReportSubs/UnpinReportSubs';
import VisitModel, { ResponsePaginationVisit, Visit } from '../../models/Visit';
import { callSnackbar, catchSnackbar } from '../../panels/style';
import { InfiniteScroll } from '../InfiniteScroll/InfiniteScroll';
import { thisAdmin } from '../../consts/roles';

type StudentInfoProps = {
    student: Student;
};

export const StudentInfo: FunctionComponent<StudentInfoProps> = ({ student }: StudentInfoProps) => {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [searchPeriod, setSearchPeriod] = useState<checkPeriodType>('all');
    const [usersReportsSubs, setUsersReportsSubs] = useState<ReportSubs[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);

    function getStudentsVisits(limit?: number, offset?: number): Promise<void> {
        return VisitModel.getVisits({ student: student?.id || StudentModel?.thisStudent?.id, limit, offset })
            .then((response: ResponsePaginationVisit) => {
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

    const getUsersReportsSubs = (): void => {
        if (student?.id) {
            ReportSubsModel.getReportSubses({
                student: student?.id
            })
                .then((response: ResponsePaginationReportSubs) => {
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

    const filterVisitPeriod = (visit: Visit, period: checkPeriodType): boolean => {
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
                        {usersReportsSubs.map((item: ReportSubs, i: number) => {
                            return (
                                <RichCell
                                    disabled
                                    key={item.id}
                                    caption={`Взят ${getDateTitle(item.date)}`}
                                    after={
                                        <UnpinReportSubs
                                            reportSubs={item}
                                            OnUnpin={(): void => {
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
                                onClick={(): void => setSearchPeriod(item)}
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
                        <EventInfo key={visit.id} event={visit.event_data as Event} date={visit.date} />
                    ))}
            </InfiniteScroll>
        </>
    );
};
