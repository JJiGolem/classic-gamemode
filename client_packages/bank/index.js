"use strict";

mp.events.add('bank.show', (info) => {
    if (mp.busy.includes()) return;
    if (!mp.busy.add("bank")) return;
    mp.callCEF('bank.show', [info]);
});
mp.events.add('bank.close', (fromServer) => {
    if (fromServer) {
        mp.callCEF('bank.close', []);
    }
    mp.busy.remove('bank');
});

mp.events.add('bank.push', (num) => { /// положить деньги на счет; num - кол-во денег
    mp.events.callRemote('bank.push', num);
});
mp.events.add('bank.push.ans', (result) => {
    mp.callCEF('bank.push.ans', [result]);  /// 3 - недостаточно наличных денег; 1 - успешно; 0 - неизвестная ошибка;
});

mp.events.add('bank.pop', (num) => { /// снять деньги со счета; num - кол-во денег
    mp.events.callRemote('bank.pop', num);
});
mp.events.add('bank.pop.ans', (result) => {
    mp.callCEF('bank.pop.ans', [result]); /// 2 - недостаточно денег на счете; 1 - успешно; 0 - неизвестная ошибка;
});

mp.events.add('bank.transfer', (num, numAccount) => {  /// снять деньги со счета; num - кол-во денег; numAccount - номер счета на который требуется выполнить перевод
    mp.events.callRemote('bank.transfer', num, numAccount);
});
mp.events.add('bank.pop.ans', (result) => {
    mp.callCEF('bank.pop.ans', [result]); /// 2 - недостаточно денег на счете; 1 - успешно; 0 - неизвестная ошибка
});

mp.events.add('bank.phone.push', (num) => { /// положить деньги на телефон; num - кол-во денег
    mp.events.callRemote('bank.phone.push', num);
});
mp.events.add('bank.phone.push.ans', (result) => {
    mp.callCEF('bank.phone.push.ans', [result]); /// 2 - недостаточно денег на счете; 1 - успешно; 0 - неизвестная ошибка
});

mp.events.add('bank.biz.push', (id, numDays) => { /// оплатить налог на бизнес; id - бизнеса; numDays - кол-во дней
    mp.events.callRemote('bank.biz.push', id, numDays);
});
mp.events.add('bank.biz.push.ans', (result) => {
    mp.callCEF('bank.biz.push.ans', [result]); /// 2 - недостаточно денег на счете; 1 - успешно; 0 - неизвестная ошибка
});

mp.events.add('bank.house.push', (id, numDays) => { /// оплатить налог на дом; id - дома; numDays - кол-во дней
    mp.events.callRemote('bank.house.push', id, numDays);
});
mp.events.add('bank.house.push.ans', (result) => {
    mp.callCEF('bank.house.push.ans', [result]); /// 2 - недостаточно денег на счете; 1 - успешно; 0 - неизвестная ошибка
});

mp.events.add('bank.biz.cashbox.push', (id, num) => { /// положить деньги в кассу бизнеса; id - бизнеса; num - кол-во денег
    mp.events.callRemote('bank.biz.cashbox.push', id, num);
});
mp.events.add('bank.biz.cashbox.push.ans', (result) => {
    mp.callCEF('bank.biz.cashbox.push.ans', [result]); /// 2 - недостаточно денег на счете; 1 - успешно; 0 - неизвестная ошибка
});

mp.events.add('bank.biz.cashbox.pop', (id, num) => { /// снять деньги из кассы бизнеса; id - бизнеса; num - кол-во денег
    mp.events.callRemote('bank.biz.cashbox.pop', id, num);
});
mp.events.add('bank.biz.cashbox.pop.ans', (result) => {
    mp.callCEF('bank.biz.cashbox.pop.ans', [result]); /// 4 - недостаточно денег в кассе бизнеса; 1 - успешно; 0 - неизвестная ошибка
});