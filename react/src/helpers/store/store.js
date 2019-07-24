import { createStore } from 'redux';

import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducers from './rootReducer';
import { PlayerEvents } from '../../events/playerEvents';

const store = createStore(rootReducers,
    composeWithDevTools());

PlayerEvents(store.dispatch, store.getState);

export default store;

