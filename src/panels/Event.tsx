import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

import { catchSnackbar, callSnackbar } from './style';

import {
    Button,
    Div,
    PanelHeaderBack,
    RichCell,
    Group,
    List,
    Search,
    IconButton,
    Gradient,
    Spinner,
    Footer,
    TabbarItem,
    Header,
    Panel,
    PanelHeader,
    CellButton
} from '@vkontakte/vkui';
import {
    Icon28QrCodeOutline,
    Icon28AddCircleOutline,
    Icon24Send,
    Icon28ChevronBack,
    Icon28InfoOutline
} from '@vkontakte/icons';
import { snackbarDelay } from '../consts/snackbar';
import EventModel, { IResponseEvent } from '../models/Event';
import { IVKWebAppOpenCodeReaderResultData } from '../consts/bridgesType';
import { TQRData } from '../consts/QR';
import { TAuthOrder } from '../consts/events';
import StudentModel, { IResponseStudent } from '../models/Student';
import EventController, { IStudentVisit } from '../controllers/Event';
import { Roles, userRole } from '../consts/roles';
import { thisMobile } from '../consts/quertParams';
import { EGo as go, EGoBack as goBack } from '../App';

export interface IEventPanel {
    id: string;
}

export const Event = ({ id }: IEventPanel) => {
    const [students, setStudents] = useState<IStudentVisit[]>([]);
    const [updateStudentsList_v, updateStudentsList] = useState({});
    const [searchValue, setSearchValue] = useState<string>('');
    const [next, setNext] = useState<string | null>();
    const [page, setPage] = useState<number>(1);
    const [download, setDownload] = useState(false);
    const [searchNewStudent, setSearchNewStudent] = useState<boolean>(false);
    const [QROrder, setQROrder] = useState<TAuthOrder>('final');
    const [QRData, setQRData] = useState<TQRData | null>();
    const [auth_type_is_single] = useState(EventModel.currentEvent?.auth_type === 'single');
    let eventId = EventModel.currentEvent?.id || 0;

    const setVisit = (eventId: number, student_vk_id: number | string, authOrder: TAuthOrder) => {
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
            .catch(catchSnackbar)
            .finally(() => {
                updateStudentsList({});
            });
    };

    const sendReport = (eventId: number, authOrder: TAuthOrder) => {
        EventModel.sendReportEvent(eventId, authOrder)
            .then((response: IResponseEvent) => {
                if (!response.ok) {
                    callSnackbar({ success: false, statusCodeForText: response.status });
                    return;
                }
                callSnackbar({});
            })
            .catch(catchSnackbar);
    };

    const getStudents = (eventId: number, searchValue?: string, next?: string) => {
        setDownload(true);
        if (!next) {
            setPage(1);
        }
        EventController.searchStudentsList({
            eventId,
            searchValue,
            next,
            searchNewStudent,
            page
        })
            .then(({ studentsList, response }) => {
                if (!response.ok) {
                    callSnackbar({ success: false, statusCodeForText: response.status });
                    return;
                }

                if (response.json.next) {
                    setPage(page + 1);
                } else {
                    setPage(1);
                }

                setNext(response.json.next);
                if (next) {
                    studentsList = students.concat(studentsList);
                }
                setStudents(studentsList);
            })
            .catch(() => {
                catchSnackbar();
            })
            .finally(() => setDownload(false));
    };

    useEffect(() => {
        bridge.subscribe(({ detail: { type, data } }) => {
            if (type === 'VKWebAppOpenCodeReaderResult') {
                try {
                    data = JSON.parse((data as IVKWebAppOpenCodeReaderResultData).code_data);
                } catch (error) {
                    console.error(error);
                }
                setQRData(data as TQRData);
            }
        });
        getStudents(eventId, searchValue);
    }, []);

    useEffect(() => {
        if (QRData && QRData.vk_user_id) {
            EventModel.setVisitEvent(eventId, {
                student_vk_id: QRData.vk_user_id,
                auth_order: QROrder
            });
            setTimeout(() => {
                bridge.send('VKWebAppOpenCodeReader');
            }, snackbarDelay);
        } else if (QRData) {
            callSnackbar({
                success: false,
                text: 'Ошибка в QR коде!',
                duration: snackbarDelay
            });
        }
    }, [QRData]);

    useEffect(() => {
        // setNext(null);
        // setPage(1);
        getStudents(eventId, searchValue);
    }, [searchNewStudent, updateStudentsList_v]);

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => goBack()} />}>Мероприятие</PanelHeader>
            <Group>
                <CellButton
                    onClick={() => {
                        go('eventForm', true);
                    }}
                >
                    Редактировать мероприятия
                </CellButton>
            </Group>
            <Group header={<Header>Отчеты</Header>}>
                <Div style={{ display: 'flex' }}>
                    {!auth_type_is_single && (
                        <Button
                            size="l"
                            style={{ marginRight: 8 }}
                            onClick={() => sendReport(eventId, 'initial')}
                            after={<Icon24Send />}
                        >
                            Отправить себе всех
                        </Button>
                    )}
                    <Button
                        size="l"
                        style={{ marginRight: 8 }}
                        onClick={() => sendReport(eventId, 'final')}
                        after={<Icon24Send />}
                    >
                        Отправить себе закончивших
                    </Button>
                </Div>
            </Group>

            <Group>
                <Gradient to="bottom" mode={searchNewStudent ? 'tint' : 'white'}>
                    <Div style={{ display: 'flex' }}>
                        <Search
                            value={searchValue}
                            onChange={(e) => {
                                const { value } = e.currentTarget;
                                setSearchValue(value);
                                setNext(null);
                                setPage(1);
                                getStudents(eventId, value);
                            }}
                            placeholder="Поиск по Фамилии или Имени"
                        />
                        {download && <Spinner size="medium" />}
                        {thisMobile &&
                            (auth_type_is_single ? (
                                <IconButton
                                    onClick={() => {
                                        console.log('final');
                                        setQROrder('final');
                                        bridge.send('VKWebAppOpenCodeReader');
                                    }}
                                    icon={<Icon28QrCodeOutline style={{ color: 'var(--accent)' }} />}
                                    style={{ marginRight: 8 }}
                                />
                            ) : (
                                <div className="Tabbar Tabbar--l-vertical" style={{ position: 'static' }}>
                                    <TabbarItem
                                        onClick={() => {
                                            console.log('initial');
                                            setQROrder('initial');
                                            bridge.send('VKWebAppOpenCodeReader');
                                        }}
                                        text="Начало"
                                        selected
                                    >
                                        <Icon28QrCodeOutline style={{ paddingRight: 8 }} />
                                    </TabbarItem>
                                    <TabbarItem
                                        onClick={() => {
                                            console.log('final');
                                            setQROrder('final');
                                            bridge.send('VKWebAppOpenCodeReader');
                                        }}
                                        text="Конец"
                                        selected
                                    >
                                        <Icon28QrCodeOutline style={{ paddingRight: 8 }} />
                                    </TabbarItem>
                                </div>
                            ))}
                        {!searchNewStudent ? (
                            <IconButton
                                onClick={() => {
                                    setSearchNewStudent(true);
                                    setNext(null);
                                    setPage(1);
                                }}
                                icon={<Icon28AddCircleOutline style={{ color: 'var(--accent)' }} />}
                                style={{ marginRight: 8 }}
                            />
                        ) : (
                            <IconButton
                                onClick={() => {
                                    setSearchNewStudent(false);
                                    setNext(null);
                                    setPage(1);
                                }}
                                icon={<Icon28ChevronBack style={{ color: 'var(--accent)' }} />}
                                style={{ marginRight: 8 }}
                            />
                        )}
                    </Div>
                    <Div
                        style={{
                            height: '550px',
                            overflow: 'auto',
                            position: 'relative'
                        }}
                        onScroll={(e) => {
                            let element = e.currentTarget;
                            if (
                                element.scrollTop + element.clientHeight >= element.scrollHeight - 250 &&
                                !download &&
                                next !== null
                            ) {
                                getStudents(eventId, searchValue, next);
                            }
                        }}
                    >
                        <List>
                            {students.map((student: IStudentVisit) => (
                                <RichCell
                                    key={student.id}
                                    caption={
                                        student.authOrder && student.authOrder === 'initial'
                                            ? 'Начал'
                                            : student.authOrder === 'final'
                                            ? auth_type_is_single
                                                ? 'Отметился'
                                                : 'Закончил'
                                            : 'Не начал'
                                    }
                                    actions={
                                        userRole === Roles.admin ? (
                                            <>
                                                {student.authOrder && student.authOrder !== 'final' && (
                                                    <Button
                                                        onClick={() =>
                                                            setVisit(eventId, student.vk_id || 0, 'final')
                                                        }
                                                        size="m"
                                                        mode="outline"
                                                    >
                                                        Завершить
                                                    </Button>
                                                )}
                                                {!student.authOrder &&
                                                    (EventModel.currentEvent?.auth_type === 'single' ? (
                                                        <Button
                                                            onClick={() =>
                                                                setVisit(eventId, student.vk_id || 0, 'final')
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
                                                                    setVisit(
                                                                        eventId,
                                                                        student.vk_id || 0,
                                                                        'initial'
                                                                    )
                                                                }
                                                                size="m"
                                                                mode="outline"
                                                            >
                                                                Начать
                                                            </Button>
                                                            <Button
                                                                onClick={() =>
                                                                    setVisit(
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
                                    // onClick={() => {
                                    //   go("studentInfo", true);
                                    //   props.setGlobalProps({
                                    //     ...props.globalProps,
                                    //     student: student,
                                    //   });
                                    // }}
                                    after={
                                        <Icon28InfoOutline
                                            onClick={() => {
                                                StudentModel.currentStudent = student;
                                                go('studentInfo');
                                            }}
                                        />
                                    }
                                    disabled
                                >
                                    {student.full_name}
                                </RichCell>
                            ))}
                        </List>
                        {!next && !download && <Footer>По вашему запросу больше ничего нет</Footer>}
                    </Div>
                </Gradient>
            </Group>
        </Panel>
    );
};
