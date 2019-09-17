var playersList = new Vue({
    el: '#playersList',
    data: {
        show: true,
        players: [
            {
                name: 'Dun Hill',
                faction: 'LSPD',
                ping: 9
            },
            {
                name: 'Swifty Swift',
                faction: '-',
                ping: 5
            },
            {
                name: 'Deus Memes',
                faction: '-',
                ping: 9
            },
            {
                name: 'Sean Muller',
                faction: 'LSPD',
                ping: 9
            },
            {
                name: 'Sean Hans',
                faction: 'EMS',
                ping: 9
            },
        ],
        loader: false,
        word: ''
    },
    methods: {
        getPlayers(type) {
            return this.players.filter(player => player[type].toString().startsWith(this.word));
        }
    }
})