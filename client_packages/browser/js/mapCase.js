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
    ems: mapCaseEmsData,
    wnews: mapCaseWnewsData,
    fib: mapCaseFIBData,
    ng: mapCaseNgData,
    gover: mapCaseGoverData,
}

var mapCase = new Vue({
    el: "#map-case",
    data: {
        type: "",
        show: false,
        lastShowTime: 0,
        enable: false,
        inputFocus: false,
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
            if (this.currentWindowName == "members")
                return 'map-case-members';
            if (this.currentWindowName == "calls")
                return 'map-case-calls';

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

            if (this.loadInterval)
                clearInterval(this.loadInterval);

            this.loadInterval = setInterval(() => {

                if (this.loadMod.loadCount % 2 == 0)
                    this.loadMod.waitingTime--;
                if ((this.loadMod.waitingTime < 0 || !this.loadMod.waitingTime) && this.loadMod.loadCount > 18) {
                    this.hideLoad();
                    this.showRedMessage("Непредвиденная ошибка сервера");
                    return;
                }
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
            mp.trigger("blur", val, 300);
            mp.trigger("mapCase.animation.show.play", val);
            if (val) busy.add("mapCase", true, true);
            else busy.remove("mapCase", true);
            this.lastShowTime = Date.now();
            if (!val && this.timerId) {
                clearInterval(this.timerId);
                return;
            }

            function setTime() {
                let date = convertToMoscowDate(new Date());
                let hours = date.getHours() + "";
                let minutes = date.getMinutes() + "";

                if (hours.length < 2) hours = "0" + hours;
                if (minutes.length < 2) minutes = "0" + minutes;
                mapCase.time = `${hours}:${minutes}`;
            };
            setTime();
            this.timerId = setInterval(setTime, 60000);
        },
        enable(val) {
            if (!val) this.show = false;
        },
    },
    mounted() {
        let self = this;
        window.addEventListener('keyup', function(e) {
            if (busy.includes(["auth", "chat", "terminal", "inventory", "playerMenu", "phone", "inputWindow", "jobProcess", "timer", "playersList", "bugTracker"])) return;
            if (selectMenu.isEditing) return;
            if (Date.now() - self.lastShowTime < 500) return;
            if (self.inputFocus) return;
            if (e.keyCode == 80 && self.enable) self.show = !self.show; // P
        });
    }
});

Vue.component('map-case-members', {
    template: "#map-case-members",
    props: {
        list: Array,
        sortMod: Object,
        ranks: Array,
        rankHead: String,
        dismiss: Function,
        lowerRank: Function,
        raiseRank: Function,
    },
    data: () => ({
        modalIsShow: false,
        currentRecord: null,
        lastUsedRecord: null,
        modalStyles: {
            top: 0,
        },

        arrows: mapCaseSvgPaths.tableSortArrows,
    }),
    computed: {
        sortedList() {
            let newList = [...this.list];

            mapCaseSortByKey(newList, this.sortMod.mod);

            if (this.sortMod.mod == "rank")
                newList.reverse();

            return newList;
        },
    },
    methods: {
        onClickSort(sortMod) {
            this.sortMod.update(sortMod);
        },
        showModal(event, record) {
            this.currentRecord = record;
            this.lastUsedRecord = record;
            this.modalIsShow = true;

            let offsetTop = event.target.parentElement.offsetTop;
            let height = event.target.parentElement.clientHeight;
            let scrollTop = this.$refs.membersBody.scrollTop;

            let parentHeight = this.$refs.membersBody.clientHeight;
            let modalHeight = window.innerHeight * 0.09;
            let compOffsetTop = offsetTop + height - scrollTop;

            this.modalStyles.top = ((compOffsetTop > parentHeight * 1.25) ? (offsetTop - modalHeight - scrollTop) : compOffsetTop) + "px";
        },
        hideModal(event) {
            let className = event && event.target.className;

            if (className == 'record-align btn') return;

            this.modalIsShow = false;
            this.currentRecord = null;
        },
        acceptDismiss() {
            mapCase.showLoad();

            this.dismiss(this.lastUsedRecord);
        },
        onClickDismiss() {
            mapCase.showVerification(`Вы действительно хотите уволить <br /><span>${this.lastUsedRecord.name}</span>?`, this.acceptDismiss);
        },
        acceptLower() {
            mapCase.showLoad();

            this.lowerRank(this.lastUsedRecord);
        },
        onClickLower() {
            mapCase.showVerification(`Вы действительно хотите понизить <br /><span>${this.lastUsedRecord.name}</span>?`, this.acceptLower);
        },
        acceptRaise() {
            mapCase.showLoad();

            this.raiseRank(this.lastUsedRecord);
        },
        onClickRaise() {
            mapCase.showVerification(`Вы действительно хотите повысить <br /><span>${this.lastUsedRecord.name}</span>?`, this.acceptRaise);
        },
    }
});

Vue.component('map-case-calls', {
    template: "#map-case-calls",
    props: {
        list: Array,
        sortMod: Object,
        accept: Function,
    },
    data: () => ({
        arrows: mapCaseSvgPaths.tableSortArrows,
        hint: {
            data: null,
            style: null,
        },
    }),
    computed: {
        sortedList() {
            let newList = [...this.list];

            mapCaseSortByKey(newList, this.sortMod.mod)
            this.mouseout();
            return newList;
        },
    },
    methods: {
        onClickSort(sortMod) {
            this.sortMod.update(sortMod);
        },
        onClickAccept(data) {
            mapCase.showLoad();
            this.accept(data);
        },
        mouseout(e) {
            this.hint.data = null;
        },
        mousemove(e, record) {
            if (!this.hint.data) {
                if (e.target.className != "record") {
                    this.mouseout();
                    return;
                }

                this.hint.data = {
                    description: record.description,
                    dist: prettyMoney(record.num),
                };
            }

            let offsetX = e.offsetX + 15;
            let offsetY = e.offsetY + e.target.offsetTop - e.target.parentElement.scrollTop + 15;

            let opacity = 1;
            if (this.$refs.hint) {
                if (offsetX + this.$refs.hint.offsetWidth > e.target.offsetWidth)
                    offsetX = e.offsetX - this.$refs.hint.offsetWidth - 2;

                if (offsetY + this.$refs.hint.offsetHeight > this.$refs.table.offsetHeight)
                    offsetY -= this.$refs.hint.offsetHeight + 15;/*e.offsetY + e.target.offsetTop + e.target.parentElement.scrollTop - this.$refs.hint.offsetHeight - 2;*/
            } else
                opacity = 0;

            this.hint.style = {
                top: offsetY + "px",
                left: offsetX + "px",
                opacity: opacity,
            }
        },
        getDist(record) {
            return record.num = parseInt(Math.sqrt(Math.pow(hud.localPos.x - record.pos.x, 2) + Math.pow(hud.localPos.y - record.pos.y, 2)));
        },
    },
    filters: {
        km(val) {
            return (val / 1000).toFixed(1);
        }
    }
});

// for tests
/*mapCase.type = "ems";
mapCase.show = true;
mapCase.enable = true;
mapCase.userName = "user"*/
