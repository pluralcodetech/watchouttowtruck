const userDataAction = (data) => {
  return {
    type: 'UPDATE',
    payload: data,
  };
};
const updateCartAction = (data) => {
  return {
    type: 'UPDATE_CART',
    payload: data,
  };
};

const updateSavedItems = (data) => {
  return {
    type: 'UPDATE_SAVED_ITEMS',
    payload: data,
  };
};

export {userDataAction, updateCartAction, updateSavedItems};
