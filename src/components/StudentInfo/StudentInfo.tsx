import React, { useState, useEffect, FunctionComponent } from 'react';
import {
    Group,
    MiniInfoCell,
    Footer,
    Spinner,
    SliderSwitch,
    Header,
    Tabs,
    TabsItem,
    Counter
} from '@vkontakte/vkui';
import { Icon20EducationOutline, Icon20UserOutline, Icon20Users3Outline } from '@vkontakte/icons';
import { IStudent } from '../../models/Student';
import { IEvent } from '../../models/Event';
import { EventInfo } from '../EventInfo/EventInfo';
import OtherModel, { IResponseGetStudentsEvents } from '../../models/Other';
import {
    checkPeriodArray,
    checkPeriodCurrentAcademicYear,
    checkPeriodCurrentSemestr,
    checkPeriodObject,
    checkPeriodType
} from '../../utils/date';

type StudentInfoProps = {
    student: IStudent;
    updateModalHeight?: Function;
};

export const StudentInfo: FunctionComponent<StudentInfoProps> = ({ student, updateModalHeight }) => {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [download, setDownload] = useState(false);
    const [searchPeriod, setSearchPeriod] = useState<checkPeriodType>('all');

    function getStudentsVisits() {
        setDownload(true);
        OtherModel.getStudentsEvents(student?.id)
            .then((response: IResponseGetStudentsEvents) => {
                setEvents(response.json);
            })
            .finally(() => setDownload(false));
    }

    useEffect(() => {
        console.log(
            checkPeriodArray.map((item: string) => {
                return {
                    name: checkPeriodObject[item as keyof typeof checkPeriodObject],
                    value: item
                };
            })
        );
        getStudentsVisits();
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
            <Group header={<Header>Период</Header>}>
                <Tabs mode="buttons">
                    {checkPeriodArray.map((item: checkPeriodType) => {
                        return (
                            <TabsItem
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
