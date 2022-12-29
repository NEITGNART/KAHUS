import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import presentationReducer from './slices/presentation';
import chatReducer from './slices/chat';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const rootReducer = combineReducers({
  presentation: presentationReducer,
  chat: chatReducer
});

export { rootPersistConfig, rootReducer };
