let bins = call('bins');
let notifs = call('notifications');

module.exports = {
    "init": () => {
        bins.init();
    },
    "bins.trash.take": (player) => {
        notifs.info(player, `скоро будет! :)`);
    }
};
