const userDataAction = (data) => {
  return {
    type: 'UPDATE',
    payload: data,
  };
};
const updateCurrentTab = (data) => {
  return {
    type: 'UPDATE_CURRENT_TAB',
    payload: data,
  };
};

export {userDataAction, updateCurrentTab};
