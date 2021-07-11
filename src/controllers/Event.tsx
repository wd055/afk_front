import { Alert } from '@vkontakte/vkui';
import EventModel, { IEvent, IResponseEvent, IResponsePaginationEvent } from '../models/Event';

import { IPaginationResponseData } from '../models/Other';
import { IPaginationStudent, IResponsePaginationStudent, IStudent } from '../models/Student';
import VisitModel, { IPaginationVisit, IResponsePaginationVisit, IVisit } from '../models/Visit';
import { IResponseData } from '../utils/requests';
import { callSnackbar, catchSnackbar } from '../panels/style';
import { TAuthOrder } from '../consts/events';
import React from 'react';
import { ESetPopout } from '../App';

export interface IStudentVisit extends IStudent {
    authOrder?: TAuthOrder;
}

export interface ISearchStudentsListPromise {
    studentsList: IStudentVisit[];
    response: IPaginationResponseData;
}

export interface ISearchStudentsList {
    eventId: number;
    next?: string;
    searchValue?: string;
    searchNewStudent?: boolean;
    page?: number;
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

    getEvents(start: Date, end: Date, setEvents: Function): void {
        EventModel.getEvents({ start: start, end: end })
            .then((response: IResponsePaginationEvent) => {
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
                return resolve(EventModel.searchNewStudentsEvent(obj.eventId, obj.searchValue, obj.page));
            } else {
                return resolve(
                    VisitModel.getVisit({ event: obj.eventId, search: obj.searchValue, page: obj.page })
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
