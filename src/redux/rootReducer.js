import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import presentationReducer from './slices/presentation';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const rootReducer = combineReducers({
  presentation: presentationReducer
});

export { rootPersistConfig, rootReducer };
