var changelist = new Vue({
    el: "#changelist",
    data: {
        // Показ на экране
        show: false,
        // Список обновлений
        list: [{
                id: 1,
                date: "Пт, Сен 27, 2019",
                features: [
                    "Улучшение 1",
                    "Улучшение 2",
                ],
                fixed: [
                    "Fix 1",
                    "Fix 2",
                ],
                improvements: [
                    "improvement 1",
                    "improvement 2",
                ],
                removed: [
                    "removed 1",
                    "removed 2",
                ],
            },
            {
                id: 2,
                date: "Сб, Сен 28, 2019",
                features: [
                    "adsas",
                    "sdasd",
                ],
                fixed: [
                    "sdadsadsa",
                    "dsadsa",
                ],
                improvements: [
                    "dsadsad",
                    "improvesadsadment 2",
                ],
                removed: [
                    "removed 1sdasd",
                    "removed sdsadas2",
                ],
            },
            {
                id: 3,
                date: "Сб, Сен 28, 2019",
                features: [
                    "adsas",
                    "sdasd",
                ],
                fixed: [
                    "sdadsadsa",
                    "dsadsa",
                ],
                improvements: [
                    "dsadsad",
                    "improvesadsadment 2",
                ],
                removed: [
                    "removed 1sdasd",
                    "removed sdsadas2",
                ],
            },
        ],
        // Текущее обновление на экране
        i: 0,
    },
    mounted() {
        this.i = this.list.length - 1;
    },
});

// for tests
// changelist.show = true;
