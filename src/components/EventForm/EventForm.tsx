import React, { useState, useEffect, FunctionComponent } from 'react';

import {
    Group,
    FormLayoutGroup,
    Input,
    FormItem,
    Button,
    Div,
    DatePicker,
    Header,
    FormLayout,
    CustomSelect,
    CustomSelectOption,
    Textarea,
    Checkbox,
    Tabs,
    TabsItem
} from '@vkontakte/vkui';

import {
    departmentSelect,
    eventTypes,
    TAuthArray,
    TAuthName,
    TDepartment,
    TEvent
} from '../../consts/events';
import {
    getHoursAndMinutes,
    eventDateComposition,
    IDateFormat,
    getEventDate,
    setHoursAndMinutes,
    splitInputTime,
    formsEventIsValid
} from '../../utils/date';
import { Event } from '../../models/Event';
import EventController from '../../controllers/Event';
import { DatePickerDateFormat } from '@vkontakte/vkui/dist/components/DatePicker/DatePicker';
import { EGoBack as goBack } from '../../App';

type EventFormProps = {
    event?: Event;
    onSave?: Function;
    onEdit?: Function;
    onDelete?: Function;
};
const defaultDate = new Date(new Date().getFullYear(), 0, 1);

const defaultFormsData: Event = {
    title: '',
    auth_type: 'single',
    address: '',
    description: '',
    department: '',
    eventType: 'other',
    favorite: false,
    start: defaultDate,
    end: defaultDate
};

export const EventForm: FunctionComponent<EventFormProps> = ({
    event,
    onSave,
    onEdit,
    onDelete
}: EventFormProps) => {
    const [formsData, setFormsData] = useState<Event>(
        event === undefined || event === null
            ? defaultFormsData
            : {
                  id: event.id,
                  title: event.title,
                  address: event.address,
                  description: event.description,
                  department: event.department,
                  eventType: event.eventType,
                  favorite: event.favorite,
                  auth_type: event.auth_type,
                  start: event.start,
                  end: event.end
              }
    );

    useEffect(() => {
        if (onEdit !== undefined) onEdit(formsData);
    }, [formsData]);

    return (
        <Group
            header={<Header>{event === undefined ? 'Добавить мероприятие' : 'Изменить мероприятие'}</Header>}
        >
            <FormLayout>
                <FormItem top="Название" status={formsData.title.length > 0 ? 'valid' : 'error'}>
                    <Input
                        type="text"
                        defaultValue={formsData.title}
                        onChange={(e): void =>
                            setFormsData({
                                ...formsData,
                                title: e.currentTarget.value
                            })
                        }
                    />
                </FormItem>
                <FormItem top="Адрес">
                    <Input
                        type="text"
                        defaultValue={formsData.address}
                        onChange={(e): void =>
                            setFormsData({
                                ...formsData,
                                address: e.currentTarget.value
                            })
                        }
                    />
                </FormItem>
                <FormItem top="Описание">
                    <Textarea
                        defaultValue={formsData.description}
                        onChange={(e): void =>
                            setFormsData({
                                ...formsData,
                                description: e.currentTarget.value
                            })
                        }
                    />
                </FormItem>
                <FormItem top="Тип авторизации">
                    <Tabs>
                        {TAuthArray.map((item: string) => {
                            return (
                                <TabsItem
                                    key={item}
                                    onClick={(): void =>
                                        setFormsData({
                                            ...formsData,
                                            auth_type: item as keyof typeof TAuthName
                                        })
                                    }
                                    selected={formsData.auth_type === item}
                                >
                                    {TAuthName[item as keyof typeof TAuthName]}
                                </TabsItem>
                            );
                        })}
                    </Tabs>
                </FormItem>
                <FormItem>
                    <Checkbox
                        defaultChecked={formsData.favorite}
                        onChange={(e): void => setFormsData({ ...formsData, favorite: e.currentTarget.checked })}
                    >
                        Избранное
                    </Checkbox>
                </FormItem>
                <FormItem top="Кафедра">
                    <CustomSelect
                        placeholder="Обе"
                        options={departmentSelect}
                        value={formsData.department}
                        onChange={(option): void =>
                            setFormsData({
                                ...formsData,
                                department: option.currentTarget.value as TDepartment
                            })
                        }
                        renderOption={({ option: { icon }, ...otherProps }): JSX.Element => {
                            return <CustomSelectOption before={icon} {...otherProps} />;
                        }}
                    />
                </FormItem>
                <FormItem>
                    <CustomSelect
                        placeholder="Не выбрано"
                        options={eventTypes}
                        value={formsData.eventType}
                        onChange={(option): void =>
                            setFormsData({
                                ...formsData,
                                eventType: option.currentTarget.value as TEvent
                            })
                        }
                        renderOption={({ option: { icon }, ...otherProps }): JSX.Element => {
                            return <CustomSelectOption before={icon} {...otherProps} />;
                        }}
                    />
                </FormItem>
                <FormItem top="Дата">
                    <DatePicker
                        min={{
                            day: 1,
                            month: 1,
                            year: new Date().getFullYear() - 1
                        }}
                        onDateChange={(value: DatePickerDateFormat): void => {
                            const start = eventDateComposition(value as IDateFormat, formsData.start);
                            const end = eventDateComposition(value as IDateFormat, formsData.end);
                            setFormsData({
                                ...formsData,
                                start: start,
                                end: end
                            });
                        }}
                        defaultValue={getEventDate(formsData.start)}
                        dayPlaceholder="Д"
                        monthPlaceholder="ММ"
                        yearPlaceholder="ГГ"
                    />
                </FormItem>
                <FormLayoutGroup mode="horizontal">
                    <FormItem top="С" status={formsData.start.getHours() > 0 ? 'valid' : 'error'}>
                        <Input
                            type="time"
                            required
                            defaultValue={event === undefined ? '' : getHoursAndMinutes(formsData.start)}
                            onInput={(e): void => {
                                setFormsData({
                                    ...formsData,
                                    start: setHoursAndMinutes(
                                        formsData.start,
                                        splitInputTime(e.currentTarget.value)
                                    )
                                });
                            }}
                        />
                    </FormItem>
                    <FormItem
                        top="По"
                        status={formsData.start < formsData.end ? 'valid' : 'error'}
                        bottom={formsData.start < formsData.end ? '' : 'Окончание должно быть позже начала!'}
                    >
                        <Input
                            type="time"
                            required
                            defaultValue={event === undefined ? '' : getHoursAndMinutes(formsData.end)}
                            onInput={(e): void =>
                                setFormsData({
                                    ...formsData,
                                    end: setHoursAndMinutes(
                                        formsData.end,
                                        splitInputTime(e.currentTarget.value)
                                    )
                                })
                            }
                        />
                    </FormItem>
                </FormLayoutGroup>
                <Div style={{ display: 'flex' }}>
                    <Button
                        size="l"
                        stretched
                        disabled={!formsEventIsValid(formsData)}
                        onClick={(): void => {
                            if (onSave !== undefined) onSave(formsData);
                            EventController.saveEvent(formsData);
                        }}
                    >
                        {event === undefined ? 'Создать мероприятие' : 'Сохранить изменения'}
                    </Button>
                    {event && event.id && (
                        <Button
                            size="l"
                            mode="destructive"
                            style={{ marginLeft: 8 }}
                            onClick={(): void => {
                                if (onDelete !== undefined) onDelete(formsData);
                                if (formsData.id) {
                                    EventController.deleteEvent(formsData.id, () => {
                                        if (goBack) goBack();
                                    });
                                }
                            }}
                        >
                            Удалить
                        </Button>
                    )}
                </Div>
            </FormLayout>
        </Group>
    );
};
