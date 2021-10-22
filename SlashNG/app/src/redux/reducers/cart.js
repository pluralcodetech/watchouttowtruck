const cartReducer = (state = {totalQuantity: 0, porducts: []}, action) => {
  switch (action.type) {
    case 'UPDATE_CART':
      return action.payload;
    default:
      return state;
  }
};

export default cartReducer;
