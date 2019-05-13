//var tags = ["[сказать]","[крикнуть]","[шепнуть]","[рация]","[OOC]"];
$(document).ready(() => {

    var chatApp = new Vue({
        el: "#chat",
        data: {
            leftChat: true,
            chatStatus: true,
            leftChatClass: "chatLeft",
            rightChatClass: "chatRight"
        }
    });

    const messageTime = 10000; // время показа сообщения в чате
    const countMessages = 30; // макс. кол-во сообщений в чате
    var chatTimeout = null; // Timeout для чата, для его потухания при неактиве
    var chatFaded = true;

    var tags = ["Сказать", "Крикнуть", "Шепнуть", "OOC", "Действие", "Пояснение", "Риск", "Рация", "Департамент"];
    var textColors = ["#e6e6e6", "#ffffff", "#cecabe", "#ee66ff", "#ee66ff", "#ee66ff", "#ee66ff", "#6699ff", "#ff6688"];

    $("#chat input").keydown((e) => {
        if (e.keyCode == 13) { // enter

            var message = $("#chat input").val().trim();
            $("#chat input").val("");
            if (message[0] == '/') {
                message = message.substr(1);
                var arr = message.split(" ");
                var el = $(`#chat .chat-tags .${arr[0]}`);
                if (el.length) {
                    $(`#chat .chat-tags div`).removeClass("active");
                    el.addClass("active");
                    $("#chat input").attr("placeholder", tags[el.index()]);
                    arr.shift();
                    message = arr.join(" ");
                }
            }
            if (message.length == 0) return window.chatAPI.show(false);
            if (message.length > 100) message = message.substr(0, 100);
            var tag = $("#chat input").attr("placeholder");
            window.chatAPI.send(message, tag);
            cmdLoggerAPI.save(message, tag);

        }
    });
    $("#chat .chat-tags div").click((e) => {
        var index = $(e.target).index();
        $("#chat .chat-tags div").removeClass("active");
        $(e.target).addClass("active");
        $("#chat input").attr("placeholder", tags[index]);
    });
    $("#chat .help").mouseenter((e) => {
        $("#chat input").attr("placeholder", "CTRL/TAB либо /do, /try ...");
    })
    $("#chat .help").mouseleave((e) => {
        var index = $("#chat .chat-tags .active").index();
        $("#chat input").attr("placeholder", tags[index]);
    })
    window.chatAPI = {
        push: (playerName, playerId, text, tag) => {
            // debug(`chatAPI.push: ${playerName} ${playerId} ${text} ${tag}`)
            if (chatTimeout) {
                clearTimeout(chatTimeout);
                chatTimeout = null;
            }
            chatFaded = false;
            $("#chat .chat-content").css("opacity", "1.0");

            var index = tags.indexOf(tag);
            if (index == -1) return alert(`Неизвестный тип сообщения в чат!`);
            var message = "";
            var handlers = {
                "Сказать": (playerName, text) => {
                    message = `${playerName}<a class="userId">[${playerId}]</a> сказал: ${text}`;
                },
                "Крикнуть": (playerName, text) => {
                    message = `${playerName}[${playerId}] крикнул: ${text}`;
                },
                "Шепнуть": (playerName, text) => {
                    message = `${playerName}[${playerId}] шепнул: ${text}`;
                },
                "Рация": (playerName, text) => {
                    message = `${playerName}[${playerId}] сказал в рацию: ${text}`;
                },
                "OOC": (playerName, text) => {
                    message = `(( ${playerName}[${playerId}]: ${text} ))`;
                },
                "Действие": (playerName, text) => {
                    message = `${playerName}[${playerId}] ${text}`;
                },
                "Пояснение": (playerName, text) => {
                    message = `${text} | ${playerName}[${playerId}]`;
                },
                "Риск": (playerName, text) => {
                    message = `${playerName}[${playerId}] ${text}`;
                },
                "Департамент": (playerName, text) => {
                    message = `${playerName}[${playerId}] в департамент: ${text}`;
                },
            };
            handlers[tag](playerName, text);

            var div = document.createElement("div");
            div.innerHTML = message;
            var text2 = div.textContent || div.innerText || "";

            var el = $(`<div>${text2}</div>`);
            el.css("color", textColors[index]);
            $("#chat .chat-content").append(el);
            //$("#chat .chat-content").append("<hr />");
            $("#chat .chat-content").scrollTop(9999);

            if ($("#chat .chat-content div").length > countMessages) {
                $("#chat .chat-content div:first").remove();
                $("#chat .chat-content hr:first").remove();
            }

            chatTimeout = setTimeout(() => {
                if (!chatAPI.active()) $("#chat .chat-content").css("opacity", "0.7");
                chatFaded = true;
            }, messageTime);
        },
        custom_push: (text) => {
            if (chatTimeout) {
                clearTimeout(chatTimeout);
                chatTimeout = null;
            }
            chatFaded = false;
            $("#chat .chat-content").css("opacity", "1.0");
            var message = "";
            var div = document.createElement("div");
            div.innerHTML = text;
            var text2 = div.textContent || div.innerText || "";
            // chatAPI.custom_push("[A] Tomat Petruchkin: всем доброго времени суток!");
            var el = $(`<div>${text2}</div>`);
            el.css("color", "#ff6666");
            $("#chat .chat-content").append(el);
            $("#chat .chat-content").scrollTop(9999);
            if ($("#chat .chat-content div").length > countMessages) {
                $("#chat .chat-content div:first").remove();
                $("#chat .chat-content hr:first").remove();
            }
            chatTimeout = setTimeout(() => {
                if (!chatAPI.active()) $("#chat .chat-content").css("opacity", "0.7");
                chatFaded = true;
            }, messageTime);
        },
        clear: (playerName) => {
            $("#chat .chat-content").empty();
            var el = $(`<div>Администратор ${playerName} очистил чат!</div>`);
            $("#chat .chat-content").append(el);
        },
        changeOptions: (options) => {
            if (options == 1) {
                chatApp.chatStatus = false;
                mp.trigger("playerMenu.Chat", 1);
            } else {
                chatApp.chatStatus = true;
            }
            if (options == 2) {
                chatApp.leftChat = true;
                mp.trigger("playerMenu.Chat", 2);
            } else if (options == 3) {
                mp.trigger("playerMenu.Chat", 3);
                chatApp.leftChat = false;
            }
        },
        send: (message, tag) => {
            var div = document.createElement("div");
            div.innerHTML = message;
            var text = div.textContent || div.innerText || "";
            if (!isFlood()) mp.invoke("chatMessage", JSON.stringify({
                text: text.escape(),
                tag: tag
            }));
            chatAPI.show(false);
        },
        show: (enable) => {
            if (!chatApp.chatStatus) return;
            if (window.medicTablet.active() || window.pdTablet.active() || window.telephone.active() || window.sheriffTablet.active() || window.armyTablet.active() || window.fibTablet.active() || window.playerMenu.active() || consoleAPI.active() || modalAPI.active() || tradeAPI.active()) return;
            if (enable) {
                var haveRadio = Object.keys(inventoryAPI.getArrayByItemId(27)).length > 0;
                if (haveRadio) {
                    if (!tags.includes("Рация")) {
                        tags.push("Рация", "Департамент");
                        $("#chat .chat-tags").append(`<div class='radio'>Radio</div>`);
                        $("#chat .chat-tags").append(`<div class='dep'>Dep</div>`);
                    }
                } else {
                    if (tags.includes("Рация")) {
                        tags.splice(tags.indexOf("Рация"), 1);
                        tags.splice(tags.indexOf("Департамент"), 1);
                        $("#chat .chat-tags .radio").remove();
                        $("#chat .chat-tags .dep").remove();
                    }
                }

                $("#chat .chat-content").css("opacity", "1.0");
                $("#chat .chat-bottom").slideDown('fast');
                $("#chat .chat-tags").fadeIn("fast");
                setTimeout(() => {
                    $("#chat input").focus();
                }, 5);
                $("#chat .chat-content").css("overflow-y", "auto");
                //$("#chat .chat-content div").css("opacity", "1");
            } else {
                if (chatFaded) $("#chat .chat-content").css("opacity", "0.7");

                $("#chat .chat-bottom").slideUp('fast');
                $("#chat .chat-tags").fadeOut("fast");
                $("#chat .chat-content").css("overflow-y", "hidden");
                //$("#chat .chat-content div").css("opacity", "0.9");
            }
            $("#chat input").blur();
            setCursor(enable);
            mp.trigger('setBlockControl', enable);
            mp.trigger("setChatActive", enable);
        },
        active: () => {
            return $("#chat .chat-bottom").css("display") != "none";
        },
        enable: (enable) => {
            $(document).unbind('keydown', chatAPI.showHandler);
            $(document).unbind('keydown', chatAPI.tabHanlder);
            $(document).unbind('keydown', chatAPI.ctrlHanlder);
            if (enable) {
                $(document).keydown(chatAPI.showHandler);
                $(document).keydown(chatAPI.tabHanlder);
                $(document).keydown(chatAPI.ctrlHanlder);
            } else {
                chatAPI.show(false);
                $(document).unbind('keydown', chatAPI.showHandler);
                $(document).unbind('keydown', chatAPI.tabHanlder);
                $(document).unbind('keydown', chatAPI.ctrlHanlder);
            }
        },
        showHandler: (e) => {
            if (!chatApp.chatStatus) return;
            if (e.keyCode == 84) {
                if (!chatAPI.active()) chatAPI.show(true);
            }
        },
        tabHanlder: (e) => {
            if (e.keyCode == 9) {
                if (!chatAPI.active()) return;
                var index = tags.indexOf($("#chat input").attr("placeholder")) + 1;
                if (index >= tags.length) index = 0;
                // $("#chat .tag a").text(tags[index]);
                $(`#chat input`).attr("placeholder", tags[index]);
                $(`#chat .chat-tags div`).removeClass("active");
                $(`#chat .chat-tags div:eq(${index})`).addClass("active");
                // $("#chat .tag").css("color", textColors[index]);
                setTimeout(() => {
                    $("#chat input").focus();
                }, 5);
            }
        },
        ctrlHanlder: (e) => {
            if (e.keyCode == 17) {
                if (!chatAPI.active()) return;
                var index = tags.indexOf($("#chat input").attr("placeholder")) - 1;
                if (index < 0) index = tags.length - 1;
                // $("#chat .tag a").text(tags[index]);
                $(`#chat input`).attr("placeholder", tags[index]);
                $(`#chat .chat-tags div`).removeClass("active");
                $(`#chat .chat-tags div:eq(${index})`).addClass("active");
                // $("#chat .tag").css("color", textColors[index]);
                setTimeout(() => {
                    $("#chat input").focus();
                }, 5);
            }
        },
        isLeft: () => {
            return chatApp.leftChat;
        },
    };

    var cmdLoggerAPI = {
        save: (message, tag) => {
            if (cmdLoggerAPI.messages.length > 0 &&
                cmdLoggerAPI.messages[cmdLoggerAPI.index - 1].text == message) return;

            cmdLoggerAPI.messages.push({
                text: message,
                tag: tag
            });
            if (cmdLoggerAPI.messages.length > 20) cmdLoggerAPI.messages.splice(0, 1);
            cmdLoggerAPI.index = cmdLoggerAPI.messages.length;
        },
        init: () => {
            $(document).unbind('keydown', cmdLoggerAPI.handler);
            $(document).keydown(cmdLoggerAPI.handler);
        },
        handler: (e) => {
            if (!chatAPI.active()) return;
            if (e.keyCode == 38) { //up
                cmdLoggerAPI.index--;
                if (cmdLoggerAPI.index < 0) cmdLoggerAPI.index = 0;
                var message = cmdLoggerAPI.messages[cmdLoggerAPI.index].text;
                var tag = cmdLoggerAPI.messages[cmdLoggerAPI.index].tag;

                setTimeout(() => {
                    $("#chat input").val(message);
                }, 5);
                $("#chat input").attr("placeholder", tag);
                $(`#chat .chat-tags div`).removeClass("active");
                $(`#chat .chat-tags div:eq(${tags.indexOf(tag)})`).addClass("active");
                // $("#chat .tag").css("color", textColors[index]);
            } else if (e.keyCode == 40) { //bottom
                cmdLoggerAPI.index++;
                if (cmdLoggerAPI.index >= cmdLoggerAPI.messages.length) cmdLoggerAPI.index = cmdLoggerAPI.messages.length - 1;
                var message = cmdLoggerAPI.messages[cmdLoggerAPI.index].text;
                var tag = cmdLoggerAPI.messages[cmdLoggerAPI.index].tag;
                setTimeout(() => {
                    $("#chat input").val(message);
                }, 5);
                $("#chat input").attr("placeholder", tag);
                $(`#chat .chat-tags div`).removeClass("active");
                $(`#chat .chat-tags div:eq(${tags.indexOf(tag)})`).addClass("active");
            }
        },
        messages: [],
        index: 0
    };
    cmdLoggerAPI.init();

    // chatAPI.enable(true); //for test
    // chatAPI.show(true); //for test
});
