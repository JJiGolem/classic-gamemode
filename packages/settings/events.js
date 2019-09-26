let auth = call('auth');
let notifs = call('notifications');

module.exports = {
    "settings.spawn.set": (player, spawn) => {
        player.character.settings.spawn = spawn;
        player.character.settings.save();
    },
    "settings.password.set": (player, data) => {
        data = JSON.parse(data);
        var header = `Смена пароля`;
        if (!data.newPass || data.newPass.length < 6 || data.newPass.length > 20) return notifs.error(player, `Пароль должен состоять из 6-20 символов`, header);
        if (!auth.comparePassword(data.oldPass, player.account.password)) return notifs.error(player, `Старый пароль не совпадает`, header);
        if (auth.comparePassword(data.newPass, player.account.password)) return notifs.error(player, `Новый пароль совпадает со старым`, header);


        player.account.password = auth.hashPassword(data.newPass);
        player.account.save();
        // TODO: сохранять дату смены пароля в БД

        notifs.success(player, `Пароль успешно изменен`, header);
        mp.events.call("player.password.changed", player);
    },
    "settings.email.set": (player, email) => {
        var header = `Смена почты`;
        if (!email || email.length > 40) return notifs.error(player, `Email должен быть менее 40 символов`, header);
        var r = /^[0-9a-z-_\.]+\@[0-9a-z-_]{1,}\.[a-z]{1,}$/i;
        if (!r.test(email)) return notifs.error(player, `Некорректный email`, header);

        player.account.email = email;
        player.account.confirmEmail = 0;
        player.account.save();

        notifs.success(player, `Email успешно изменен`, header);
        mp.events.call("player.email.changed", player);
    },
}
