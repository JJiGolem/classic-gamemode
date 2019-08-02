export const showBank = flag => ({
    type: 'SHOW_BANK',
    payload: flag
});

export const loadBankInfo = info => ({
   type: 'LOAD_BANK_INFO',
   payload: info
});

export const pushBank = money => ({
    type: 'PUSH_BANK',
    payload: money
});

export const pushPhoneBank = money => ({
    type: 'PUSH_PHONE_BANK',
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