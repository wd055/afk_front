export interface IVKWebApp {
    type: string;
    data: any;
}

export interface IVKWebAppError extends IVKWebApp {
    type: string;
    data: {
        error_type: '...';
        error_data: any;
    };
}
export interface IVKWebAppOpenCodeReaderResultData {
    code_data: string;
}

export interface IVKWebAppOpenCodeReaderResult extends IVKWebApp {
    data: IVKWebAppOpenCodeReaderResultData;
}

export interface IVKWebAppGetClientVersionData {
    platform: string;
    version: string;
}

export interface IVKWebAppGetClientVersionResultData extends IVKWebApp {
    data: IVKWebAppGetClientVersionData;
}
