"use strict";
/// Модуль чата, с историей сообщений, тегами и процессами
mp.events.add('playerJoin', player => {
   player.call('chat.load');
});