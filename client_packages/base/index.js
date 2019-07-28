"use strict";
/// Отключение не используемых клавиш
mp.game.controls.disableControlAction(1, 200, true);    //Pause Menu










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
/// END LIST
/// Добавить модуль
mp.busy.add = function(name) {
    if (mp.busy.list.includes(name)) return;
    mp.busy.list.push(name);
}
/// Содержит ли массив данный модуль
/// В случае если name = null, содержит ли массив какой-либо модуль
mp.busy.includes = function(name) {
    if (name == null) {
        if (mp.busy.list.length != 0) return;
    }
    else {
        if (mp.busy.list.includes(name)) return true;
    }
}
/// Удалить модуль
mp.busy.remove = function(name) {
    let index = mp.busy.list.findIndex(x => x == name);
    index != -1 && mp.busy.list.splice(index, 1);
}
/// 2)
/// ...