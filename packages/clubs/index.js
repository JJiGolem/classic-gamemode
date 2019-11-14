"use strict";

module.exports = {
    // Клубы
    clubs: [],
    // Алкогольные напитки
    alcohol: {
        // Багама (La Cosa Nostra)
        12: [{
                name: "Мохито",
                price: 10000,
            },
            {
                name: "Апероль Шпритц",
                price: 10000,
            },
            {
                name: "Негрони",
                price: 10000,
            },
            {
                name: "Мартини & Тоник",
                price: 10000,
            },
            {
                name: "Бьянко Санрайз",
                price: 10000,
            },
            {
                name: "Валентино",
                price: 10000,
            },
        ],
        // Текила (La Eme)
        13: [{
                name: "Амиго",
                price: 10000,
            },
            {
                name: "Эль-бандито",
                price: 10000,
            },
            {
                name: "Маргарита",
                price: 10000,
            },
            {
                name: "Пина-колада",
                price: 10000,
            },
            {
                name: "Сангрита",
                price: 10000,
            },
            {
                name: "Палома",
                price: 10000,
            },

        ],
        // Ванила (Russian Mafia)
        14: [{
                name: "Отвёртка",
                price: 10000,
            },
            {
                name: "Холодное лето 1986 года",
                price: 10000,
            },
            {
                name: "Российский флаг",
                price: 10000,
            },
            {
                name: "Балалайка",
                price: 10000,
            },
            {
                name: "Кровавая мэри",
                price: 10000,
            },
            {
                name: "Белый туман",
                price: 10000,
            },
        ],
    },
    // Закуски
    snacks: {
        // Багама (La Cosa Nostra)
        12: [{
                name: "Брускетта с помидорами",
                price: 10000,
            },
            {
                name: "Аранчини",
                price: 10000,
            },
            {
                name: "Моцарелла с базаликом",
                price: 10000,
            },
            {
                name: "Креветки в соусе песто",
                price: 10000,
            }
        ],
        // Текила (La Eme)
        13: [{
                name: "Кесадилья с курицей",
                price: 10000,
            },
            {
                name: "Сэндвич с каперсами",
                price: 10000,
            },
            {
                name: "Бурритос с курицей",
                price: 10000,
            },
            {
                name: "Гуакамоле с грушей",
                price: 10000,
            }
        ],
        // Ванила (Russian Mafia)
        14: [{
                name: "Селёдка с солёным огурцом",
                price: 10000,
            },
            {
                name: "Рулетики из ветчины с сыром",
                price: 10000,
            },
            {
                name: "Бутерброд со шпротами",
                price: 10000,
            },
            {
                name: "Шаурма в пите",
                price: 10000,
            }
        ],
    },

    async init() {
        this.loadClubsFromDB();
    },
    async loadClubsFromDB() {
        var dbClubs = await db.Models.Club.findAll();
        dbClubs.forEach(db => {
            var club = {
                db: db,
                enterMarker: this.createEnterMarker(db),
                exitMarker: this.createExitMarker(db),
            };
            this.clubs.push(club);
        });

        console.log(`[CLUBS] Клубы загружены (${this.clubs.length} шт.)`);
    },
    createEnterMarker(club) {
        var pos = new mp.Vector3(club.enterX, club.enterY, club.enterZ - 1);

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
            // TODO: Прикрутить ид фракции
            if (!enterMarker.isOpen && player.character.factionId != 12) return notifs.error(player, `Клуб закрыт`, `Название клуба (TODO)`);

            // TODO: Прикрутить ид фракции
            player.dimension = 12;
            player.position = new mp.Vector3(club.exitX, club.exitY, club.exitZ);
            player.heading = club.exitH;
        };
        colshape.onExit = (player) => {

        };
        enterMarker.colshape = colshape;

        return enterMarker;
    },
    createExitMarker(club) {
        var pos = new mp.Vector3(club.exitX, club.exitY, club.exitZ - 1);

        // TODO: Прикрутить ид фракции
        var exitMarker = mp.markers.new(1, pos, 0.5, {
            color: [0, 187, 255, 70],
            dimension: 12
        });

        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5, exitMarker.dimension);
        colshape.onEnter = (player) => {
            if (player.vehicle) return;
            if (!player.inClub) {
                // TODO: Прикрутить ид фракции
                player.inClub = 12;
                player.call(`clubs.setCurrentClub`, [{
                    factionId: player.inClub,
                    name: "Имя клуба (TODO)",
                    alcohol: this.alcohol[player.inClub],
                    snacks: this.snacks[player.inClub],
                }]);
                return;
            }

            player.heading = club.enterH;
            player.dimension = 0;
            player.position = new mp.Vector3(club.enterX, club.enterY, club.enterZ);
        };
        colshape.onExit = (player) => {

        };
        exitMarker.colshape = colshape;

        return exitMarker;
    },
};
