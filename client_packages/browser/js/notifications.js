var notifications = new Vue({
    el: "#notifications",
    data: {
        messages: [
            /*{ type: "warning", header: "header", text: "text message", hash: 12 },
            { type: "info", header: "header", text: "text message", hash: 142 },
            { type: "success", header: "header", text: "text message", hash: 123 },
            { type: "error", header: "Бизнес", text: "Вы не оплатили налог 100$", hash: 122 },*/
        ],
        showTime: 10000,
        maxCount: 5,
        count: 0,
    },

    methods: {
        push(type, text, header) {
            if (header == 'undefined' || header == 'null') header = null;
            this.messages.push({
                type: type,
                img: (type.split(" ").length > 1) ? type.split(" ")[1] : type,
                header: header,
                text: text,
                hash: ++this.count,
                timer: null,
            });

            if (this.messages.length > this.maxCount) {
                let message = this.messages.shift();
                clearTimeout(message.timer);
            }
            var self = this;
            this.messages[this.messages.length-1].timer = setTimeout(() => {
                self.messages.shift();
                /*clearTimeout(message.timer);*/
            }, this.showTime);
        },
        info(text, header) {
            this.push(`info`, text, header);
        },
        warning(text, header) {
            this.push(`warning`, text, header);
        },
        success(text, header) {
            this.push(`success`, text, header);
        },
        error(text, header) {
            this.push(`error`, text, header);
        },
        addCash(text, header) {
            this.push(`add cash`, text, header);
        },
        removeCash(text, header) {
            this.push(`remove cash`, text, header);
        },
        addMoney(text, header) {
            this.push(`add money`, text, header);
        },
        removeMoney(text, header) {
            this.push(`remove money`, text, header);
        },
    }
});
