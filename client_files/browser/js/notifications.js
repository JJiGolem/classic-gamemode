var notifications = new Vue({
    el: "#notifications",
    data: {
        messages: [
            /*{ type: "error", header: "Бизнес", text: "Вы не оплатили налог 100000$", hash: 122 },
            { type: "success", header: "header", text: "text message", hash: 123 },
            { type: "info", header: "header", text: "text message", hash: 142 },
            { type: "warning", header: "header", text: "text message", hash: 12 },*/
        ],
        // Время показа уведомления
        showTime: 10000,
        // Макс. кол-во уведомлений на экране
        maxCount: 7,
        count: 0, //Для уникального ключа.
    },
    methods: {
        push(type, text, header) {
            if (header == 'undefined' || header == 'null') header = null;
            this.messages.push({
                type: type,
                header: header,
                text: text,
                hash: ++this.count,
            });
            if (this.messages.length > this.maxCount) this.messages.shift();
            var self = this;
            setTimeout(() => {
                self.messages.shift();
            }, this.showTime);
        }
    }
});

// for tests
notifications.push("error", "зачисление + $500", "Банк Maze");
notifications.push("success", "зачисление + $500", "Банк Maze");
notifications.push("info", "зачисление + $500", "Банк Maze");
notifications.push("warning", "зачисление + $500", "Банк Maze");
