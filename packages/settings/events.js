
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
}
