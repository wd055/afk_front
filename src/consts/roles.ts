export const Roles = {
    admin: 0,
    teacher: 1,
    student: 2
};
export let userRole: number = Roles.student;
export let thisAdmin = false;

export const setUserRole = (newRole: number): void => {
    userRole = newRole;
    thisAdmin = newRole === Roles.admin;
};
