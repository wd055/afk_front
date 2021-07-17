import { getOffsetLimitQStr } from '../consts/limit';
import HttpRequests, { ResponseData, parseJson } from '../utils/requests';
import { Pagination } from './Other';

export interface Student {
    url?: string;
    full_name?: string;
    student?: number;
    id?: number; //student
    login?: string;
    login_eng?: string;
    vk_id?: string;
    surname?: string;
    name?: string;
    second_name?: string;
    birthday?: string | Date | null;
    group?: string;
    phone?: string;
    email?: string;
    department?: string;
    teacher?: string;
    agree?: boolean;
}

export interface PaginationStudent extends Pagination {
    results: Array<Student>;
}

export interface ResponsePaginationStudent extends ResponseData {
    json: PaginationStudent;
}

export interface ResponseStudent extends ResponseData {
    json: Student;
}

const setIdStudent = (student: Student): Student => {
    student.id = student.student || student.id;
    return student;
};

const setIdStudentResponse = (response: ResponseStudent): ResponseStudent => {
    response.json = setIdStudent(response.json);
    return response;
};

const setIdStudentsResponse = (response: ResponsePaginationStudent): ResponsePaginationStudent => {
    response.json.results = response.json.results.map(setIdStudent);
    return response;
};

export class StudentModel {
    currentStudent: Student | null = null;
    thisStudent: Student | null = null;

    getStudents(search?: string, offset?: number, limit?: number): Promise<ResponsePaginationStudent> {
        return HttpRequests.get(`/students/?search=${search || ''}&${getOffsetLimitQStr(offset, limit)}`)
            .then(parseJson)
            .then(setIdStudentsResponse);
    }
    getStudent(studentId?: string | number): Promise<ResponseStudent> {
        return HttpRequests.get(`/students/${studentId}`).then(parseJson).then(setIdStudentResponse);
    }
    getCurrentStudent(): Promise<ResponseStudent> {
        return HttpRequests.get('/get_current_student').then(parseJson).then(setIdStudentResponse);
    }
}

class StudentModelInstance {
    static instance: StudentModel | null = null;

    static getInstance(): StudentModel {
        if (!StudentModelInstance.instance) {
            StudentModelInstance.instance = new StudentModel();
        }

        return StudentModelInstance.instance;
    }
}

export default StudentModelInstance.getInstance();
