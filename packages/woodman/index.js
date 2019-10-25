"use strict";

module.exports = {
    // Общая информация о типах деревьев
    treesInfo: null,

    init() {
        this.loadTreesInfoFromDB();
    },
    async loadTreesInfoFromDB() {
        this.treesInfo = await db.Models.Tree.findAll();

        console.log(`[WOODMAN] Общая информация о деревьях загружена (${this.treesInfo.length} шт.)`);
    },
};
