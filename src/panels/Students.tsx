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
import { InfiniteScroll } from '../components/InfiniteScroll/InfiniteScroll';
import StudentModel, { IStudent } from '../models/Student';
import { callSnackbar, catchSnackbar } from './style';
// import InfiniteScroll from 'react-infinite-scroll-component';

export interface StudentsPanelProps {
    id: string;
}

export const StudentsPanel = ({ id }: StudentsPanelProps) => {
    const [students, setStudents] = useState<IStudent[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [hasMore, setHasMore] = useState<boolean>(true);

    const getStudents = (thisSearchValue?: string, offset?: number, limit?: number) => {
        return StudentModel.getStudents(thisSearchValue, offset, limit)
            .then((response) => {
                if (!response.ok) {
                    callSnackbar({ success: false, statusCodeForText: response.status });
                    return;
                }

                if (!response.json.next) {
                    setHasMore(false);
                }

                if (searchValue === thisSearchValue) {
                    setStudents(students.concat(response.json.results));
                } else {
                    setStudents(response.json.results);
                }
            })
            .catch(catchSnackbar);
    };

    useEffect(() => {
        getStudents(searchValue);
    }, []);

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
                            getStudents(value);
                        }}
                        placeholder="Поиск по Фамилии или Имени"
                    />
                </Div>
            </Group>
            <Group>
                <InfiniteScroll
                    next={getStudents.bind(this, searchValue)}
                    hasMore={hasMore}
                    length={students.length}
                >
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
                </InfiniteScroll>
            </Group>
        </Panel>
    );
};
