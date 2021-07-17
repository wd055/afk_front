import { Alert } from '@vkontakte/vkui';
import EventModel, { Event, ResponseEvent, ResponseEvents } from '../models/Event';
import { PaginationResponseData } from '../models/Other';
import {
    PaginationStudent,
    ResponsePaginationStudent,
    ResponseStudent,
    Student
} from '../models/Student';
import VisitModel, { PaginationVisit, ResponsePaginationVisit, Visit } from '../models/Visit';
import { ResponseData } from '../utils/requests';
import { callSnackbar, catchSnackbar } from '../panels/style';
import { TAuthOrder, TDepartment } from '../consts/events';
import React from 'react';
import { ESetPopout } from '../App';
import { snackbarDelay } from '../consts/snackbar';

export interface StudentVisit extends Student {
    visit?: Visit;
}

export interface SearchStudentsListPromise {
    studentsList: StudentVisit[];
    response: PaginationResponseData;
}

export interface SearchStudentsList {
    eventId: number;
    searchValue?: string;
    searchNewStudent?: boolean;
    offset?: number;
    limit?: number;
}

export class EventController {
    deleteEventRequest(eventId: number, onDelete?: Function): void {
        EventModel.deleteEvent(eventId)
            .then((data) => {
                if (data.ok) {
                    callSnackbar({});
                    if (onDelete) onDelete();
                } else {
                    callSnackbar({ success: false, statusCodeForText: data.status });
                }
            })
            .catch(catchSnackbar);
    }

    deleteEvent(eventId: number, onDelete?: Function): void {
        ESetPopout(
            <Alert
                actions={[
                    {
                        title: 'Отмена',
                        autoclose: true,
                        mode: 'cancel'
                    },
                    {
                        title: 'Удалить',
                        autoclose: true,
                        mode: 'destructive',
                        action: (): void => this.deleteEventRequest(eventId, onDelete)
                    }
                ]}
                actionsLayout="horizontal"
                onClose={(): void => ESetPopout(null)}
                header="Удаление мероприятия"
                text="Вы уверены, что хотите удалить это мероприятие?"
            />
        );
    }

    getFavorite(setEvents: Function): void {
        EventModel.getFavorite()
            .then((response: ResponseEvents) => {
                if (!response.ok) return;
                setEvents(response.json);
            })
            .catch(catchSnackbar);
    }

    getEvents(start: Date, end: Date, setEvents: Function, department?: TDepartment): void {
        EventModel.getEvents({ start: start, end: end }, 1, department)
            .then((response: ResponseEvents) => {
                if (!response.ok) return;
                setEvents(response.json);
            })
            .catch(catchSnackbar);
    }

    saveEvent(formsData: Event): void {
        ((): Promise<ResponseEvent> => {
            if (formsData.id) {
                return EventModel.putEvent(formsData.id, formsData);
            }
            return EventModel.postEvent(formsData);
        })()
            .then(() => callSnackbar({}))
            .catch(catchSnackbar);
    }

    searchStudentsList(obj: SearchStudentsList): Promise<SearchStudentsListPromise> {
        return new Promise<ResponsePaginationStudent | ResponsePaginationVisit>((resolve) => {
            if (obj.searchNewStudent) {
                return resolve(
                    EventModel.searchNewStudentsEvent(obj.eventId, obj.searchValue, obj.offset, obj.limit)
                );
            } else {
                return resolve(
                    VisitModel.getVisits({
                        event: obj.eventId,
                        search: obj.searchValue,
                        offset: obj.offset,
                        limit: obj.limit
                    })
                );
            }
        }).then((responseData: ResponseData) => {
            if (!responseData.ok) {
                return {
                    studentsList: [],
                    response: responseData
                };
            }
            const studentsList: StudentVisit[] = [];
            if (obj.searchNewStudent) {
                const data: PaginationStudent = responseData.json as PaginationStudent;
                data.results.forEach((item: Student) => {
                    item.id = item.student;
                    studentsList.push(item);
                });
            } else {
                const data: PaginationVisit = responseData.json as PaginationVisit;
                data.results.forEach((item: Visit) => {
                    studentsList.push({ ...item.student_data, visit: item });
                });
            }
            return {
                studentsList: studentsList,
                response: responseData
            };
        });
    }

    setVisit(eventId: number, studentVkId: number | string, authOrder: TAuthOrder): void {
        studentVkId = Number(studentVkId);
        EventModel.setVisitEvent(eventId, {
            student_vk_id: studentVkId,
            auth_order: authOrder
        })
            .then((response: ResponseStudent) => {
                if (!response.ok) {
                    callSnackbar({ success: false, statusCodeForText: response.status });
                    return;
                }
                callSnackbar({
                    text: response.json.full_name ? response.json.full_name : 'Успешно',
                    duration: snackbarDelay
                });
            })
            .catch(catchSnackbar);
    }
}
class EventControllerInstance {
    static instance: EventController | null = null;

    static getInstance(): EventController {
        if (!EventControllerInstance.instance) {
            EventControllerInstance.instance = new EventController();
        }

        return EventControllerInstance.instance;
    }
}

export default EventControllerInstance.getInstance();
