import { Div, Group, Panel, PanelHeader, PanelHeaderBack, RichCell, Search } from '@vkontakte/vkui';
import React, { useEffect, useState } from 'react';
import { EGo, EGoBack } from '../App';
import { InfiniteScroll } from '../components/InfiniteScroll/InfiniteScroll';
import StudentModel, { Student } from '../models/Student';
import { callSnackbar, catchSnackbar } from './style';

export interface StudentsPanelProps {
    id: string;
}

export const StudentsPanel = ({ id }: StudentsPanelProps): JSX.Element => {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [hasMore, setHasMore] = useState<boolean>(true);

    const getStudents = (thisSearchValue?: string, offset?: number, limit?: number): Promise<void> => {
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
            <PanelHeader left={<PanelHeaderBack onClick={(): void => EGoBack()} />}>Студенты</PanelHeader>
            <Group>
                <Div style={{ display: 'flex' }}>
                    <Search
                        value={searchValue}
                        onChange={(e): void => {
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
                    {students.map((student: Student) => {
                        return (
                            <RichCell
                                key={student.id}
                                onClick={(): void => {
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
