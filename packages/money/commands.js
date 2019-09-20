let money = require('./index');

module.exports = {
    "/addcash": {
        access: 6,
        description: "Дать наличности",
        args: "[id]:n [Кол-во]:n",
        handler: (player, args) => {
            let id = parseInt(args[0]);
            let number = parseInt(args[1]);
            if (isNaN(id)|| isNaN(number)) return player.call('notifications.push.error', ["Введите данные верно", "Ошибка передачи денег"]);
            if (mp.players.at(id) == null) return player.call('notifications.push.error', ["Игрок с данным id отсутствует на сервере", "Ошибка передачи денег"]);
            if (number < 0 || number > 100000000) return player.call('notifications.push.error', ["Введите сумму для передачи верно", "Ошибка передачи денег"]);
            money.addCash(mp.players.at(id), number, function(result) {
                if (!result) return player.call('notifications.push.error', ["По неизвестным причинам", "Ошибка передачи денег"]);
                mp.players.at(id).call('notifications.push.success', ["Вам дали " + number + "$ наличными", "Получены денежные средства"]);
            });
        }
    },
    "/addmoney": {
        access: 6,
        description: "Пополнить банковский счет",
        args: "[id]:n [Кол-во]:n",
        handler: (player, args) => {
            let id = parseInt(args[0]);
            let number = parseInt(args[1]);
            if (isNaN(id)|| isNaN(number)) return player.call('notifications.push.error', ["Введите данные верно", "Ошибка пополнения счета"]);
            if (mp.players.at(id) == null) return player.call('notifications.push.error', ["Игрок с данным id отсутствует на сервере", "Ошибка пополнения счета"]);
            if (number < 0 || number > 100000000) return player.call('notifications.push.error', ["Введите сумму для передачи верно", "Ошибка пополнения счета"]);
            money.addMoney(mp.players.at(id), number, function(result) {
                if (!result) return player.call('notifications.push.error', ["По неизвестным причинам", "Ошибка пополнения счета"]);
                mp.players.at(id).call('notifications.push.success', ["Вам перевели " + number + "$ на счет", "Получены денежные средства"]);
            });
        }
    },
    "/removecash": {
        access: 6,
        description: "Отобрать наличность",
        args: "[id]:n [Кол-во]:n",
        handler: (player, args) => {
            let id = parseInt(args[0]);
            let number = parseInt(args[1]);
            if (isNaN(id)|| isNaN(number)) return player.call('notifications.push.error', ["Введите данные верно", "Ошибка снятия денег"]);
            if (mp.players.at(id) == null) return player.call('notifications.push.error', ["Игрок с данным id отсутствует на сервере", "Ошибка снятия денег"]);
            if (number < 0 || number > 100000000) return player.call('notifications.push.error', ["Введите сумму для снятия верно", "Ошибка снятия денег"]);
            money.removeCash(mp.players.at(id), number, function(result) {
                if (!result) return player.call('notifications.push.error', ["По неизвестным причинам", "Ошибка снятия денег"]);
                mp.players.at(id).call('notifications.push.success', ["У вас отобрали " + number + "$ наличными", "Потеряны денежные средства"]);
            });
        }
    },
    "/removemoney": {
        access: 6,
        description: "Снять с банковского счета",
        args: "[id]:n [Кол-во]:n",
        handler: (player, args) => {
            let id = parseInt(args[0]);
            let number = parseInt(args[1]);
            if (isNaN(id)|| isNaN(number)) return player.call('notifications.push.error', ["Введите данные верно", "Ошибка снятия со счета"]);
            if (mp.players.at(id) == null) return player.call('notifications.push.error', ["Игрок с данным id отсутствует на сервере", "Ошибка снятия со счета"]);
            if (number < 0 || number > 100000000) return player.call('notifications.push.error', ["Введите сумму для снятия верно", "Ошибка снятия со счета"]);
            money.removeMoney(mp.players.at(id), number, function(result) {
                if (!result) return player.call('notifications.push.error', ["По неизвестным причинам", "Ошибка снятия со счета"]);
                mp.players.at(id).call('notifications.push.success', ["У вас сняли " + number + "$ со счета", "Получены денежные средства"]);
            });
        }
    },
    "/cashtest": {
        access: 6,
        description: "",
        args: "",
        handler: (player, args) => {
            money.removeCash(player, parseInt(args[0]), function(result) {
                if (result) {
                    console.log("YES");
                    throw new Error();
                }
                else {
                    console.log("NO");
                }
            });
        }
    }
}