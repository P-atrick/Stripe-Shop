import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Products } from './Products.jsx'
import { Cart } from './Cart.jsx'

export default () => {
  return (
    <Switch>
      <Route exact path='/' component={ Products } />
      <Route path='/cart' component={ Cart } />
    </Switch>
  )
}