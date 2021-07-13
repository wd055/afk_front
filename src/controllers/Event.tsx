import { Alert } from '@vkontakte/vkui';
import EventModel, { IEvent, IResponseEvent, IResponseEvents } from '../models/Event';

import { IPaginationResponseData } from '../models/Other';
import {
    IPaginationStudent,
    IResponsePaginationStudent,
    IResponseStudent,
    IStudent
} from '../models/Student';
import VisitModel, { IPaginationVisit, IResponsePaginationVisit, IVisit } from '../models/Visit';
import { IResponseData } from '../utils/requests';
import { callSnackbar, catchSnackbar } from '../panels/style';
import { TAuthOrder, TDepartment } from '../consts/events';
import React from 'react';
import { ESetPopout } from '../App';
import { snackbarDelay } from '../consts/snackbar';

export interface IStudentVisit extends IStudent {
    authOrder?: TAuthOrder;
}

export interface ISearchStudentsListPromise {
    studentsList: IStudentVisit[];
    response: IPaginationResponseData;
}

export interface ISearchStudentsList {
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
                        action: () => this.deleteEventRequest(eventId, onDelete)
                    }
                ]}
                actionsLayout="horizontal"
                onClose={() => ESetPopout(null)}
                header="Удаление мероприятия"
                text="Вы уверены, что хотите удалить это мероприятие?"
            />
        );
    }

    getFavorite(setEvents: Function): void {
        EventModel.getFavorite()
            .then((response: IResponseEvents) => {
                if (!response.ok) return;
                setEvents(response.json);
            })
            .catch(catchSnackbar);
    }

    getEvents(start: Date, end: Date, setEvents: Function, department?: TDepartment): void {
        EventModel.getEvents({ start: start, end: end }, 1, department)
            .then((response: IResponseEvents) => {
                if (!response.ok) return;
                setEvents(response.json);
            })
            .catch(catchSnackbar);
    }

    saveEvent(formsData: IEvent): void {
        ((): Promise<IResponseEvent> => {
            if (formsData.id) {
                return EventModel.putEvent(formsData.id, formsData);
            }
            return EventModel.postEvent(formsData);
        })()
            .then(() => callSnackbar({}))
            .catch(catchSnackbar);
    }

    searchStudentsList(obj: ISearchStudentsList): Promise<ISearchStudentsListPromise> {
        return new Promise<IResponsePaginationStudent | IResponsePaginationVisit>((resolve, reject) => {
            if (obj.searchNewStudent) {
                return resolve(
                    EventModel.searchNewStudentsEvent(obj.eventId, obj.searchValue, obj.offset, obj.limit)
                );
            } else {
                return resolve(
                    VisitModel.getVisit({
                        event: obj.eventId,
                        search: obj.searchValue,
                        offset: obj.offset,
                        limit: obj.limit
                    })
                );
            }
        }).then((responseData: IResponseData) => {
            if (!responseData.ok) {
                return {
                    studentsList: [],
                    response: responseData
                };
            }
            let studentsList: IStudentVisit[] = [];
            if (obj.searchNewStudent) {
                let data: IPaginationStudent = responseData.json as IPaginationStudent;
                data.results.forEach((item: IStudent) => {
                    item.id = item.student;
                    studentsList.push(item);
                });
            } else {
                let data: IPaginationVisit = responseData.json as IPaginationVisit;
                data.results.forEach((item: IVisit) => {
                    studentsList.push({ ...item.student_data, authOrder: item.auth_order });
                });
            }
            return {
                studentsList: studentsList,
                response: responseData
            };
        });
    }

    setVisit(eventId: number, student_vk_id: number | string, authOrder: TAuthOrder) {
        student_vk_id = Number(student_vk_id);
        EventModel.setVisitEvent(eventId, {
            student_vk_id: student_vk_id,
            auth_order: authOrder
        })
            .then((response: IResponseStudent) => {
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
