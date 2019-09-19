var playersList = new Vue({
    el: '#playersList',
    data: {
        show: true,
        players: [
            // {
            //     id: 1,
            //     name: 'Dun Hill',
            //     faction: 'LSPD',
            //     ping: 9
            // },
            // {
            //     id: 2,
            //     name: 'Swifty Swift',
            //     faction: '-',
            //     ping: 5
            // },
            // {
            //     id: 3,
            //     name: 'Deus Memes',
            //     faction: '-',
            //     ping: 9
            // },
            // {
            //     id: 4,
            //     name: 'Sean Muller',
            //     faction: 'LSPD',
            //     ping: 9
            // },
            // {
            //     id: 5,
            //     name: 'Sean Hans',
            //     faction: 'EMS',
            //     ping: 9
            // },
        ],
        loader: false,
        search: '',
        type: 'name',
        sortedBy: 'id',
        options: [
            { text: 'id', value: 'id' },
            { text: 'Имя', value: 'name' },
            { text: 'Организация', value: 'faction' }
        ]
    },
    methods: {
        getPlayers() {
            return this.players
                .sort((a, b) => a[this.sortedBy].toString().localeCompare(b[this.sortedBy].toString()))
                .filter(player => player[this.type]
                    .toString()
                    .toLowerCase()
                    .startsWith(this.search.toString().toLowerCase()))
        },
        setSortedBy(newSortedBy) {
            this.sortedBy = newSortedBy;
        }
    }
})