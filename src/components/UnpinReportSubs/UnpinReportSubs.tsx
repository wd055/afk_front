import React, { FunctionComponent } from 'react';
import { Icon28UnpinOutline } from '@vkontakte/icons';
import ReportSubsModel, { IReportSubs } from '../../models/ReportSubscription';
import { callSnackbar, catchSnackbar } from '../../panels/style';
import { IResponseData } from '../../utils/requests';

type UnpinReportSubsProps = {
    reportSubs: IReportSubs;
    OnUnpin?: Function;
};

export const UnpinReportSubs: FunctionComponent<UnpinReportSubsProps> = ({ reportSubs, OnUnpin }, props) => {
    return (
        <Icon28UnpinOutline
            onClick={(e) => {
                e.stopPropagation();
                ReportSubsModel.deleteReportSubs(reportSubs.id as number)
                    .then((response: IResponseData) => {
                        if (response.ok) {
                            if (OnUnpin) OnUnpin();
                            callSnackbar({});
                        } else {
                            callSnackbar({ success: false, statusCodeForText: response.status });
                        }
                    })
                    .catch(catchSnackbar);
            }}
        />
    );
};
