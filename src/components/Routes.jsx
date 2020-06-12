import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Products from './Products'
import Cart from './checkout/Cart'
import OrderComplete from './checkout/OrderComplete'
import ErrorDisplay from './error/ErrorDisplay';

export default () => {
  return (
    <Switch>
      <Route exact path='/' component={Products} />
      <Route path='/cart' component={Cart} />
      <Route path='/ordercomplete' component={OrderComplete} />
      <Route render={()=><ErrorDisplay status={404}/>} />
    </Switch>
  )
}