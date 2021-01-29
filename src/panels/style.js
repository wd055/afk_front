import React from "react";

import Snackbar from "@vkontakte/vkui/dist/components/Snackbar/Snackbar";
import Avatar from "@vkontakte/vkui/dist/components/Avatar/Avatar";

import Icon24Error from "@vkontakte/icons/dist/24/error";
import Icon16Done from "@vkontakte/icons/dist/16/done";

export const redIcon = {
  color: "var(--field_error_border)",
  // color: 'red'
};
export const blueIcon = {
  color: "var(--accent)",
};
export const greenIcon = {
  color: "var(--field_valid_border)",
};
export const orangeBackground = {
  backgroundImage: "linear-gradient(135deg, #ffb73d, #ffa000)",
};

export const blueBackground = {
  backgroundColor: "var(--accent)",
};
export const redBackground = {
  backgroundColor: "var(--field_error_border)",
};

export function statusSnackbar(statusCode, setSnackbar, duration = 4000) {
  var text = "Ошибка запроса";
  console.log(statusCode);

  if (statusCode === 401) text = "Ошибка авторизации";
  else if (statusCode === 403) text = "Ошибка доступа";
  else if (statusCode === 0) text = "Ошибка подключения";

  const successSnackbar = (
    <Snackbar
      duration={duration}
      layout="vertical"
      onClose={() => setSnackbar(null)}
      before={
        <Avatar size={24} style={blueBackground}>
          <Icon16Done fill="#fff" width={14} height={14} />
        </Avatar>
      }
    >
      Успешно!
    </Snackbar>
  );

  const errorSnackbar = (
    <Snackbar
      duration={duration}
      layout="vertical"
      onClose={() => setSnackbar(null)}
      before={
        <Avatar size={24} style={redBackground}>
          <Icon24Error fill="#fff" width={14} height={14} />
        </Avatar>
      }
    >
      {text}
    </Snackbar>
  );

  if (statusCode >= 200 && statusCode < 300) setSnackbar(successSnackbar);
  else setSnackbar(errorSnackbar);

  if (statusCode >= 200 && statusCode < 300) return successSnackbar;
  else return errorSnackbar;
}

export function statusSnackbarText(
  success,
  text,
  setSnackbar,
  duration = 4000
) {
  var snackbar = (
    <Snackbar
      duration={duration}
      layout="vertical"
      onClose={() => setSnackbar(null)}
      before={
        success ? (
          <Avatar size={24} style={blueBackground}>
            <Icon16Done fill="#fff" width={14} height={14} />
          </Avatar>
        ) : (
          <Avatar size={24} style={redBackground}>
            <Icon24Error fill="#fff" width={14} height={14} />
          </Avatar>
        )
      }
    >
      {text}
    </Snackbar>
  );

  setSnackbar(snackbar);
  return snackbar;
}
