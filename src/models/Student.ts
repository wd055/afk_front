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

export class StudentModel {
    currentStudent: IStudent | null = null;

    getStudents(search?: string, page?: number): Promise<IResponsePaginationStudent> {
        return HttpRequests.get(`/students/?search=${search}&page=${page || 1}`).then(parseJson);
    }
    getStudent(studentId?: string): Promise<IResponseStudent> {
        return HttpRequests.get(`/students/${studentId}`).then(parseJson);
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
