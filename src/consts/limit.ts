export const Limit = 50;
export const getOffsetLimitQStr = (offset?: number, limit?: number): string => {
    return `offset=${offset || 0}&limit=${limit || Limit}`;
};
