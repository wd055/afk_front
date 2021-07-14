import React, { useState, useEffect, FunctionComponent } from 'react';
import {
    Group,
    MiniInfoCell,
    Footer,
    Spinner,
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
import OtherModel, { IResponseGetStudentsEvents } from '../../models/Other';
import {
    checkPeriodArray,
    checkPeriodCurrentAcademicYear,
    checkPeriodCurrentSemestr,
    checkPeriodObject,
    checkPeriodType,
    getDateTitle
} from '../../utils/date';
import ReportSubsModel, { IReportSubs, IResponsePaginationReportSubs } from '../../models/ReportSubscription';

type StudentInfoProps = {
    student: IStudent;
    updateModalHeight?: Function;
};

export const StudentInfo: FunctionComponent<StudentInfoProps> = ({ student, updateModalHeight }) => {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [download, setDownload] = useState(false);
    const [searchPeriod, setSearchPeriod] = useState<checkPeriodType>('all');
    const [usersReportsSubs, setUsersReportsSubs] = useState<IReportSubs[]>([]);

    function getStudentsVisits() {
        setDownload(true);
        OtherModel.getStudentsEvents(student?.id)
            .then((response: IResponseGetStudentsEvents) => {
                setEvents(response.json);
            })
            .finally(() => setDownload(false));
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

    useEffect(() => {
        if (updateModalHeight) updateModalHeight();
    }, [download]);

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
                                        {
                                            events.filter((event: IEvent) => {
                                                switch (item) {
                                                    case 'currentSemestr':
                                                        return checkPeriodCurrentSemestr(event.start);
                                                    case 'currentAcademicYear':
                                                        return checkPeriodCurrentAcademicYear(event.start);
                                                    case 'all':
                                                    default:
                                                        return true;
                                                }
                                            }).length
                                        }
                                    </Counter>
                                }
                            >
                                {checkPeriodObject[item as keyof typeof checkPeriodObject]}
                            </TabsItem>
                        );
                    })}
                </Tabs>
            </Group>
            {download && <Spinner size="medium" />}
            {!download && (!events || events.length === 0) && <Footer>Нет мероприятий</Footer>}
            {events
                .filter((event: IEvent) => {
                    switch (searchPeriod) {
                        case 'currentSemestr':
                            return checkPeriodCurrentSemestr(event.start);
                        case 'currentAcademicYear':
                            return checkPeriodCurrentAcademicYear(event.start);
                        case 'all':
                        default:
                            return true;
                    }
                })
                .map((event, i) => (
                    <EventInfo key={event.id} event={event} />
                ))}
        </>
    );
};
