import React, { useState, useEffect, FunctionComponent } from 'react';
import { Group, MiniInfoCell, Footer, Spinner } from '@vkontakte/vkui';
import { Icon20UserOutline } from '@vkontakte/icons';
import { IStudent } from '../../models/Student';
import { IEvent } from '../../models/Event';
import { EventInfo } from '../EventInfo/EventInfo';
import OtherModel, { IResponseGetStudentsEvents } from '../../models/Other';

type StudentInfoProps = {
    student: IStudent;
    updateModalHeight?: Function;
};

export const StudentInfo: FunctionComponent<StudentInfoProps> = ({ student, updateModalHeight }) => {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [download, setDownload] = useState(false);

    function getStudentsVisits() {
        setDownload(true);
        OtherModel.getStudentsEvents(student?.id)
            .then((response: IResponseGetStudentsEvents) => {
                setEvents(response.json);
            })
            .finally(() => setDownload(false));
    }

    useEffect(() => {
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
                </Group>
            )}
            {download && <Spinner size="medium" />}
            {!download && (!events || events.length === 0) && <Footer>Нет мероприятий</Footer>}
            {events.map((event, i) => (
                <EventInfo key={event.id} event={event} />
            ))}
        </>
    );
};
