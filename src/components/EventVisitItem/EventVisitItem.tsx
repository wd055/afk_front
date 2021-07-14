import React, { FunctionComponent } from 'react';
import { Button, RichCell } from '@vkontakte/vkui';
import { Icon28InfoOutline } from '@vkontakte/icons';
import { IEvent } from '../../models/Event';
import EventController, { IStudentVisit } from '../../controllers/Event';
import { Roles, userRole } from '../../consts/roles';
import StudentModel from '../../models/Student';
import { EGo } from '../../App';
import { getDateTitle } from '../../utils/date';

type EventVisitItemProps = {
    event: IEvent;
    student: IStudentVisit;
};

export const EventVisitItem: FunctionComponent<EventVisitItemProps> = ({ event, student }, props) => {
    const authTypeIsSingle = event.auth_type === 'single';
    let eventId = event?.id || 0;

    return (
        <RichCell
            key={student?.visit?.id || student.id}
            caption={
                student.visit?.auth_order && student.visit?.auth_order === 'initial'
                    ? 'Начал'
                    : student.visit?.auth_order === 'final'
                    ? authTypeIsSingle
                        ? 'Отметился'
                        : `Закончил${
                              event.auth_type === 'many' && student?.visit?.date
                                  ? `: ${getDateTitle(student.visit?.date)}`
                                  : ''
                          }`
                    : 'Не начал'
            }
            actions={
                userRole === Roles.admin ? (
                    <>
                        {student.visit?.auth_order && student.visit?.auth_order !== 'final' && (
                            <Button
                                onClick={() => EventController.setVisit(eventId, student.vk_id || 0, 'final')}
                                size="m"
                                mode="outline"
                            >
                                Завершить
                            </Button>
                        )}
                        {!student.visit?.auth_order &&
                            (event.auth_type !== 'double' ? (
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
