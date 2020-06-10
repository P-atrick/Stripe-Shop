export const persistState = (state) => {
  const stateToStore = {
    cart: state.cart,
    totalPrice: state.totalPrice
  }
  localStorage.setItem('storeData', JSON.stringify(stateToStore));
}