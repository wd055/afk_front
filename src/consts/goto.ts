export type TPanels =
    | 'Calendar'
    | 'Success'
    | 'Event'
    | 'spinner'
    | 'ErrorOauth'
    | 'studentInfo'
    | 'Report'
    | 'EditReport'
    | 'Students';
export type TModals = 'eventInfo' | 'eventForm';
export const TPanelsArray = [
    'Calendar',
    'Success',
    'Event',
    'spinner',
    'ErrorOauth',
    'studentInfo',
    'Report',
    'EditReport',
    'Students'
];
export const TModalsArray = ['eventInfo', 'eventForm'];
export type TGo = TPanels | TModals;
