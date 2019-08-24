"use strict";

mp.events.add("render", () => {
    /// Отключение не используемых клавиш
    mp.game.controls.disableControlAction(1, 199, true); //Pause Menu (P)
});







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
mp.busy.list = new Array();
/// В данный массив добавляется название модуля, которым занят игрок, если игрок освобождается от данного модуля, то название модуля удаляется из массива
/// Название модуля записывать маленькими буквами, модули которые учитывают занятость(вписать свои):
/// LIST
/// voicechat
/// chat
/// carshow
/// phone
/// interaction
/// house.add
/// END LIST
/// Добавить модуль (true - операция провшла успешно, false - такой модуль уже содержится в массиве)
mp.busy.add = function(name, nocef = false) {
    if (!nocef) mp.callCEFV(`busy.add('${name}')`);
    if (mp.busy.list.includes(name)) return false;
    mp.busy.list.push(name);
    return true;
}
/// Содержит ли массив данный модуль
/// В случае если name = null, содержит ли массив какой-либо модуль
mp.busy.includes = function(name) {
    if (name == null) {
        return mp.busy.list.length != 0;
    } else {
        return mp.busy.list.includes(name);
    }
}
/// Удалить модуль
mp.busy.remove = function(name, nocef = false) {
    if (!nocef) mp.callCEFV(`busy.remove('${name}')`);
    let index = mp.busy.list.findIndex(x => x == name);
    index != -1 && mp.busy.list.splice(index, 1);
}

mp.events.add("busy.add", mp.busy.add);
mp.events.add("busy.remove", mp.busy.remove);

/// 2)
/// ...

/// Событие для вызова серверного события из браузера
mp.events.add("callRemote", (name, values) => {
    mp.events.callRemote(name, values);
})
