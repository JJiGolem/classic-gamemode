var killList = new Vue({
    el: "#killList",
    data: {
        colors: {
            1: "#e13b3b",
            2: "#00b500",
            8: "#00b500",
            9: "#da30ff",
            10: "#fff629",
            11: "#4a97d1",
            12: "#a7ff50",
            13: "#cbae8c",
            14: "#0b0b0b",
        },
        maxCount: 5,
        types: ["car", "hand"],
        list: [],
    },
    computed: {
        isShow() {
            return this.list.length && !selectMenu.show;
        }
    },
    methods: {
        add(target, killer, reason) {
            if (typeof target == 'string') target = JSON.parse(target);
            if (typeof killer == 'string') killer = JSON.parse(killer);

            this.list.push({
                target: target,
                killer: killer,
                reason: reason
            });
            if (this.list.length > this.maxCount) this.list.shift();
        },
        playerColor(player) {
            return this.colors[player.factionId] || "#fff";
        },
        killImgSrc(reason) {
            var icon = "kill";
            if (this.types.includes(reason)) icon = reason;
            return `img/killList/${icon}.svg`;
        },
        isWeapon(reason) {
            return !this.types.includes(reason);
        }
    }
});

// for tests
/*killList.add({
        name: "Swifty Swift",
        factionId: 8
    }, {
        name: "Carter Slade",
        factionId: 9
    },
    "car");
killList.add({
    name: "Swifty Swift",
    factionId: 11
}, {
    name: "Carter Slade",
    factionId: 10
}, "Pistol");
killList.add({
    name: "Swifty Swift",
    factionId: 8
}, {
    name: "Carter Slade",
    factionId: 1
}, "hand");

killList.add({
    name: "Swifty Swift",
    factionId: 9
});*/
