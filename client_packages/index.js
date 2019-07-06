"use strict";
/// Подключение всех модулей на сервере

/// Служебные модули
require('base');
require('browser');
require('utils');

/// Пользовательские модули (располагать по алфавиту для более удобного поиска)
/// Положение в списке не должно влиять на работоспособность
require('auth');
require('chat');
require('hud');
require('notifications');
require('weather');