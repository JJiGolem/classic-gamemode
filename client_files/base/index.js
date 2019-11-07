"use strict";

mp.events.add("render", () => {
    /// Отключение не используемых клавиш
    mp.game.controls.disableControlAction(1, 199, true); //Pause Menu (P)
    mp.game.controls.disableControlAction(1, 243, true); //Cheat Code (~)
});

// debug
var d = (text) => {
    mp.notify.info(text);
};
var debug = (text) => {
    mp.terminal.debug(text);
};

// Отображение в дискорде
mp.discord.update('Classic Roleplay | Alpha', 'classic-rp.ru');




/// Осноные клиентские события
/// auth.init
/// characterInit.init
/// characterInit.done


/// Описание основных функций клиентской части:
/// Вывод сообщения в чат
/// mp.chat.debug(text);
/// Вывод информации в серверную консоль(utils)
/// mp.console(text);
/// Модуль с сервисными функциями(подробнее см. в модуле)
/// mp.utils
/// Модуль войсчата(подробнее см. в модуле)
/// mp.speechChanel
/// Скрытие чата
/// mp.callCEFR('setOpacityChat', [0.0]);
/// Показ чата
/// mp.callCEFR('setOpacityChat', [1.0]);
/// Получение текущей сущности, с которой идет взаимодействие
/// mp.getCurrentInteractionEntity()

/// Описание основных клиентских переменных:
/// 1)
/// Массив, которые показывает "занят" ли игрок. Для примера, если занят, не может быть открыт чат или телефон и т.п.
mp.busy = {};
mp.busy.list = [];
mp.busy.mouses = [];
/// В данный массив добавляется название модуля, которым занят игрок, если игрок освобождается от данного модуля, то название модуля удаляется из массива
/// Название модуля записывать маленькими буквами, модули которые учитывают занятость(вписать свои):
/// LIST
/// voicechat
/// chat
/// carshow
/// phone
/// interaction
/// house.add
/// biz.info
/// economy
/// END LIST
/// Добавить модуль (true - операция провшла успешно, false - такой модуль уже содержится в массиве)
mp.busy.add = function(name, mouse = true, nocef = false) {
    if (!nocef) mp.callCEFV(`busy.add('${name}')`);
    if (mp.busy.list.includes(name)) return false;
    mp.busy.list.push(name);
    if (mouse) {
        mp.busy.mouses.push(name);
        mp.gui.cursor.show(true, true);
    }
    return true;
};
/// Содержит ли массив данный модуль
/// В случае если name = null, содержит ли массив какой-либо модуль
mp.busy.includes = function(name) {
    if (Array.isArray(name)) {
        for (let index = 0; index < name.length; index++) {
            if (mp.busy.list.includes(name[index])) {
                return true;
            }
        }
        return false;
    } else {
        if (name == null) {
            return mp.busy.list.length;
        } else {
            return mp.busy.list.includes(name);
        }
    }
};
/// Удалить модуль
mp.busy.remove = function(name, nocef = false) {
    if (!nocef) mp.callCEFV(`busy.remove('${name}')`);
    let index = mp.busy.list.findIndex(x => x == name);
    index != -1 && mp.busy.list.splice(index, 1);

    let mouseIndex = mp.busy.mouses.findIndex(x => x == name);
    mouseIndex != -1 && mp.busy.mouses.splice(mouseIndex, 1);
    if (mp.busy.mouses.length == 0) mp.gui.cursor.show(false, false);
};

mp.events.add({
    "busy.add": mp.busy.add,
    "busy.remove": mp.busy.remove,
    "time.main.tick": () => {
        if (mp.busy.mouses.length && !mp.gui.cursor.visible) mp.gui.cursor.show(true, true);
        mp.game.player.resetStamina();
    }
});

/// 2)
/// ...

/// Событие для вызова серверного события из браузера
mp.events.add("callRemote", (name, values) => {
    mp.events.callRemote(name, values);
});
