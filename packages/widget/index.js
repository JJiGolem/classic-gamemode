let timer;
const request = require('request');
const param = require('jquery-param');

let widgetConfig = {};
let widgetInterval;

const SERVER_IP = '51.89.96.156';
const UPDATE_TIME_WIDGET = 60000;

const ACCESS_TOKEN = 'a76a14300173c02400a547063e1c9c4aaedcedc69eb3f7da762a734356196bd48b963a0f9147ecc6454a9';
const VERSION = 5.103;

module.exports = {
    init() {
        timer = call('timer');
        widgetConfig = {
            online: mp.players ? mp.players.length : 0,
            maxplayers: mp.config.maxplayers,
            ip: SERVER_IP,
            port: mp.config.port
        }

        if (mp.config.updateWidget) {
            widgetInterval = timer.addInterval(() => {
                this.update();
            }, UPDATE_TIME_WIDGET);
        }

        console.log('[WIDGET] Виджет запущен');
    },

    update() {
        widgetConfig.online = mp.players.length;

        let params = {
            type: 'table',
            v: VERSION,
            access_token: ACCESS_TOKEN,
            code: `
                return { 
                    "title": "Онлайн сервера", 
                    "more": "Как играть", 
                    "more_url": "https://vk.com/topic-36987301_38409683", 
                    "head": [{ 
                        "text": "Название",
                        "align": "center" 
                    }, { 
                        "text": "Онлайн" ,
                        "align": "center"
                    }, { 
                        "text": "IP" ,
                        "align": "center"
                    }], 
                    "body": [ 
                        [{ 
                            "text": "Classic Roleplay",
                            "icon_id": "club36987301" 
                        }, 
                        { 
                            "text": "${widgetConfig.online}/${widgetConfig.maxplayers}"
                        },
                        { 
                            "text": "${widgetConfig.ip}:${widgetConfig.port}", 
                            "url": "https://vk.com/topic-36987301_38409683" 
                        }]
                    ] 
                };`
        };

        let request_params = param(params);

        request.get('https://api.vk.com/method/appWidgets.update?' + request_params, (err, res, body) => {
            if (err) return console.log(err);

            console.log('[WIDGET] Виджет обновлен. Следущее обновление через 1 минуту');
        });
    }
}