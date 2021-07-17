import React, { FunctionComponent, ReactNode, useState } from 'react';
import { Div, Footer } from '@vkontakte/vkui';

export interface NextFunction {
    (offset: number, limit: number): Promise<any>;
}

type InfiniteScrollProps = {
    children: JSX.Element | ReactNode;
    next: NextFunction;
    hasMore?: boolean;
    limit?: number;
    scrollThreshold?: number;
    height?: number;
    length: number;
    loader?: JSX.Element;
    endMessage?: JSX.Element;
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
}: InfiniteScrollProps) => {
    const [download, setDownload] = useState<boolean>(false);

    return (
        <Div
            style={{
                height: `${height}px`,
                overflow: 'auto',
                position: 'relative'
            }}
            onScroll={(e): void => {
                const element = e.currentTarget;
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
