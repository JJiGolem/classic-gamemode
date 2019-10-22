var notifications = new Vue({
    el: "#notifications",
    data: {
        messages: [],
        // Время показа уведомления
        showTime: 10000,
        // Макс. кол-во уведомлений на экране
        maxCount: 7
    },
    methods: {
        push(type, text, header) {
            if (header == 'undefined' || header == 'null') header = null;
            this.messages.push({
                type: type,
                header: header,
                text: text
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
// notifications.push("success", "зачисление + $500", "Банк Maze");
