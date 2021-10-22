const userDataAction = data => {
  return {
    type: 'UPDATE',
    payload: data,
  };
};
const createOrderAction = data => {
  return {
    type: 'CREATE',
    payload: data,
  };
};

export {userDataAction, createOrderAction};
