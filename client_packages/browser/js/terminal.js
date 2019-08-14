var terminal = new Vue({
    el: "#terminal",
    data: {
        show: false,
        enable: false,
        // Сообщения в терминале
        messages: [],
        // Макс. кол-во сообщений в терминале
        maxCount: 50,
        // Логирование введенных команд
        savedCmds: [],
        // Макс. кол-во сохраненных команд
        maxCmdsCount: 50,
        // Индекс показываемой команды
        savedCmdI: -1,
        // Текст в поле ввода
        inputText: "",
    },
    methods: {
        push(type, text) {
            this.messages.push({
                type: type,
                text: text
            });
            if (this.messages.length > this.maxCount) this.messages.shift();
        },
        onInputEnter() {
            if (!this.inputText) this.show = false;
            else {
                this.sendRemote(this.inputText.split(' '));
                this.saveCmd(this.inputText);
                this.inputText = "";
            }
            this.savedCmdI = -1;
        },
        onInputUp() {
            if (this.savedCmdI >= this.savedCmds.length - 1) return;
            this.savedCmdI++;
            this.inputText = this.savedCmds[this.savedCmdI];
        },
        onInputDown() {
            if (this.savedCmdI <= 0) {
                if (this.savedCmdI == 0) this.savedCmdI--;
                return this.inputText = "";
            }
            this.savedCmdI--;
            this.inputText = this.savedCmds[this.savedCmdI];
        },
        sendRemote(values) {
            // console.log(`sendRemote:`);
            // console.log(values)
            mp.trigger("callRemote", "terminal.command.handle", JSON.stringify(values));
        },
        saveCmd(text) {
            this.savedCmds.unshift(text);
            if (this.savedCmds.length > this.maxCmdsCount) this.savedCmds.shift();
        },
    },
    watch: {
        enable(val) {
            if (!val) this.show = false;
        },
        show(val) {
            if (val) {
                this.inputText = "";
                setTimeout(() => {
                    this.$refs["input"].focus();
                }, 100);
            }
            setCursor(val);
        }
    },
    mounted() {
        let self = this;
        window.addEventListener('keyup', function(e) {
            if ((e.keyCode == 192 || e.keyCode == 1040) && self.enable) self.show = !self.show;
        });
    }
});

// for tests
/*terminal.push("log", "Лог");
terminal.push("info", "Информация");
terminal.push("warning", "Внимание");
terminal.push("error", "Ошибка");
terminal.push("debug", "Дебаг");
terminal.enable = true;
terminal.show = true;*/
