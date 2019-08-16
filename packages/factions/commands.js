let factions = require('./index');
let notifs = require('../notifications');

module.exports = {
    "/flist": {
        description: "Посмотреть список организаций.",
        access: 6,
        args: "",
        handler: (player, args, out) => {
            var text = "ID) Имя [товар] [макс. товара] | блип | цвет_блипа<br/>";
            for (var i = 0; i < factions.factions.length; i++) {
                var faction = factions.factions[i];
                text += `${faction.id}) ${faction.name} [${faction.products}] [${faction.maxProducts}] | ${faction.blip} | ${faction.blipColor}<br/>`;
            }
            out.log(text, player);
        }
    },
    "/fsetname": {
        description: "Сменить имя организации.",
        access: 6,
        args: "[ид_организации]:n [имя]",
        handler: (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            args.splice(0, 1);
            var name = args.join(" ").trim();
            out.info(`${player.name} сменил имя у организации #${faction.id} (${faction.name} => ${name})`);
            faction.name = name;
            faction.save();
        }
    },
    "/fsetleader": {
        description: "Сменить лидера организации.",
        access: 6,
        args: "[ид_организации]:n [имя] [фамилия]",
        handler: async (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            var fullName = `${args[1]} ${args[2]}`;
            var rec = mp.players.getByName(fullName);
            var character = (rec)? rec.character : await db.Models.Character.findOne({
                attributes: ['id', 'faction', 'factionRank'],
                where: {
                    name: fullName
                }
            });;
            if (!character) return out.error(`Персонаж ${fullName} не найден`, player);

            out.info(`${player.name} добавил лидера организации #${faction.id} (#${character.id})`);
            factions.setLeader(faction, character);
        }
    },
    "/fuval": {
        description: "Уволить игрока из организации.",
        access: 6,
        args: "[ид_игрока]:n",
        handler: async (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);

            if (!rec.character.factionId) return out.error(`${rec.name} не состоит в организации`, player);
            var faction = factions.getFaction(rec.character.factionId);
            if (!faction) return out.error(`Организация #${rec.character.factionId} не найдена`, player);

            out.info(`${player.name} уволил ${rec.name} из организации #${faction.id}`);
            factions.deleteMember(faction, rec.character);
        }
    },
    "/fadd": {
        description: "Добавить игрока в организацию.",
        access: 6,
        args: "[ид_игрока]:n [ид_организации]:n",
        handler: async (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);

            var faction = factions.getFaction(args[1]);
            if (!faction) return out.error(`Организация #${args[1]} не найдена`, player);


            out.info(`${player.name} добавил ${rec.name} в организацию #${faction.id}`);
            factions.addMember(faction, rec.character);
        }
    },
    "/fgiverank": {
        description: "Изменить ранг игрока в организацию.",
        access: 6,
        args: "[ид_игрока]:n [ранг]:n",
        handler: async (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);

            if (!rec.character.factionId) return out.error(`${rec.name} не состоит в организации`, player);

            var rank = factions.getRank(rec.character.factionId, args[1]);
            if (!rank) return out.error(`Ранг #${args[1]} не найден`, player);

            out.info(`${player.name} изменил ранг ${rec.name} (${rec.character.factionRank} => ${rank.rank})`);
            factions.setRank(rec.character, rank);
        }
    },
    "/fsetproducts": {
        description: "Изменить количество товара на складе организации.",
        access: 6,
        args: "[ид_организации]:n [товар]:n",
        handler: (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            out.info(`${player.name} изменил количество товара у организации #${args[0]} (${faction.products} => ${args[1]})`);
            faction.products = args[1];
            faction.save();
        }
    },
    "/fsetmaxproducts": {
        description: "Изменить вместимость товара на складе организации.",
        access: 6,
        args: "[ид_организации]:n [вместимость]:n",
        handler: (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            out.info(`${player.name} изменил вместимость товара на складе у организации #${args[0]} (${faction.maxProducts} => ${args[1]})`);
            faction.maxProducts = args[1];
            faction.save();
        }
    },
    "/fsetblip": {
        description: "Изменить блип на карте у организации.",
        access: 5,
        args: "[ид_организации]:n [тип_блипа]:n [цвет_блипа]:n",
        handler: (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            out.info(`${player.name} изменил блип у организации #${args[0]} (${faction.blip}-${faction.blipColor} => ${args[0]}-${args[1]})`);
            factions.setBlip(faction, args[1], args[2]);
        }
    },
    // "/factionsetpos": {
    //     description: "Изменить позицию организации. Позиция берется от игрока.",
    //     access: 6,
    //     args: "[ид_организации]:n",
    //     handler: (player, args, out) => {
    //         var faction = factions.getFaction(args[0]);
    //         if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);
    //
    //         faction.setPosition(player.position, player.heading);
    //         terminal.info(`${player.name} изменил позицию у организации с ID: ${args[0]} на ${JSON.stringify(player.position)}`);
    //     }
    // },
}
