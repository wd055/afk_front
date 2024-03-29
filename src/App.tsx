import React, { ReactChild, useEffect, useState } from 'react';
import {
	withAdaptivity,
	Panel,
	Placeholder,
	ModalPage,
	ModalPageHeader,
	Group,
	ScreenSpinner,
	ModalRoot,
	View,
	PanelHeader,
	PanelHeaderBack,
	ConfigProvider,
	AdaptivityProvider,
	AppRoot
} from '@vkontakte/vkui';
import { Icon56CheckCircleOutline, Icon56ErrorOutline } from '@vkontakte/icons';
import { redIcon, blueIcon } from './panels/style';
import { CalendarPanel } from './panels/Calendar';

import '@vkontakte/vkui/dist/vkui.css';
import { queryParams } from './consts/quertParams';
import OtherModel, { ResponseGetAdminList } from './models/Other';
import { Roles, setUserRole } from './consts/roles';
import { EventInfo } from './components/EventInfo/EventInfo';
import { StudentInfo } from './components/StudentInfo/StudentInfo';
import { EventPanel } from './panels/Event';
import EventModel, { Event } from './models/Event';
import StudentModel, { ResponseStudent, Student } from './models/Student';
import { TGo, TModals, TModalsArray, TPanels } from './consts/goto';
import bridge from '@vkontakte/vk-bridge';
import { EventForm } from './components/EventForm/EventForm';
import { StudentsPanel } from './panels/Students';
import { ReportPanel } from './panels/Report';
import { EditReportPanel } from './panels/EditReport';
import ReportModel from './models/Report';

type GoFunc = (name: TGo, itsModal?: boolean) => void;

export let ESetPopout: Function;
export let ESetSnackbar: Function;
export let EGo: GoFunc;
export let EGoBack: Function;

function App(): JSX.Element {
	const [history] = useState<TGo[]>([]);
	const [popout, setPopout] = useState<ReactChild | null>(null);
	const [snackbar, setSnackbar] = useState<ReactChild | null>(null);
	ESetPopout = setPopout;
	ESetSnackbar = setSnackbar;
	const [activePanel, setActivePanel] = useState<TPanels>('spinner');
	const [modal, setModal] = useState<TModals | null>();
	const [nonCurrnetStudent, setNonCurrnetStudent] = useState<boolean>(false);

	function goBack(): void {
		if (history.length === 1) {
			bridge.send('VKWebAppClose', { status: 'success' });
		} else if (history.length > 1) {
			if (TModalsArray.indexOf(history[history.length - 1]) !== -1) {
				setModal(null);
			} else if (TModalsArray.indexOf(history[history.length - 2]) === -1) {
				setActivePanel(history[history.length - 2] as TPanels);
			} else {
				setModal(history[history.length - 2] as TModals);
			}
			history.pop();
		}
	}

	function go(name: TGo, itsModal?: boolean): void {
		if (history[history.length - 1] !== name) {
			if (itsModal) {
				setModal(name as TModals);
			} else {
				setActivePanel(name as TPanels);
			}
			history.push(name);
			window.history.pushState({ panel: name }, name);
		}
	}

	function getAdminList(): void {
		OtherModel.getAdminList()
			.then((response: ResponseGetAdminList) => {
				if (!response.ok) {
					go('Success');
					return;
				}
				if (response.json.indexOf(Number(queryParams['vk_user_id'])) !== -1) {
					setUserRole(Roles.admin);
				}
				go('Calendar');
			})
			.finally(() => setPopout(null));
	}

	EGo = go;
	EGoBack = goBack;
	useEffect(() => {
		setPopout(<ScreenSpinner />);
		getAdminList();
		window.addEventListener('popstate', () => goBack());
		StudentModel.getCurrentStudent()
			.then((response: ResponseStudent) => {
				if (response.ok) {
					StudentModel.thisStudent = response.json;
				} else {
					setNonCurrnetStudent(true);
				}
			})
			.catch(() => {
				setNonCurrnetStudent(true);
			});
	}, []);

	const modals = (
		<ModalRoot activeModal={modal} onClose={goBack}>
			<ModalPage
				onClose={goBack}
				id={'eventInfo'}
				header={<ModalPageHeader>Мероприятие</ModalPageHeader>}
			>
				<EventInfo event={EventModel.currentEvent as Event} />
			</ModalPage>
			<ModalPage
				onClose={goBack}
				id={'eventForm'}
				header={<ModalPageHeader>Форма</ModalPageHeader>}
			>
				<EventForm
					event={EventModel.currentEvent as Event}
					onSave={(formsData: Event): void => {
						goBack();
						EventModel.currentEvent = formsData;
					}}
					onDelete={goBack}
				/>
			</ModalPage>
		</ModalRoot>
	);

	return (
		<ConfigProvider isWebView={true}>
			<AdaptivityProvider>
				<AppRoot>
					<View
						activePanel={activePanel}
						history={history}
						onSwipeBack={goBack}
						popout={popout}
						modal={modals}
					>
						<Panel id="spinner">
							<PanelHeader>Загрузка</PanelHeader>
						</Panel>

						<Panel id="Success">
							<PanelHeader>Успешная авторизация</PanelHeader>
							<Placeholder
								icon={<Icon56CheckCircleOutline style={blueIcon} />}
								stretched
								id="Placeholder"
							>
								Успешная авторизация!
							</Placeholder>
						</Panel>

						<Panel id="ErrorOauth">
							<PanelHeader>Ошибка авторизации</PanelHeader>
							<Group>
								<Placeholder
									icon={<Icon56ErrorOutline style={redIcon} />}
									stretched
									id="Placeholder"
								>
									Ошибка авторизации
									<br />
									Попробуйте позже или свяжитесь с администратором группы!
								</Placeholder>
							</Group>
						</Panel>

						<CalendarPanel id="Calendar" nonCurrnetStudent={nonCurrnetStudent}/>
						<EventPanel id="Event" />
						<StudentsPanel id="Students" />
						<ReportPanel id="Report" />
						<EditReportPanel id="EditReport" report={ReportModel.currentReport} />

						<Panel id="studentInfo">
							<PanelHeader left={<PanelHeaderBack onClick={goBack} />}>
								Журнал
							</PanelHeader>
							<StudentInfo student={StudentModel.currentStudent as Student} />
						</Panel>
					</View>
					{snackbar}
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

const AppAdatpive = withAdaptivity(App, { viewWidth: true });

export default AppAdatpive;
