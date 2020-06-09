import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{
  color: '#1890ff',
  fontSize: '10em',
  top: '50%'
}} spin />;

export const CheckoutFormSpinner = () => {
  return (
    <React.Fragment>
    <Spin
      className='checkoutFormSpinner'
      indicator={antIcon}
    />
    Processing payment...
    </React.Fragment>
  )
}