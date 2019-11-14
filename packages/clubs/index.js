"use strict";

module.exports = {
    // Клубы
    clubs: [],

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
            this.clubs.push();
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
                // TODO: Прикрутить ид фракции
                player.call(`clubs.setCurrentClub`, [12]);
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
