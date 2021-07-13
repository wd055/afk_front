import React, { FunctionComponent } from 'react';
import { Button, RichCell } from '@vkontakte/vkui';
import { Icon28InfoOutline } from '@vkontakte/icons';
import { IEvent } from '../../models/Event';
import EventController, { IStudentVisit } from '../../controllers/Event';
import { Roles, userRole } from '../../consts/roles';
import StudentModel from '../../models/Student';
import { EGo } from '../../App';

type EventVisitItemProps = {
    event: IEvent;
    student: IStudentVisit;
};

export const EventVisitItem: FunctionComponent<EventVisitItemProps> = ({ event, student }, props) => {
    const authTypeIsSingle = event.auth_type === 'single';
    let eventId = event?.id || 0;

    return (
        <RichCell
            key={student.id}
            caption={
                student.authOrder && student.authOrder === 'initial'
                    ? 'Начал'
                    : student.authOrder === 'final'
                    ? authTypeIsSingle
                        ? 'Отметился'
                        : 'Закончил'
                    : 'Не начал'
            }
            actions={
                userRole === Roles.admin ? (
                    <>
                        {student.authOrder && student.authOrder !== 'final' && (
                            <Button
                                onClick={() => EventController.setVisit(eventId, student.vk_id || 0, 'final')}
                                size="m"
                                mode="outline"
                            >
                                Завершить
                            </Button>
                        )}
                        {!student.authOrder &&
                            (event.auth_type === 'single' ? (
                                <Button
                                    onClick={() =>
                                        EventController.setVisit(eventId, student.vk_id || 0, 'final')
                                    }
                                    size="m"
                                    mode="outline"
                                >
                                    Отметить
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        onClick={() =>
                                            EventController.setVisit(eventId, student.vk_id || 0, 'initial')
                                        }
                                        size="m"
                                        mode="outline"
                                    >
                                        Начать
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            EventController.setVisit(
                                                eventId,
                                                student.vk_id || 0,
                                                'final_anyway'
                                            )
                                        }
                                        size="m"
                                        mode="outline"
                                    >
                                        Начать и Завершить
                                    </Button>
                                </>
                            ))}
                    </>
                ) : (
                    <></>
                )
            }
            after={
                <Icon28InfoOutline
                    onClick={() => {
                        StudentModel.currentStudent = student;
                        EGo('studentInfo');
                    }}
                />
            }
            disabled
        >
            {student.full_name}
        </RichCell>
    );
};
