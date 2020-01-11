"use strict";

let dev = call('dev');
let notifs = call('notifications');

let apiKey = "4bcb510b61fe15d500ba1f4999bf7e19";
let oauthToken = "d59a2484fc4a9efe8bcbfabc3236652473d862e53b4d3463ecce2e1f9d23823c";
let Trello = require('trello-node-api')(apiKey, oauthToken);

let bugTrackerBoard = "tYkbcKOV";
let bugsListId = "5dee9c59e5c0fd0fb823c8dd";
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
            response = await Trello.board.searchCards(bugTrackerBoard);
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
    async createBug(player, data) {
        let response;
        try {
            var steps = "";
            data.steps.forEach((step, index) => {
                steps += `${index + 1}. ${step}\n`;
            });
            response = await Trello.card.create({
                name: data.name,
                desc: `**Шаги воспроизведения:**\n\n${steps}\n\n**Результат:**\n*${data.result}*\n\n**Ожидаемый результат:**\n*${data.expectedResult}*\n\n**Информация:**\nСоздатель: ${player.name}\nСборка: #${dev.getBuild()}`,
                pos: 'top',
                idList: bugsListId, //REQUIRED
                due: null,
                dueComplete: false,
                idMembers: [],
                idLabels: [bugLabelId],
                urlSource: '',
                fileSource: '',
                idCardSource: '',
                keepFromSource: ''
            });
            // console.log('response', response);
            this.bugCards.push(response);
            notifs.success(player, `Спасибо за участие!`, `Помощь штату`);
            player.call(`bugTracker.bugs.add`, [this.convertToClientBug(response)]);
        } catch (error) {
            if (error) {
                console.log('error ', error);
            }
        }
    },
    convertToClientBug(card) {
        var stepsMatch = card.desc.match(/\*\*Шаги воспроизведения:\*\*\n\n([а-яА-ЯёЁa-zA-Z0-9\. \n]+)\n\n\n/)[1];
        var steps = [];
        stepsMatch.split('\n').forEach(step => {
            var array = step.split(' ');
            array.unshift();
            steps.push(array.join(' '));
        });
        return {
            name: card.name,
            steps: steps,
            result: card.desc.match(/\n\*\*Результат:\*\*\n\*(.+)\*\n\n/)[1],
            expectedResult: card.desc.match(/\n\*\*Ожидаемый результат:\*\*\n\*(.+)\*\n\n/)[1],
            author: card.desc.match(/\nСоздатель: ([a-zA-Z]+ [a-zA-Z]+)/)[1],
            executor: card.idMembers.length + " чел.",
            state: "в очереди",
            build: parseInt(card.desc.match(/\nСборка: #([0-9]+)/)[1]),
            date: card.dateLastActivity,
        };
    },
    getClientBugsByAuthor(name) {
        var list = [];
        this.bugCards.forEach(card => {
            var bug = this.convertToClientBug(card);
            if (bug.author == name) list.push(bug);
        });
        return list;
    },
};
