import React, { FunctionComponent } from 'react';
import { Button, RichCell } from '@vkontakte/vkui';
import { Icon28InfoOutline } from '@vkontakte/icons';
import { Event } from '../../models/Event';
import EventController, { StudentVisit } from '../../controllers/Event';
import { Roles, thisAdmin, userRole } from '../../consts/roles';
import StudentModel from '../../models/Student';
import { EGo } from '../../App';
import { getDateTitle } from '../../utils/date';
import { Visit } from '../../models/Visit';

type EventVisitItemProps = {
    event: Event;
    student: StudentVisit;
};

export const EventVisitItem: FunctionComponent<EventVisitItemProps> = ({
    event,
    student
}: EventVisitItemProps) => {
    const authTypeIsSingle = event.auth_type === 'single';
    const eventId = event?.id || 0;

    const timeCaption = (visit?: Visit, event?: Event): string => {
        return visit?.auth_order && visit?.auth_order === 'initial'
            ? 'Начал'
            : visit?.auth_order === 'final'
            ? authTypeIsSingle
                ? 'Отметился'
                : `Закончил${
                      event?.auth_type === 'many' && visit?.date ? `: ${getDateTitle(visit?.date)}` : ''
                  }`
            : 'Не начал';
    };

    const teacherCaption = (visit?: Visit): string => {
        if (!visit?.teacher || !thisAdmin) {
            return '';
        }
        return visit.teacher && visit.teacher.length > 0 ? `Отметил: ${visit.teacher}` : '';
    };

    const caption = (visit?: Visit, event?: Event): string => {
        const time = timeCaption(visit, event);
        const teacher = teacherCaption(visit);
        const brake = time.length > 0 && teacher.length > 0 ? '; ' : '';
        return time + brake + teacher;
    };

    return (
        <RichCell
            key={student?.visit?.id || student.id}
            caption={caption(student.visit, event)}
            actions={
                userRole === Roles.admin ? (
                    <>
                        {student.visit?.auth_order && student.visit?.auth_order !== 'final' && (
                            <Button
                                onClick={(): void =>
                                    EventController.setVisit(eventId, student.vk_id || 0, 'final')
                                }
                                size="m"
                                mode="outline"
                            >
                                Завершить
                            </Button>
                        )}
                        {!student.visit?.auth_order &&
                            (event.auth_type !== 'double' ? (
                                <Button
                                    onClick={(): void =>
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
                                        onClick={(): void =>
                                            EventController.setVisit(eventId, student.vk_id || 0, 'initial')
                                        }
                                        size="m"
                                        mode="outline"
                                    >
                                        Начать
                                    </Button>
                                    <Button
                                        onClick={(): void =>
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
                    onClick={(): void => {
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
