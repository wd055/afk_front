import { Snackbar, Avatar } from '@vkontakte/vkui';
import { Icon24Error, Icon16Done } from '@vkontakte/icons';
import { textResponseCode } from '../consts/errors';
import React from 'react';
import { ESetSnackbar } from '../App';

export const redIcon = {
    color: 'var(--field_error_border)'
};
export const blueIcon = {
    color: 'var(--accent)'
};
export const greenIcon = {
    color: 'var(--field_valid_border)'
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

export const successIconSnackbar = (
    <Avatar size={24} style={blueBackground}>
        <Icon16Done fill="#fff" width={14} height={14} />
    </Avatar>
);
export const errorIconSnackbar = (
    <Avatar size={24} style={redBackground}>
        <Icon24Error fill="#fff" width={14} height={14} />
    </Avatar>
);

export interface IStatusSnackbarText {
    success?: boolean;
    text?: string;
    duration?: number;
    statusCodeForText?: number;
}

export function callSnackbar({
    success = true,
    text = '',
    duration = 4000,
    statusCodeForText
}: IStatusSnackbarText): Promise<void> {
    return new Promise((resolve) => {
        let snackbar = (
            <Snackbar
                duration={duration}
                layout="vertical"
                onClose={() => {
                    ESetSnackbar(null);
                    return resolve();
                }}
                before={success ? successIconSnackbar : errorIconSnackbar}
            >
                {text === '' && statusCodeForText
                    ? textResponseCode(statusCodeForText)
                    : text === ''
                    ? success
                        ? 'Успешно'
                        : 'Ошибка'
                    : text}
            </Snackbar>
        );
        ESetSnackbar(snackbar);
    });
}

export const catchSnackbar = () => {
    callSnackbar({ success: false, text: 'Ошибка запроса!' });
};
