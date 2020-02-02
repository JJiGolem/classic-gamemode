"use strict";

let numTransfer = null;
let accountNumTransfer = null;

mp.events.add('bank.show', (info) => {
    if (mp.busy.includes()) return;
    if (!mp.busy.add("bank")) return;
    mp.callCEFR('bank.show', [info]);
});
mp.events.add('bank.close', (fromServer) => {
    if (fromServer) {
        mp.callCEFR('bank.close', []);
    }
    mp.busy.remove('bank');
});
mp.events.add('bank.update', (info) => {
    if (!mp.busy.includes("bank")) return;
    mp.callCEFR('bank.update', [info]);
});

mp.events.add('bank.push', (num) => { 
    mp.events.callRemote('bank.push', num);
});
mp.events.add('bank.push.ans', (result) => {
    mp.callCEFR('bank.push.ans', [result]); 
});

mp.events.add('bank.pop', (num) => {
    mp.events.callRemote('bank.pop', num);
});
mp.events.add('bank.pop.ans', (result) => {
    mp.callCEFR('bank.pop.ans', [result]);
});

mp.events.add('bank.transfer.ask', (numAccount, num) => {  
    numTransfer = num;
    accountNumTransfer = numAccount;
    mp.events.callRemote('bank.transfer.ask', numAccount);
});
mp.events.add('bank.transfer.ask.ans', (nick) => {
    mp.callCEFR('bank.transfer.ask.ans', [nick]);
});
mp.events.add('bank.transfer', () => { 
    mp.events.callRemote('bank.transfer', numTransfer, accountNumTransfer);
    numTransfer = null;
    accountNumTransfer = null;
});
mp.events.add('bank.transfer.ans', (result) => {
    mp.callCEFR('bank.transfer.ans', [result]);
});

mp.events.add('bank.phone.push', (num) => { 
    mp.events.callRemote('bank.phone.push', num);
});
mp.events.add('bank.phone.push.ans', (result) => {
    mp.callCEFR('bank.phone.push.ans', [result]); 
});

mp.events.add('bank.biz.push', (id, numDays) => {
    mp.events.callRemote('bank.biz.push', id, numDays);
});
mp.events.add('bank.biz.push.ans', (result) => {
    mp.callCEFR('bank.biz.push.ans', [result]); 
});

mp.events.add('bank.house.push', (id, numDays) => { 
    mp.events.callRemote('bank.house.push', id, numDays);
});
mp.events.add('bank.house.push.ans', (result) => {
    mp.callCEFR('bank.house.push.ans', [result]); 
});

mp.events.add('bank.biz.cashbox.push', (id, num) => { 
    mp.events.callRemote('bank.biz.cashbox.push', id, num);
});
mp.events.add('bank.biz.cashbox.push.ans', (result) => {
    mp.callCEFR('bank.biz.cashbox.push.ans', [result]); 
});

mp.events.add('bank.biz.cashbox.pop', (id, num) => { 
    mp.events.callRemote('bank.biz.cashbox.pop', id, num);
});
mp.events.add('bank.biz.cashbox.pop.ans', (result) => {
    mp.callCEFR('bank.biz.cashbox.pop.ans', [result]); 
});