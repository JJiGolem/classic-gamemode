"use strict"

mp.attachmentMngr.register("takeRod", "prop_fishing_rod_01", 26611, new mp.Vector3(0, -0.05, -0.03), new mp.Vector3(-40, 10, -50));

let peds = [
    {
        model: "cs_old_man2",
        position: {
            x: -1593.1,
            y: 5202.9,
            z: 4.3,
        },
        heading: 294.5,
        defaultScenario: 'WORLD_HUMAN_AA_SMOKE'
    },
    {
        model: "cs_old_man2",
        position: {
            x: 712.6,
            y: 4099.5,
            z: 35.8,
        },
        heading: 0,
        defaultScenario: 'WORLD_HUMAN_AA_SMOKE'
    },
    {
        model: "cs_old_man2",
        position: {
            x: -1633.6,
            y: -1120.9,
            z: 2.4,
        },
        heading: 224.7,
        defaultScenario: 'WORLD_HUMAN_AA_SMOKE'
    },
    {
        model: "cs_old_man2",
        position: {
            x: -426.5,
            y: 6355.8,
            z: 13.3,
        },
        heading: 33.14,
        defaultScenario: 'WORLD_HUMAN_AA_SMOKE'
    }
];

let localPlayer = mp.players.local;
let sqlId;

let timeoutEndFishing;

let isBinding = false;
let isEnter = false;
let isStarted = false;
let isFetch = false;
let isHaveRod = false;
let isShowPrompt = false;

let intervalFishing;
let isIntervalCreated = false;

const checkConditions = () => {
    return (!mp.busy.includes() && isHaveRod && !isEnter && !localPlayer.isInWater() && !localPlayer.vehicle);
}

mp.events.add('characterInit.done', () => {
    mp.events.call('fishing.game.exit');

    peds.forEach((current) => {
        mp.events.call('NPC.create', current);
    });
});

mp.events.add('render', () => {
    if (checkConditions()) {
        if (!isIntervalCreated) {
            isIntervalCreated = true;
            intervalFishing = setInterval(() => {
                let heading = localPlayer.getHeading() + 90;
                let point = {
                    x: localPlayer.position.x + 15*Math.cos(heading * Math.PI / 180.0),
                    y: localPlayer.position.y + 15*Math.sin(heading * Math.PI / 180.0),
                    z: localPlayer.position.z
                }

                // mp.console('water: ' + Math.abs(mp.game.water.getWaterHeight(point.x, point.y, point.z, 0)));
                // mp.console('ground: ' + mp.game.gameplay.getGroundZFor3dCoord(point.x, point.y, point.z - 5, 0.0, false));
                if (Math.abs(mp.game.water.getWaterHeight(point.x, point.y, point.z, 0)) > 0 && mp.game.gameplay.getGroundZFor3dCoord(point.x, point.y, point.z, 0.0, false) < 0) {
                    isShowPrompt = true;
                    mp.events.call('fishing.game.menu');
                } else {
                    if (isShowPrompt) {
                        bindButtons(false);
                        mp.events.call('prompt.hide');
                        isShowPrompt = false;
                    }
                }
            }, 1000);
        }
    } else {
        if (isIntervalCreated) {
            mp.events.call('prompt.hide');
            isShowPrompt = false;
            clearInterval(intervalFishing);
            isIntervalCreated = false;
        }
    }
});

mp.events.add('inventory.initItems', (items) => {
    for (let item in items) {
        let pockets = items[item].pockets;
        if (pockets && Object.keys(pockets).length !== 0) {
            pockets.forEach(pocket => {
                for (let pocketItem in pocket.items) {
                    if (pocket.items[pocketItem].itemId == 5) {
                        isHaveRod = true;
                        sqlId = pocket.items[pocketItem].sqlId;
                    }
                }
            });
        }
    }
});

mp.events.add('inventory.deleteItem', (item) => {
    if (item == sqlId) {
        isHaveRod = false;
        clearInterval(intervalFishing);
        isIntervalCreated = false;
        bindButtons(false);
        mp.events.call('prompt.hide');
        isShowPrompt = false;
    }
});

mp.events.add('inventory.addItem', (item) => {
    if (item.itemId == 5) {
        sqlId = item.sqlId;
        isHaveRod = true;
    }
});

mp.events.add('fishing.menu.show', () => {
   if (mp.busy.includes()) return;

   mp.busy.add('fishing.menu');
   mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["fishingMenu"])`);
   mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('fishing.menu.close', () => {
    mp.busy.remove('fishing.menu');
    mp.callCEFV(`selectMenu.show = false`);
});

mp.events.add('fishing.rod.buy', () => {
    mp.callCEFV(`selectMenu.loader = true`);
    mp.events.callRemote('fishing.rod.buy');
});

mp.events.add('fishing.rod.buy.ans', (ans) => {
    mp.callCEFV(`selectMenu.loader = false`);

    if (ans == 1) {
        mp.events.call('fishing.menu.close');
    }
});

mp.events.add('fishing.fish.sell', () => {
    mp.callCEFV(`selectMenu.loader = true`);
    mp.events.callRemote('fishing.fish.sell');
});

mp.events.add('fishing.fish.sell.ans', (ans) => {
    mp.callCEFV(`selectMenu.loader = false`);
    if (ans == 1) {
        mp.events.call('fishing.menu.close');
    }
});

mp.events.add('fishing.game.menu', () => {
    mp.events.call('prompt.showByName', 'fishing');
    bindButtons(true);
});

mp.events.add('fishing.game.enter', () => {
    if (mp.busy.includes()) return;

    clearTimeout(timeoutEndFishing);

    mp.busy.add('fishing.game', false);
    playBaseAnimation(true);
    mp.utils.disablePlayerMoving(true);
    localPlayer.freezePosition(true);
    mp.callCEFVN({ "fishing.show": true });
    isEnter = true;
});

mp.events.add('fishing.game.start', () => {
    playWaitAnimation(true);
    mp.callCEFVN({ "fishing.isStarted": true });
    mp.events.callRemote('fishing.game.start');
});

mp.events.add('fishing.game.fetch', (speed, zone, weight) => {
    playFetchAnimation(true);
    isFetch = true;
    mp.callCEFV(`fishing.fishFetch(${speed},${zone},${weight});`);
});

mp.events.add('fishing.game.end', (result) => {
    playBaseAnimation(true);
    mp.events.callRemote('fishing.game.end', result);
    timeoutEndFishing = setTimeout(() => {
        try {
            isStarted = false;
            mp.callCEFV(`fishing.clearData();`);
            mp.callCEFVN({ "fishing.isStarted": false });
        } catch (e) {
            
        }
    }, 1500);
});

mp.events.add('fishing.game.exit', () => {
    mp.events.callRemote('fishing.game.exit');
    bindButtons(false);
    isEnter = false;
    mp.events.call('prompt.hide');
    playBaseAnimation(false);
    mp.utils.disablePlayerMoving(false);
    localPlayer.freezePosition(false);
    mp.callCEFV(`fishing.clearData()`);
    mp.callCEFVN({ "fishing.show": false });
    mp.busy.remove('fishing.game');
});

let bindButtons = (state) => {
    if (state) {
        if (isBinding) return;
        isBinding = true;
        mp.keys.bind(0x45, true, fishingEnter);
        mp.keys.bind(0x20, true, fishingEnd);
        mp.keys.bind(0x46, true, fishingStart);
        mp.keys.bind(0x1B, false, fishingExit);
    }
    else {
        if (!isBinding) return;
        isBinding = false;
        mp.keys.unbind(0x45, true, fishingEnter);
        mp.keys.unbind(0x20, true, fishingEnd);
        mp.keys.unbind(0x46, true, fishingStart);
        mp.keys.unbind(0x1B, false, fishingExit);
    }
}

let fishingEnter = () => {
    if (mp.game.ui.isPauseMenuActive()) return;
    if (!isEnter) {
        mp.events.callRemote('fishing.game.enter');
        mp.events.call('prompt.hide');
    }
}

let fishingStart = () => {
    if (mp.game.ui.isPauseMenuActive()) return;
    if (isEnter && !isStarted) {
        playWaitAnimation(true);
        mp.callCEFVN({ "fishing.isStarted": true });
        mp.events.callRemote('fishing.game.start');
        isStarted = true;
    }
}

let fishingEnd = () => {
    if (mp.game.ui.isPauseMenuActive()) return;
    if (isEnter && isStarted && isFetch) {
        mp.callCEFV(`fishing.endFishing();`);
        isFetch = false;
    }
}

let fishingExit = () => {
    if (mp.game.ui.isPauseMenuActive()) return;
    if (!isFetch) {
        mp.events.call('fishing.game.exit');
        isEnter = false;
        isStarted = false;
    }
}

function playBaseAnimation(state, timeout) { /// Анимация держания удочки
    if (state) {
        if (!timeout) timeout = 0;
        setTimeout(()=> {
            mp.events.callRemote('animations.play', 'amb@world_human_stand_fishing@base', 'base', 1, 49);
            mp.attachmentMngr.addLocal("takeRod");
        }, timeout);
    } else {
        mp.attachmentMngr.removeLocal("takeRod");
        mp.events.callRemote('animations.stop');
    }
}

function playWaitAnimation(state, timeout) { /// Анимация начала рыбалки
    if (state) {
        if (!timeout) timeout = 0;
        setTimeout(()=> {
            mp.events.callRemote('animations.play', 'amb@world_human_stand_fishing@idle_a', 'idle_a', 1, 49);
            mp.attachmentMngr.addLocal("takeRod");
        }, timeout);
    } else {
        mp.attachmentMngr.removeLocal("takeRod");
        mp.events.callRemote('animations.stop');
    }
}

function playFetchAnimation(state, timeout) { /// Анимация вытягивания
    if (state) {
        if (!timeout) timeout = 0;
        setTimeout(()=> {
            mp.events.callRemote('animations.play', 'amb@world_human_stand_fishing@idle_a', 'idle_c', 1, 49);
            mp.attachmentMngr.addLocal("takeRod");
        }, timeout);
    } else {
        mp.attachmentMngr.removeLocal("takeRod");
        mp.events.callRemote('animations.stop');
    }
}
