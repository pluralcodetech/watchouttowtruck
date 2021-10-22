const savedItemsReducer = (state = {products: []}, action) => {
  switch (action.type) {
    case 'UPDATE_SAVED_ITEMS':
      return action.payload;
    default:
      return state;
  }
};

export default savedItemsReducer;
