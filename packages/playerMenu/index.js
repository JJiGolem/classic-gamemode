"use strict";

let bizes = call('bizes');
let donate = call('donate');
let factions = call('factions');
let jobs = call('jobs');
let houses = call('houses');

module.exports = {
    init(player) {
        var biz = bizes.getBizByCharId(player.character.id);
        var house = houses.getHouseByCharId(player.character.id);
        var factionName = factions.getFactionName(player);
        var rankName = factions.getRankName(player);
        var jobName = jobs.getJobName(player);

        var data = {
            playerName: player.name,
            admin: player.character.admin,
            factionId: player.character.id,
            factionName: factionName,
            factionRank: rankName,
            jobName: jobName,
            minutes: player.character.minutes,
            gender: player.character.gender,
            cash: player.character.cash,
            wanted: player.character.wanted,
            donate: player.account.donate,
            convertCash: donate.convertCash,
            nicknamePrice: donate.nicknamePrice,
            clearWarnPrice: donate.clearWarnPrice,
            slotPrice: donate.slotPrice,
            warns: player.character.warnNumber,
            slots: player.account.slots,
            slotsMax: donate.slotsMax,
        };
        if (biz) {
            data.biz = {
                id: biz.info.id,
                type: biz.info.type,
                name: biz.info.name,
                price: biz.info.price,
            };
        }
        if (house) {
            data.house = {
                id: house.info.id,
                class: house.info.Interior.class,
                rooms: house.info.Interior.numRooms,
                carPlaces: house.info.Interior.Garage.carPlaces,
                price: house.info.price,
            };
        }
        player.call(`playerMenu.init`, [data]);
    },
    setFaction(player) {
        var data = {
            factionId: player.character.factionId,
            factionName: factions.getFactionName(player),
            factionRank: factions.getRankName(player),
        };
        player.call(`playerMenu.setFaction`, [data]);
    },
    setFactionRank(player) {
        var data = {
            factionRank: factions.getRankName(player),
        };
        player.call(`playerMenu.setFactionRank`, [data]);
    },
    setJob(player) {
        var data = {
            jobName: jobs.getJobName(player),
        };
        player.call(`playerMenu.setJob`, [data]);
    },
    setBiz(player) {
        var biz = bizes.getBizByCharId(player.character.id);

        var data = {};
        if (biz) {
            data.biz = {
                id: biz.info.id,
                type: biz.info.type,
                name: biz.info.name,
                price: biz.info.price,
            };
        }
        player.call(`playerMenu.setBiz`, [data]);
    },
    setHouse(player) {
        var house = houses.getHouseByCharId(player.character.id);

        var data = {};
        if (house) {
            data.house = {
                id: house.info.id,
                class: house.info.Interior.class,
                rooms: house.info.Interior.numRooms,
                carPlaces: house.info.Interior.Garage.carPlaces,
                price: house.info.price,
            };
        }
        player.call(`playerMenu.setHouse`, [data]);
    },
    setSkills(player) {
        var data = {
            skills: player.character.jobSkills.map(x => {
                return {
                    jobId: x.jobId,
                    name: jobs.getJob(x.jobId).name,
                    exp: x.exp,
                };
            }),
        };
        player.call(`playerMenu.setSkills`, [data]);
    },
    setSkill(player, skill) {
        var data = {
            skill: {
                jobId: skill.jobId,
                exp: skill.exp,
            },
        };
        player.call(`playerMenu.setSkill`, [data]);
    },
    setDonate(player) {
        var data = {
            donate: player.account.donate,
        };
        player.call(`playerMenu.setDonate`, [data]);
    },
    setWarns(player) {
        var data = {
            warns: player.character.warnNumber,
        };
        player.call(`playerMenu.setWarns`, [data]);
    },
    setSlots(player) {
        var data = {
            slots: player.account.slots,
        };
        player.call(`playerMenu.setSlots`, [data]);
    },
};
