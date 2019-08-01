"use strict";

mp.events.add('money.change', (cash, bank) => {
    mp.events.call('hud.setData', {
        cash: cash,
        bank: bank
    });
});