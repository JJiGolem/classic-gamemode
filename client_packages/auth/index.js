"use strict";

mp.events.add('auth.init', () => {
    mp.gui.cursor.show(true, true);
    mp.players.local.freezePosition(true);
    mp.game.ui.displayRadar(false);
    mp.game.ui.displayHud(false);

    mp.players.local.position = new mp.Vector3(-1685.21, -1653.46, 183.55);
    mp.utils.cam.create(-1685.21, -1653.46, 193.55, -1639.35, -1575.13, 187.48);

    mp.callCEFV(`auth.show = true;`);
});

mp.events.add('auth.login', (data) => {
    mp.events.callRemote('auth.login', data);
});
mp.events.add('auth.login.result', (result, data) => {
    if (result == 7 && data) mp.callCEFV(`characterInfo.coins = ${data.donate}`);
    mp.callCEFV(`auth.showLoginResult(${result})`);
});

mp.events.add('auth.register', (data) => {
    mp.events.callRemote('auth.register', data);
});
mp.events.add('auth.register.result', (result, data) => {
    mp.callCEFV(`auth.showRegisterResult(${result})`);

    //temp
    //result == 9 && mp.events.call('auth.email.confirm', 0);
});

mp.events.add('auth.recovery.result', (result) => {
    mp.callCEFV(`auth.showRecoveryResult(${result})`);
});

mp.events.add('auth.email.confirm', (state) => {
    mp.events.callRemote('auth.email.confirm', state == 1);
    state == 0 && mp.callCEFV(`auth.show = false;`);
});
mp.events.add('auth.email.confirm.code', (code) => {
    mp.events.callRemote('auth.email.confirm.code', code);
});
mp.events.add('auth.email.confirm.result', (result) => {
    mp.callCEFV(`auth.showEmailConfirmResult(${result})`);
});
