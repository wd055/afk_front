import {
    Div,
    Group,
    List,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    RichCell,
    Search,
    Spinner
} from '@vkontakte/vkui';
import React, { useEffect, useState } from 'react';
import { EGo, EGoBack } from '../App';
import StudentModel, { IStudent } from '../models/Student';
import { callSnackbar, catchSnackbar } from './style';

export interface StudentsPanelProps {
    id: string;
}

export const StudentsPanel = ({ id }: StudentsPanelProps) => {
    const [students, setStudents] = useState<IStudent[]>([]);
    const [updateStudentsList_v, updateStudentsList] = useState({});
    const [searchValue, setSearchValue] = useState<string>('');
    const [next, setNext] = useState<string | null>();
    const [page, setPage] = useState<number>(1);
    const [download, setDownload] = useState(false);

    const getStudents = (searchValue?: string, next?: string) => {
        setDownload(true);
        if (!next) {
            setPage(1);
        }
        StudentModel.getStudents(searchValue, page)
            .then((response) => {
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
                    response.json.results = students.concat(response.json.results);
                }
                setStudents(response.json.results);
            })
            .catch(() => {
                catchSnackbar();
            })
            .finally(() => setDownload(false));
    };

    useEffect(() => {
        getStudents(searchValue);
    }, []);

    useEffect(() => {
        getStudents(searchValue);
    }, [updateStudentsList_v]);

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => EGoBack()} />}>Студенты</PanelHeader>
            <Group>
                <Div style={{ display: 'flex' }}>
                    <Search
                        value={searchValue}
                        onChange={(e) => {
                            const { value } = e.currentTarget;
                            setSearchValue(value);
                            setNext(null);
                            setPage(1);
                            getStudents(value);
                        }}
                        placeholder="Поиск по Фамилии или Имени"
                    />
                    {download && <Spinner size="medium" />}
                </Div>
            </Group>
            <Group>
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
                            getStudents(searchValue, next);
                        }
                    }}
                >
                    <List>
                        {students.map((student: IStudent) => {
                            return (
                                <RichCell
                                    key={student.id}
                                    onClick={() => {
                                        StudentModel.currentStudent = student;
                                        EGo('studentInfo');
                                    }}
                                >
                                    {student.full_name}
                                </RichCell>
                            );
                        })}
                    </List>
                </Div>
            </Group>
        </Panel>
    );
};
