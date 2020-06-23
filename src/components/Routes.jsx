import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Products from './Products';
import Cart from './checkout/Cart';
import OrderComplete from './checkout/OrderComplete';
import ErrorDisplay from './error/ErrorDisplay';
import ProductPage from './ProductPage';

export default () => (
  <Switch>
    <Route exact path='/' component={Products} />
    <Route path='/product/:productId' component={ProductPage} />
    <Route path='/cart' component={Cart} />
    <Route path='/ordercomplete' component={OrderComplete} />
    <Route render={() => <ErrorDisplay status={404} />} />
  </Switch>
);
