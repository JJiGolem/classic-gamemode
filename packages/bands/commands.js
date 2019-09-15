let bands = call('bands');
let factions = call('factions');

module.exports = {
    "/bsetzoneowner": {
        access: 4,
        description: "Изменить банду у зоны гетто.",
        args: "[ид_банды]:n",
        handler: (player, args, out) => {
            if (!factions.isBandFaction(args[0])) return out.error(`Организация #${args[0]} не является бандой`, player);

            var zone = bands.getZoneByPos(player.position);
            if (!zone) return out.error(`Вы не в гетто`, player);

            bands.setBandZoneOwner(zone, args[0]);
            out.info(`${player.name} изменил банду у зоны гетто #${zone.id}`);
        }
    },
    "/bzonetp": {
        access: 4,
        description: "Телепортироваться в зону гетто.",
        args: "[ид_зоны]:n",
        handler: (player, args, out) => {
            var zone = bands.getZone(args[0]);
            if (!zone) return out.error(`Зона #${args[0]} не найдена`, player);
            var pos = new mp.Vector3(zone.x, zone.y, 50);
            player.position = pos;
        }
    },
}
