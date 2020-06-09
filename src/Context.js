import React, { useState } from 'react';

const AppContext = React.createContext([{}, () => {}]);

const AppContextProvider = (props) => {

  const localState = JSON.parse(localStorage.getItem('storeData'));

  const initialState = {
    cart: {},
    totalPrice: 0
  }
  
  const [state, setState] = useState(localState || initialState);

  return (
    <AppContext.Provider value={[state, setState]}>
      { props.children }
    </AppContext.Provider>
  );
}

export { AppContext, AppContextProvider};