import React, { FunctionComponent } from 'react';
import { Icon28UnpinOutline } from '@vkontakte/icons';
import ReportSubsModel, { ReportSubs } from '../../models/ReportSubscription';
import { callSnackbar, catchSnackbar } from '../../panels/style';
import { ResponseData } from '../../utils/requests';

type UnpinReportSubsProps = {
    reportSubs: ReportSubs;
    OnUnpin?: Function;
};

export const UnpinReportSubs: FunctionComponent<UnpinReportSubsProps> = ({ reportSubs, OnUnpin }: UnpinReportSubsProps) => {
    return (
        <Icon28UnpinOutline
            onClick={(e): void => {
                e.stopPropagation();
                ReportSubsModel.deleteReportSubs(reportSubs.id as number)
                    .then((response: ResponseData) => {
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
