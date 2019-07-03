export const addBankInfo = info => ({
    type: 'ADD_BANK_INFO',
    payload: info
})

export const pushBank = money => ({
    type: 'PUSH_BANK',
    payload: money
});

export const popBank = money => ({
    type: 'POP_BANK',
    payload: money
});

export const transferBank = money => ({
    type: 'TRANSFER_BANK',
    payload: money
});

export const pushPhoneBank = money => ({
    type: 'PUSH_PHONE_BANK',
    payload: money
});

export const extendHouseBank = (index, days, money) => ({
    type: 'EXTEND_HOUSE',
    payload: {
        index,
        days,
        money
    }
})

export const extendBizBank = (index, days, money) => ({
    type: 'EXTEND_BIZ',
    payload: {
        index,
        days, 
        money
    }
});

export const pushCashBoxBiz = (index, money) => ({
    type: 'PUSH_CASHBOX',
    payload: {
        index,
        money
    }
});

export const popCashBoxBiz = (index, money) => ({
    type: 'POP_CASHBOX',
    payload: {
        index,
        money
    }
});