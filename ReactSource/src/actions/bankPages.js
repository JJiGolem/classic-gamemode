export const addPageBank = page => ({
    type: 'ADD_PAGE_BANK',
    payload: page
});

export const setPageBank = page => ({
    type: 'SET_PAGE_BANK',
    payload: page
});

export const closePageBank = () => ({
    type: 'CLOSE_PAGE_BANK'
});