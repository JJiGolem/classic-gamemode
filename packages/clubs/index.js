"use strict";

let bizes = call('bizes');
let inventory = call('inventory');
let money = call('money');
let notifs = call('notifications');

module.exports = {
    // Инфо о бизнесе
    business: {
        type: 10,
        name: "Клуб",
        productName: "Спиртное",
        isFactionOwner: true,
    },
    productPrice: 1,
    rentPerDayMultiplier: 0.01,
    // Клубы
    clubs: [],
    // Алкогольные напитки
    alcohol: {
        // Багама (La Cosa Nostra)
        12: [{
                price: 10000,
                params: {
                    name: "Мохито",
                    alcohol: 5
                },
            },
            {
                price: 10000,
                params: {
                    name: "Апероль Шпритц",
                    alcohol: 5
                },
            },
            {
                price: 10000,
                params: {
                    name: "Негрони",
                    alcohol: 5
                },
            },
            {
                price: 10000,
                params: {
                    name: "Мартини & Тоник",
                    alcohol: 5
                },
            },
            {
                price: 10000,
                params: {
                    name: "Бьянко Санрайз",
                    alcohol: 5
                },
            },
            {
                price: 10000,
                params: {
                    name: "Валентино",
                    alcohol: 5
                },
            },
        ],
        // Текила (La Eme)
        13: [{
                price: 10000,
                params: {
                    name: "Амиго",
                    alcohol: 5
                },
            },
            {
                price: 10000,
                params: {
                    name: "Эль-бандито",
                    alcohol: 5
                },
            },
            {
                price: 10000,
                params: {
                    name: "Маргарита",
                    alcohol: 5
                },
            },
            {
                price: 10000,
                params: {
                    name: "Пина-колада",
                    alcohol: 5
                },
            },
            {
                price: 10000,
                params: {
                    name: "Сангрита",
                    alcohol: 5
                },
            },
            {
                price: 10000,
                params: {
                    name: "Палома",
                    alcohol: 5
                },
            },

        ],
        // Ванила (Russian Mafia)
        14: [{
                price: 10000,
                params: {
                    name: "Отвёртка",
                    alcohol: 5
                },
            },
            {
                price: 10000,
                params: {
                    name: "Холодное лето 1986 года",
                    alcohol: 5
                },
            },
            {
                price: 10000,
                params: {
                    name: "Российский флаг",
                    alcohol: 5
                },
            },
            {
                price: 10000,
                params: {
                    name: "Балалайка",
                    alcohol: 5
                },
            },
            {
                price: 10000,
                params: {
                    name: "Кровавая мэри",
                    alcohol: 5
                },
            },
            {
                price: 10000,
                params: {
                    name: "Белый туман",
                    alcohol: 5
                },
            },
        ],
    },
    // Закуски
    snacks: {
        // Багама (La Cosa Nostra)
        12: [{
                price: 10000,
                params: {
                    name: "Брускетта с помидорами",
                    satiety: 10,
                }
            },
            {
                price: 10000,
                params: {
                    name: "Аранчини",
                    satiety: 10,
                }
            },
            {
                price: 10000,
                params: {
                    name: "Моцарелла с базаликом",
                    satiety: 10,
                }
            },
            {
                price: 10000,
                params: {
                    name: "Креветки в соусе песто",
                    satiety: 10,
                }
            }
        ],
        // Текила (La Eme)
        13: [{
                price: 10000,
                params: {
                    name: "Кесадилья с курицей",
                    satiety: 10,
                }
            },
            {
                price: 10000,
                params: {
                    name: "Сэндвич с каперсами",
                    satiety: 10,
                }
            },
            {
                price: 10000,
                params: {
                    name: "Бурритос с курицей",
                    satiety: 10,
                }
            },
            {
                price: 10000,
                params: {
                    name: "Гуакамоле с грушей",
                    satiety: 10,
                }
            }
        ],
        // Ванила (Russian Mafia)
        14: [{
                price: 10000,
                params: {
                    name: "Селёдка с солёным огурцом",
                    satiety: 10,
                }
            },
            {
                price: 10000,
                params: {
                    name: "Рулетики из ветчины с сыром",
                    satiety: 10,
                }
            },
            {
                price: 10000,
                params: {
                    name: "Бутерброд со шпротами",
                    satiety: 10,
                }
            },
            {
                price: 10000,
                params: {
                    name: "Шаурма в пите",
                    satiety: 10,
                }
            }
        ],
    },
    // Сигареты
    smoke: {
        // Багама (La Cosa Nostra)
        12: [{
            price: 10000,
            params: {
                name: "Arturo Fuente",
                count: 20,
            }
        }],
        // Текила (La Eme)
        13: [{
            price: 10000,
            params: {
                name: "Te Amo",
                count: 20,
            }
        }],
        // Ванила (Russian Mafia)
        14: [{
            price: 10000,
            params: {
                name: "Погарская сигара",
                count: 20,
            }
        }],
    },
    // Ид предметов инвентаря
    alcoholItemId: 133,
    snackItemId: 134,
    smokeItemId: 16,

    async init() {
        this.loadClubsFromDB();
    },
    async loadClubsFromDB() {
        var dbClubs = await db.Models.Club.findAll();
        dbClubs.forEach(db => {
            var club = {
                db: db,
                biz: bizes.getBizById(db.bizId)
            };
            club.enterMarker = this.createEnterMarker(club);
            club.exitMarker = this.createExitMarker(club);
            this.clubs.push(club);
        });

        console.log(`[CLUBS] Клубы загружены (${this.clubs.length} шт.)`);
    },
    createEnterMarker(club) {
        var pos = new mp.Vector3(club.db.enterX, club.db.enterY, club.db.enterZ - 1);

        var enterMarker = mp.markers.new(1, pos, 0.5, {
            color: [0, 187, 255, 70]
        });
        enterMarker.isOpen = true;

        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5, 0);
        colshape.onEnter = (player) => {
            if (player.vehicle) return;
            if (player.inClub) {
                delete player.inClub;
                player.call(`clubs.setCurrentClub`);
                return;
            }
            if (!enterMarker.isOpen) {
                if (player.character.factionId != club.biz.info.factionId) return notifs.error(player, `Клуб закрыт`, club.biz.info.name);
                notifs.warning(player, `Вы вошли в закрытый клуб как член мафии`, club.biz.info.name);
            }

            player.dimension = club.biz.info.factionId;
            player.position = new mp.Vector3(club.db.exitX, club.db.exitY, club.db.exitZ);
            player.heading = club.db.exitH;
        };
        colshape.onExit = (player) => {

        };
        enterMarker.colshape = colshape;

        return enterMarker;
    },
    createExitMarker(club) {
        var pos = new mp.Vector3(club.db.exitX, club.db.exitY, club.db.exitZ - 1);

        var exitMarker = mp.markers.new(1, pos, 0.5, {
            color: [0, 187, 255, 70],
            dimension: club.biz.info.factionId
        });

        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5, exitMarker.dimension);
        colshape.onEnter = (player) => {
            if (player.vehicle) return;
            if (!player.inClub) {
                player.inClub = club.biz.info.factionId;
                player.call(`clubs.setCurrentClub`, [{
                    factionId: player.inClub,
                    name: club.biz.info.name,
                    alcohol: this.alcohol[player.inClub],
                    snacks: this.snacks[player.inClub],
                    smoke: this.smoke[player.inClub],
                }]);
                return;
            }

            player.heading = club.db.enterH;
            player.dimension = 0;
            player.position = new mp.Vector3(club.db.enterX, club.db.enterY, club.db.enterZ);
        };
        colshape.onExit = (player) => {

        };
        exitMarker.colshape = colshape;

        return exitMarker;
    },
    buyAlcohol(player, index) {
        if (!player.inClub) return notifs.error(player, `Вы не в клубе`);
        var club = this.clubs.find(x => x.biz.info.factionId == player.inClub);
        if (!club) return notifs.error(player, `Клуб не найден`);
        var header = `Барная стойка ${club.biz.info.name}`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        var alcoholList = this.alcohol[club.biz.info.factionId];
        index = Math.clamp(index, 0, alcoholList.length - 1);
        var item = alcoholList[index];
        if (player.character.cash < item.price) return out(`Необходимо $${item.price}`);

        var cantAdd = inventory.cantAdd(player, this.alcoholItemId, item.params);
        if (cantAdd) return out(cantAdd);

        money.removeCash(player, item.price, (res) => {
            if (!res) out(`Ошибка списания наличных`);
        }, `Покупка напитка в клубе с bizId #${club.biz.info.id}`);

        inventory.addItem(player, this.alcoholItemId, item.params, (e) => {
            if (e) notifs.error(player, e);
        });

        notifs.success(player, `Вы приобрели ${item.params.name}`, header);
    },
    buySnack(player, index) {
        if (!player.inClub) return notifs.error(player, `Вы не в клубе`);
        var club = this.clubs.find(x => x.biz.info.factionId == player.inClub);
        if (!club) return notifs.error(player, `Клуб не найден`);
        var header = `Барная стойка ${club.biz.info.name}`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        var snackList = this.snacks[club.biz.info.factionId];
        index = Math.clamp(index, 0, snackList.length - 1);
        var item = snackList[index];
        if (player.character.cash < item.price) return out(`Необходимо $${item.price}`);

        var cantAdd = inventory.cantAdd(player, this.snackItemId, item.params);
        if (cantAdd) return out(cantAdd);

        money.removeCash(player, item.price, (res) => {
            if (!res) out(`Ошибка списания наличных`);
        }, `Покупка закуски в клубе с bizId #${club.biz.info.id}`);

        inventory.addItem(player, this.snackItemId, item.params, (e) => {
            if (e) notifs.error(player, e);
        });

        notifs.success(player, `Вы приобрели ${item.params.name}`, header);
    },
    buySmoke(player, index) {
        if (!player.inClub) return notifs.error(player, `Вы не в клубе`);
        var club = this.clubs.find(x => x.biz.info.factionId == player.inClub);
        if (!club) return notifs.error(player, `Клуб не найден`);
        var header = `Барная стойка ${club.biz.info.name}`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        var smokeList = this.smoke[club.biz.info.factionId];
        index = Math.clamp(index, 0, smokeList.length - 1);
        var item = smokeList[index];
        if (player.character.cash < item.price) return out(`Необходимо $${item.price}`);

        var cantAdd = inventory.cantAdd(player, this.smokeItemId, item.params);
        if (cantAdd) return out(cantAdd);

        money.removeCash(player, item.price, (res) => {
            if (!res) out(`Ошибка списания наличных`);
        }, `Покупка сигарет в клубе с bizId #${club.biz.info.id}`);

        inventory.addItem(player, this.smokeItemId, item.params, (e) => {
            if (e) notifs.error(player, e);
        });

        notifs.success(player, `Вы приобрели пачку ${item.params.name}`, header);
    },
    openClub(factionId, isOpen) {
        var club = this.clubs.find(x => x.biz.info.factionId == factionId);
        club.enterMarker.isOpen = isOpen;
    },
    addDrunkenness(player, value) {
        var oldValue = player.drunkenness || 0;
        var newValue = Math.clamp(oldValue + value, 0, 100);
        
        player.drunkenness = newValue;
        player.call(`clubs.drunkenness.set`, [newValue]);
    },
};
