import { getOffsetLimitQStr } from '../consts/limit';
import HttpRequests, { IResponseData, parseJson } from '../utils/requests';
import { IPagination } from './Other';

export interface IStudent {
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

export interface IPaginationStudent extends IPagination {
    results: Array<IStudent>;
}

export interface IResponsePaginationStudent extends IResponseData {
    json: IPaginationStudent;
}

export interface IResponseStudent extends IResponseData {
    json: IStudent;
}

const setIdStudent = (student: IStudent): IStudent => {
    student.id = student.student || student.id;
    return student;
};

const setIdStudentResponse = (response: IResponseStudent): IResponseStudent => {
    response.json = setIdStudent(response.json);
    return response;
};

const setIdStudentsResponse = (response: IResponsePaginationStudent): IResponsePaginationStudent => {
    response.json.results = response.json.results.map(setIdStudent);
    return response;
};

export class StudentModel {
    currentStudent: IStudent | null = null;
    thisStudent: IStudent | null = null;

    getStudents(search?: string, offset?: number, limit?: number): Promise<IResponsePaginationStudent> {
        return HttpRequests.get(`/students/?search=${search || ''}&${getOffsetLimitQStr(offset, limit)}`)
            .then(parseJson)
            .then(setIdStudentsResponse);
    }
    getStudent(studentId?: string | number): Promise<IResponseStudent> {
        return HttpRequests.get(`/students/${studentId}`).then(parseJson).then(setIdStudentResponse);
    }
    getCurrentStudent(): Promise<IResponseStudent> {
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
