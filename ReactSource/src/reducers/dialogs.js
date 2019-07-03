const initialState = [
]

export default function dialogsList(state = initialState, action) {
    const { type, payload } = action;
    const DIALOG_SIZE = 10;

    switch(type) {
        case 'ADD_DIALOGS': 
            return payload;

        case 'ADD_DIALOG':
            const newDial = [...state];
            newDial.push({
                name: payload.name,
                number: payload.number,
                messages: []
            })
            return newDial;

        case 'DELETE_DIALOG':
            break;
            
        case 'ADD_MESSAGE':
            let ind = state.findIndex(con => con.number == payload.number);
            const newState = [ ...state ]
            if(ind !== -1) {
                if(state[ind].messages.length < DIALOG_SIZE) {
                    newState[ind].messages.push({text: payload.text, isMine: payload.isMine});
                    return newState;
                } else {
                    newState[ind].messages.splice(0, 1);
                    newState[ind].messages.push({text: payload.text, isMine: payload.isMine});
                    return newState;
                }
            } else {
                newState.push({
                    name: '',
                    number: payload.number,
                    messages: [
                        {
                            text: payload.text,
                            isMine: payload.isMine
                        }
                    ]
                })
            }
            return newState;  
    }

    return state;
}