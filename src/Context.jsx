import React, { useState } from 'react';

const AppContext = React.createContext([{}, () => {}]);

const AppContextProvider = ({ children }) => {
  const localStoreState = JSON.parse(localStorage.getItem('storeData'));
  const localState = {
    ...localStoreState,
    isAuthenticated: !!localStorage.getItem('token')
  }

  const initialState = {
    cart: {},
    totalPrice: 0,
    isAuthenticated: false,
  };

  const [state, setState] = useState(localState || initialState);

  return (
    <AppContext.Provider value={[state, setState]}>
      { children }
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
