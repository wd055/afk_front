import React, { FunctionComponent, ReactNode, useState } from 'react';
import { Div, Footer } from '@vkontakte/vkui';

export interface INextFunction {
    (offset: number, limit: number): Promise<any>;
}

type InfiniteScrollProps = {
    children: ReactNode;
    next: INextFunction;
    hasMore?: boolean;
    limit?: number;
    scrollThreshold?: number;
    height?: number;
    length: number;
    loader?: ReactNode;
    endMessage?: ReactNode;
};

export const InfiniteScroll: FunctionComponent<InfiniteScrollProps> = ({
    children,
    next,
    hasMore = true,
    limit = 50,
    height = 500,
    length = 0,
    scrollThreshold = 250,
    loader = <Footer>Загрузка</Footer>,
    endMessage = <Footer>Конец списка</Footer>
}) => {
    const [download, setDownload] = useState<boolean>(false);

    return (
        <Div
            style={{
                height: `${height}px`,
                overflow: 'auto',
                position: 'relative'
            }}
            onScroll={(e) => {
                let element = e.currentTarget;
                if (
                    element.scrollTop + element.clientHeight >= element.scrollHeight - scrollThreshold &&
                    !download &&
                    hasMore
                ) {
                    setDownload(true);
                    next(length, limit).finally(() => setDownload(false));
                }
            }}
        >
            {children}
            {download && loader}
            {!hasMore && endMessage}
        </Div>
    );
};
