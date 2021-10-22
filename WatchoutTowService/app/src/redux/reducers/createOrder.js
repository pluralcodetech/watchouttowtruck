const createOrderReducer = (state = false, action) => {
  switch (action.type) {
    case 'CREATE':
      return action.payload;
    default:
      return state;
  }
};

export default createOrderReducer;
