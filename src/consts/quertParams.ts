const parseQueryString = (str: string): any => {
    return str
        .slice(1)
        .split('&')
        .map((queryParam) => {
            const kvp = queryParam.split('=');
            return { key: kvp[0], value: kvp[1] };
        })
        .reduce((query: any, kvp) => {
            query[kvp.key] = kvp.value;
            return query;
        }, {});
};

export const queryParams = parseQueryString(window.location.search);
export const hashParams = parseQueryString(window.location.hash);
export const thisMobile =
    queryParams.vk_platform === 'mobile_android' || queryParams.vk_platform === 'mobile_iphone';
