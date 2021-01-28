import React, { useState, useEffect } from "react";
import $ from "jquery";
import { main_url } from "../../App.js";

import {
    orangeBackground,
    blueBackground,
    redBackground,
    blueIcon,
    statusSnackbar,
    statusSnackbarText,
} from "../style";

import {
    Button,
    Div,
    DatePicker,
    Header,
    FormLayout,
    RichCell,
} from "@vkontakte/vkui";

import { Icon28AddOutline, Icon28AccessibilityOutline } from "@vkontakte/icons";

type StudentItemProps = {
    setSnackbar ? : Function,
    event ? : Object,
    onSave ? : Function,
    onEdit ? : Function,
};

export const StudentItem: FunctionComponent < StudentItemProps > = ({ event, onSave, onEdit, setSnackbar },
    props
) => {
    // <RichCell
    //   after={
    //     <Icon28AddOutline
    //       name="add"
    //       style={{ color: "var(--accent)", marginLeft: 8 }}
    //     />
    //   }
    //   actions={
    //     <HorizontalScroll>
    //       <div style={{ display: "flex" }}>
    //         <Button size="m" mode="outline">
    //           Группа
    //         </Button>
    //         <Button size="m" mode="outline" style={{ marginLeft: 8 }}>
    //           Логин
    //         </Button>
    //       </div>
    //     </HorizontalScroll>
    //   }
    //   before={
    //     <div style={{ top: "50%", marginRight: 12 }}>
    //       <p>1)</p>
    //     </div>
    //   }
    // >
    //   Власов Денис Владимирович
    // </RichCell>

    return ( <
        RichCell caption = "ИУ7-31Б, АФК"
        actions = { <
            >
            <
            Button size = "m"
            mode = "outline" >
            Начать <
            /Button> <
            Button size = "m"
            mode = "outline" >
            Завершить <
            /Button> <
            Button size = "m"
            mode = "outline" >
            Отметить <
            /Button> <
            Button size = "m"
            mode = "destructive" >
            Убрать с занятия <
            /Button> <
            />
        } >
        Власов Денис Владимирович <
        /RichCell>
    );
};