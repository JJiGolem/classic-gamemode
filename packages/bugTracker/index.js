"use strict";

let apiKey = "4bcb510b61fe15d500ba1f4999bf7e19";
let oauthToken = "d59a2484fc4a9efe8bcbfabc3236652473d862e53b4d3463ecce2e1f9d23823c";
let trello = require('trello-node-api')(apiKey, oauthToken);

let bugTrackerBoard = "tYkbcKOV";
let bugLabelId = "5e05f0a2a798871467ecf6d8";

module.exports = {
    // Карточки-баги из трелло
    bugCards: [],

    async init() {
        this.loadBugsFromTrello();
    },
    async loadBugsFromTrello() {
        let response;
        try {
            response = await trello.board.searchCards(bugTrackerBoard);
            response.forEach(card => {
                if (card.idLabels.includes(bugLabelId)) this.bugCards.push(card);
            });
            console.log(`[BUGTRACKER] Баги из трелло загружены (${this.bugCards.length} шт.)`);
        } catch (error) {
            if (error) {
                console.log('error ', error);
            }
        }
    },
};
