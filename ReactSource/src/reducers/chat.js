const initialState = {
    isShow: false,
    messages: [],
    opacity: 1,
    time: true,
    tags: [],
    isFocus: false
};

export default function chatList(state = initialState, action) {
    const { type, payload } = action;
    const { messages } = state;

    const CHAT_SIZE = 100;

    switch (type) {
        case 'ADD_MESSAGE_TO_CHAT':
            if (state.messages.length < CHAT_SIZE) {
                return {
                    ...state,
                    messages: [
                        ...messages,
                        {
                            text: formatMessage(payload),
                            time: getTime()
                        }
                    ]
                }
            } else {
                const newState = {
                    ...state
                };
                newState.messages.splice(0, 1);
                newState.messages.push(
                    {
                        text: formatMessage(payload),
                        time: getTime()
                    }
                );
                return newState;
            }
        case 'SET_OPACITY_CHAT':
            return {
                ...state,
                opacity: payload
            };
        case 'SHOW_CHAT':
            return {
                ...state,
                isShow: payload
            };

        case 'SET_FOCUS_CHAT':
            return {
                ...state,
                isFocus: payload
            };

        case 'SET_TAGS_CHAT':
            return {
                ...state,
                tags: payload
            };

        case 'SET_TIME_CHAT':
            return {
                ...state,
                time: payload
            };

        default:
            break;
    }

    return state;
}

function formatMessage(message) {
    var reg = /!{#[a-f0-9]{6}}/g;
    var regColor = /#[a-f0-9]{6}/g;

    var array = [];

    let colorIndex = 0;

    for (let wordIndex = 0; wordIndex < message.split(reg).length; wordIndex++) {
        if(message.split(reg)[wordIndex].trim() != '') {
            array.push({
                text: message.split(reg)[wordIndex],
                color: message.match(reg)[colorIndex].match(regColor)[0]
            })
            colorIndex++;
        }
    }

    return array;
}

function getTime() {
    let date = new Date();
    return `[${String('00' + date.getHours()).slice(-2)}:${String('00' + date.getMinutes()).slice(-2)}:${String('00' + date.getSeconds()).slice(-2)}] `
}