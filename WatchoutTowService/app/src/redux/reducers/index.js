import {combineReducers} from 'redux';
import createOrderReducer from './createOrder';
import userDataReducer from './userData';

export default combineReducers({
  userData: userDataReducer,
  createOrder: createOrderReducer,
});
