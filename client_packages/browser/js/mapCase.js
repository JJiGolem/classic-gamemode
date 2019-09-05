Vue.filter("textSplice", (value, length) => {
    if (value.length < length) return value;
    return value.slice(0, length) + "...";
});


function mapCaseSortByKey(list, key) {
    list.sort((a, b) => {
        if (a[key] > b[key]) return 1;
        if (a[key] < b[key]) return -1;
        return 0;
    });
};


var mapCaseData = {
    pd: mapCasePdData,
}

var mapCase = new Vue({
    el: "#map-case",
    data: {
        type: "",
        show: false,
        enable: false,
        userName: "",
        verification: null,

        popupMessage: null,
        menuFocus: "",
        time: "00:12",
        timerId: null,
        mapCaseData: mapCaseData,

        currentOverWindow: null,
        overData: null,

        loadMod: null,
        loadInterval: null,
        waitingTime: 0,
    },
    computed: {
        certainData() {
            return this.mapCaseData[this.type];
        },
        currentWindowName() {
            let wins = this.certainData.menuBody[this.menuFocus].windows;
            return winName = wins[wins.length - 1];
        },
        currentWindow() {
            return `map-case-${this.type}-${this.currentWindowName}`;
        },
        dataForWindow() {
            let wins = this.certainData.menuBody[this.menuFocus].windows;
            let winName = wins[wins.length - 1];

            return {
                ...this.certainData.windowsData[winName],
                currentMenuFocus: this.menuFocus,
            };
        },
        emergencyCall() {
            return this.certainData.emergencyCall;
        },
        blurMod() {
            return this.loadMod || this.popupMessage || this.verification || this.currentOverWindow;
        },
    },
    methods: {
        onClickMenuItem(name) {
            this.menuFocus = name;
        },
        onClickBack() {
            this.certainData.menuBody[this.menuFocus].windows.pop();
        },
        hidePopupMessage() {
            this.popupMessage = null;
        },
        showLoad(message, waitingTime) {
            this.loadMod = {
                message: message,
                waitingTime: waitingTime,
                loadCount: 0
            };

            this.loadInterval = setInterval(() => {
                if (this.loadMod.loadCount % 2 == 0)
                    this.loadMod.waitingTime--;

                this.loadMod.loadCount++;
            }, 500);

            this.verification = null;
        },
        hideLoad() {
            clearInterval(this.loadInterval);
            this.loadMod = null;

        },
        showVerification(message, acceptCallback) {
            this.verification = {
                message: message,
                accept: acceptCallback,
            }
        },
        hideVerification() {
            this.verification = null;
        },
        showRedMessage(message) {
            this.popupMessage = {
                message: message,
                img: "error",
            }

            this.hideLoad();
        },
        showGreenMessage(message) {
            this.popupMessage = {
                message: message,
                img: "success",
            }

            this.hideLoad();
        },
    },
    watch: {
        type(val) {
            if (!val) return;

            this.menuFocus = Object.keys(this.certainData.menuBody)[0];
        },
        show(val) {
            setCursor(val);
            mp.trigger("blur", val, 300);
            if (val) mp.busy.add("mapCase");
            else mp.busy.remove("mapCase");
            if (!val && this.timerId) {
                clearInterval(this.timerId);
                return;
            }

            let date = new Date();
            mapCase.time = `${date.getHours()}:${date.getMinutes()}`;

            this.timerId = setInterval(() => {
                let date = new Date();
                mapCase.time = `${date.getHours()}:${date.getMinutes()}`;
            }, 60000);
        },
        enable(val) {
            if (!val) this.show = false;
        },
    },
    mounted() {
        let self = this;
        window.addEventListener('keyup', function(e) {
            if (busy.includes()) return;
            if (e.keyCode == 80 && self.enable) self.show = !self.show; // P
        });
    }
});

// for tests
/*mapCase.type = "pd";
mapCase.show = true;
mapCase.enable = true;
mapCase.userName = "user"*/
