import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { catchSnackbar, callSnackbar } from './style';
import {
    Button,
    Div,
    PanelHeaderBack,
    Group,
    Search,
    IconButton,
    Gradient,
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
    Icon28EditOutline
} from '@vkontakte/icons';
import { snackbarDelay } from '../consts/snackbar';
import EventModel, { Event, ResponseEvent } from '../models/Event';
import { VKWebAppOpenCodeReaderResultData } from '../consts/bridgesType';
import { TQRData } from '../consts/QR';
import { TAuthOrder } from '../consts/events';
import EventController, { StudentVisit } from '../controllers/Event';
import { thisMobile } from '../consts/quertParams';
import { EGo as go, EGoBack as goBack } from '../App';
import { EventInfo } from '../components/EventInfo/EventInfo';
import { InfiniteScroll } from '../components/InfiniteScroll/InfiniteScroll';
import { EventVisitItem } from '../components/EventVisitItem/EventVisitItem';

export interface EventPanelProps {
    id: string;
}

export const EventPanel = ({ id }: EventPanelProps): JSX.Element => {
    const [students, setStudents] = useState<StudentVisit[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchNewStudent, setSearchNewStudent] = useState<boolean>(false);
    const [QROrder, setQROrder] = useState<TAuthOrder>('final');
    const [QRData, setQRData] = useState<TQRData | null>();
    const [authTypeSingle] = useState(EventModel.currentEvent?.auth_type === 'single');
    const [hasMore, setHasMore] = useState<boolean>(true);
    const eventId = EventModel.currentEvent?.id || 0;

    const sendReport = (eventId: number, authOrder: TAuthOrder): void => {
        EventModel.sendReportEvent(eventId, authOrder)
            .then((response: ResponseEvent) => {
                if (!response.ok) {
                    callSnackbar({ success: false, statusCodeForText: response.status });
                    return;
                }
                callSnackbar({});
            })
            .catch(catchSnackbar);
    };

    const getStudents = (
        eventId: number,
        thisSearchValue?: string,
        offset?: number,
        limit?: number
    ): Promise<void> => {
        return EventController.searchStudentsList({
            eventId,
            searchValue: thisSearchValue,
            searchNewStudent,
            offset,
            limit
        })
            .then(({ studentsList, response }) => {
                if (!response.ok) {
                    callSnackbar({ success: false, statusCodeForText: response.status });
                    return;
                }

                if (!response.json.next) {
                    setHasMore(false);
                }

                if (searchValue === thisSearchValue) {
                    setStudents(students.concat(studentsList));
                } else {
                    setStudents(studentsList);
                }
            })
            .catch(catchSnackbar);
    };

    useEffect(() => {
        bridge.subscribe(({ detail: { type, data } }) => {
            if (type === 'VKWebAppOpenCodeReaderResult') {
                try {
                    data = JSON.parse((data as VKWebAppOpenCodeReaderResultData).code_data);
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
        setHasMore(true);
        getStudents(eventId, searchValue);
    }, [searchNewStudent]);

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={(): void => goBack()} />}>
                Мероприятие
            </PanelHeader>
            <Group>
                <CellButton
                    onClick={(): void => {
                        go('eventForm', true);
                    }}
                    before={<Icon28EditOutline />}
                >
                    Редактировать мероприятия
                </CellButton>
            </Group>
            <EventInfo event={EventModel.currentEvent as Event} />
            <Group header={<Header>Отчеты</Header>}>
                <Div style={{ display: 'flex' }}>
                    {!authTypeSingle && (
                        <Button
                            size="l"
                            style={{ marginRight: 8 }}
                            onClick={(): void => sendReport(eventId, 'initial')}
                            after={<Icon24Send />}
                        >
                            Отправить себе всех
                        </Button>
                    )}
                    <Button
                        size="l"
                        style={{ marginRight: 8 }}
                        onClick={(): void => sendReport(eventId, 'final')}
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
                            onChange={(e): void => {
                                const { value } = e.currentTarget;
                                setSearchValue(value);
                                getStudents(eventId, value);
                            }}
                            placeholder="Поиск по Фамилии или Имени"
                        />
                        {thisMobile &&
                            (authTypeSingle ? (
                                <IconButton
                                    onClick={(): void => {
                                        setQROrder('final');
                                        bridge.send('VKWebAppOpenCodeReader');
                                    }}
                                    style={{ marginRight: 8 }}
                                >
                                    <Icon28QrCodeOutline style={{ color: 'var(--accent)' }} />
                                </IconButton>
                            ) : (
                                <div
                                    className="Tabbar Tabbar--l-vertical"
                                    style={{ position: 'static' }}
                                >
                                    <TabbarItem
                                        onClick={(): void => {
                                            setQROrder('initial');
                                            bridge.send('VKWebAppOpenCodeReader');
                                        }}
                                        text="Начало"
                                        selected
                                    >
                                        <Icon28QrCodeOutline style={{ paddingRight: 8 }} />
                                    </TabbarItem>
                                    <TabbarItem
                                        onClick={(): void => {
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
                                onClick={(): void => {
                                    setStudents([]);
                                    setSearchNewStudent(true);
                                }}
                                style={{ marginRight: 8 }}
                            >
                                <Icon28AddCircleOutline style={{ color: 'var(--accent)' }} />
                            </IconButton>
                        ) : (
                            <IconButton
                                onClick={(): void => {
                                    setStudents([]);
                                    setSearchNewStudent(false);
                                }}
                                style={{ marginRight: 8 }}
                            >
                                <Icon28ChevronBack style={{ color: 'var(--accent)' }} />
                            </IconButton>
                        )}
                    </Div>
                    <InfiniteScroll
                        next={getStudents.bind(this, eventId, searchValue)}
                        hasMore={hasMore}
                        length={students.length}
                        height={400}
                    >
                        {students.map((student: StudentVisit) => (
                            <EventVisitItem
                                key={student?.visit?.id || student.id}
                                event={EventModel.currentEvent as Event}
                                student={student}
                            />
                        ))}
                    </InfiniteScroll>
                </Gradient>
            </Group>
        </Panel>
    );
};
