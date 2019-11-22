
let infopeds = require('./index.js');

module.exports = {
    "/addinfopoint": {
        access: 6,
        args: '',
        handler: async (player, args, out) => {
            let point = await db.Models.InfoPoint.create({
                x: player.position.x,
                y: player.position.y,
                z: player.position.z - 1.2
            });
            infopeds.createInfoPoint(point);
            infopeds.addPointsData(point);
            out.info(`Точка информации создана, ID: ${point.id}`, player);
        }
    },
    "/delinfopoint": {
        access: 6,
        args: '[id]:n',
        handler: async (player, args, out) => {
            let data = infopeds.getPointsData();
            let point = data.find(x => x.id == args[0]);
            if (!point) return out.error('Точка не найдена', player);
            point.destroy();
            let shape = mp.colshapes.toArray().find(x => x.infoPointId == args[0]);
            if (shape) shape.destroy();
            let marker = mp.markers.toArray().find(x => x.infoPointId == args[0]);
            if (marker) marker.destroy();
            let blip = mp.blips.toArray().find(x => x.infoPointId == args[0]);
            if (blip) blip.destroy();
            out.info(`Точка информации удалена`, player);
        }
    }
}
