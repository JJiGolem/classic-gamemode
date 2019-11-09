let chat = call('chat');
let notifs = call('notifications');

module.exports = {
    "characterInit.done": async (player) => {
        var list = await notifs.popSavedNotifs(player);
        list.forEach(el => {
            notifs[el.type](player, el.text, el.header);
            chat.push(player, `!{#ffffff} [${el.type}] ${el.text}`);
        });
    },
};
