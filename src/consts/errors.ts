export const textResponseCode = (statusCode: number): string => {
    if (statusCode >= 200 && statusCode < 300) {
        return 'Успешно';
    }
    switch (statusCode) {
        case 401:
            return 'Ошибка авторизации';
        case 403:
            return 'Ошибка доступа';
        default:
            return 'Ошибка запроса';
    }
};
