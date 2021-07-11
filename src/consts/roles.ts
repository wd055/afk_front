export const Roles = {
    admin: 0,
    teacher: 1,
    student: 2
};
export let userRole: number = Roles.student;

export const setUserRole = (newRole: number): void => {
    userRole = newRole;
};
