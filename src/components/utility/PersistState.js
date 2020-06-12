const persistState = (state) => {
  console.log('persisting')
  const stateToStore = {
    cart: state.cart,
    totalPrice: state.totalPrice,
  };
  localStorage.setItem('storeData', JSON.stringify(stateToStore));
};

export default persistState;
