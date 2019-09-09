let farms = call('farms');
let notifs = call('notifications');

module.exports = {
    "/farmtp": {
        access: 2,
        description: "Телепортироваться к ферме.",
        args: "[ид_фермы]:n",
        handler: (player, args, out) => {
            var marker = farms.getMarker(args[0]);
            if (!marker) return out.error(`Ферма #${args[0]} не найдена`, player);
            var pos = marker.position;
            pos.z += 2;
            player.position = pos;
            out.info(`Вы телепортировались к ферме #${args[0]}`, player);
        }
    },
    "/farmsetgrains": {
        access: 4,
        description: "Изменить количество зерна на складе.",
        args: "[ид_фермы]:n [зерно]:n",
        handler: (player, args, out) => {
            var farm = farms.getFarm(args[0]);
            if (!farm) return out.error(`Ферма #${args[0]} не найдена`, player);

            farm.grains = args[1];
            farm.save();
            out.info(`${player.name} изменил количество зерна на ферме #${farm.id} (${farm.grains} ед.)`);
        }
    },
    "/farmsetsoils": {
        access: 4,
        description: "Изменить количество удобрения на складе.",
        args: "[ид_фермы]:n [удобрение]:n",
        handler: (player, args, out) => {
            var farm = farms.getFarm(args[0]);
            if (!farm) return out.error(`Ферма #${args[0]} не найдена`, player);

            farm.soils = args[1];
            farm.save();
            out.info(`${player.name} изменил количество удобрения на ферме #${farm.id} (${farm.soils} ед.)`);
        }
    },
    "/farmfill": {
        access: 4,
        description: "Засеять поле.",
        args: "[ид_фермы]:n [ид_поля]:n [тип_урожая]:n",
        handler: (player, args, out) => {
            var farm = farms.getFarm(args[0]);
            if (!farm) return out.error(`Ферма #${args[0]} не найдена`, player);
            var field = farm.fields[Math.clamp(args[1], 0, farm.fields.length - 1)];
            if (field.count) return out.error(`Поле #${args[1]} уже засеяно`, player);
            farms.fillField(field, args[2]);
            out.info(`${player.name} засеял поле #${args[1]} на ферме #${farm.id}`);
        }
    },
    "/farmsoil": {
        access: 6,
        description: "Удобрить поля фермы.",
        args: "[ид_фермы]:n",
        handler: (player, args, out) => {
            var farm = farms.getFarm(args[0]);
            if (!farm) return out.error(`Ферма #${args[0]} не найдена`, player);

            farms.soilFields(farm);
            out.info(`${player.name} удобрил поля на ферме #${farm.id}`);
        }
    },
}
