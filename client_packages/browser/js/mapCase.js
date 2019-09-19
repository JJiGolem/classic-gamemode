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
}

var mapCase = new Vue({
    el: "#map-case",
    data: {
        type: "",
        show: false,
        lastShowTime: 0,
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
            if (val) busy.add("mapCase", true);
            else busy.remove("mapCase", true);
            this.lastShowTime = Date.now();
            if (!val && this.timerId) {
                clearInterval(this.timerId);
                return;
            }

            function setTime () {
                let date = new Date();
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
            if (busy.includes(["chat", "terminal", "inventory", "phone"])) return;
            if (Date.now() - self.lastShowTime < 500) return;
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
        sortedList () {
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
        hideModal (event) {
            let className = event && event.target.className;

            if (className == 'record-align btn') return;

            this.modalIsShow = false;
            this.currentRecord = null;
        },
        acceptDismiss () {
            mapCase.showLoad();

            this.dismiss(this.lastUsedRecord);
        },
        onClickDismiss () {
            mapCase.showVerification(`Вы действительно хотите уволить <br /><span>${this.lastUsedRecord.name}</span>?`, this.acceptDismiss);
        },
        acceptLower () {
            mapCase.showLoad();

            this.lowerRank(this.lastUsedRecord);
        },
        onClickLower () {
            mapCase.showVerification(`Вы действительно хотите понизить <br /><span>${this.lastUsedRecord.name}</span>?`, this.acceptLower);
        },
        acceptRaise () {
            mapCase.showLoad();

            this.raiseRank(this.lastUsedRecord);
        },
        onClickRaise () {
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
    }),
    computed: {
        sortedList () {
            let newList = [...this.list];

            mapCaseSortByKey(newList, this.sortMod.mod)

            return newList;
        },
    },
    methods: {
        onClickSort(sortMod) {
            this.sortMod.update(sortMod);
        },
        onClickAccept (data) {
            mapCase.showLoad();
            this.accept(data);
        }
    }
});

// for tests
/*mapCase.type = "pd";
mapCase.show = true;
mapCase.enable = true;
mapCase.userName = "user"*/
