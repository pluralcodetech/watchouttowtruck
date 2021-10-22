import {combineReducers} from 'redux';
import userDataReducer from './userData';
import cart from './cart';
import savedItemsReducer from './savedItems';

export default combineReducers({
  userData: userDataReducer,
  userCart: cart,
  savedItems: savedItemsReducer,
});
