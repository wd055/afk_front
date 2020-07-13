import React from 'react';

import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';

import Icon24Error from '@vkontakte/icons/dist/24/error';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';

export const redIcon = {
    color: 'var(--field_error_border)'
    // color: 'red'
};
export const blueIcon = {
    color: 'var(--accent)'
};
export const orangeBackground = {
    backgroundImage: 'linear-gradient(135deg, #ffb73d, #ffa000)'
};

export const blueBackground = {
    backgroundColor: 'var(--accent)'
};
export const redBackground = {
    backgroundColor: 'var(--field_error_border)'
};

export function statusSnackbar(status, setSnackbar) {
    var text = "Ошибка авторизации";

    if (status === 400)text="Ошибка запроса"
    else if (status === 401)text="Ошибка авторизации"
    else if (status === 403)text="Ошибка доступа"
    else if (status === 0)text="Ошибка подключения"

    const successSnackbar = <Snackbar
        layout="vertical"
        onClose={() => setSnackbar(null)}
        before={<Avatar size={24} style={blueBackground}><Icon28CheckCircleOutline fill="#fff" width={14} height={14} /></Avatar>}
    >
        Успешно!
        </Snackbar>;

    const errorSnackbar = <Snackbar
        layout="vertical"
        onClose={() => setSnackbar(null)}
        before={<Avatar size={24} style={redBackground}><Icon24Error fill="#fff" width={14} height={14} /></Avatar>}
    >
        {text}
        </Snackbar>

    if (status === 200) setSnackbar(successSnackbar);
    else setSnackbar(errorSnackbar);

    if (status === 200) return successSnackbar;
    else return errorSnackbar;
}