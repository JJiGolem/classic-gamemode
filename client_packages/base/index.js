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
mp.busy.list = new Array();
/// В данный массив добавляется название модуля, которым занят игрок, если игрок освобождается от данного модуля, то название модуля удаляется из массива
/// Название модуля записывать маленькими буквами, модули которые учитывают занятость(вписать свои):
mp.busy.add = function(name) {

}
mp.busy.remove = function(name) {

}
/// LIST
/// voicechat
/// chat
/// END LIST
/// EXAMPLE
/// при открытии чата(не обязательно делать точь в точь, это лишь пример использования)
/// if (mp.busy.findIndex(x => x == 'voicechat') == -1) return;     или if (mp.busy.length != 0) return; или if (mp.busy.includes('voicechat')) return;
/// mp.busy.push('chat');
/// при закрытии чата
/// let index = mp.busy.findIndex(x => x == 'chat');
/// index != -1 && mp.busy.splice(index, 1);
/// EXAMPLE END
/// 2)
/// ...