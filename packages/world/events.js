let terminal = call('terminal');
let world = call('world');

module.exports = {
    "init": () => {
        world.init();
        inited(__dirname);
    },
    "world.objects.add": (player, data) => {
        data = JSON.parse(data);
        world.addObject(data);
        terminal.info(`${player.name} добавил объект мира типа ${data.type}`);
    },
    "world.objects.position.set": (player, data) => {
        data = JSON.parse(data);
        world.setObjectPos(data);
        terminal.info(`${player.name} изменил позицию объекта мира #${data.id}`);
    },
}
