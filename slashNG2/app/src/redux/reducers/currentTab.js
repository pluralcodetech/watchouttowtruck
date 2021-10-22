const currentTabReducer = (state = {currentTab: null}, action) => {
  switch (action.type) {
    case 'UPDATE_CURRENT_TAB':
      return action.payload;
    default:
      return state;
  }
};

export default currentTabReducer;
