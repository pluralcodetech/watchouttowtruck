import {combineReducers} from 'redux';
import userDataReducer from './userData';
import currentTabReducer from './currentTab';

export default combineReducers({
  userData: userDataReducer,
  currentTab: currentTabReducer,
});
