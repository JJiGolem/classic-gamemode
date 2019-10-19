"use strict";

var prevCash = null,
    prevBank = null;

mp.events.add('money.change', (cash, bank) => {
    mp.events.call('hud.setData', {
        cash: cash,
        bank: bank
    });

    if (prevCash != null && prevBank != null) {
        if (prevCash < cash) mp.notify.success(`+$${cash - prevCash}`, `Наличные`);
        else if (prevCash > cash) mp.notify.error(`-$${prevCash - cash}`, `Наличные`);

        if (prevBank < bank) mp.notify.success(`+$${bank - prevBank}`, `Банк`);
        else if (prevBank > bank) mp.notify.error(`-$${prevBank - bank}`, `Банк`);
    }

    prevCash = cash;
    prevBank = bank;
});
