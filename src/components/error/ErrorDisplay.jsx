import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { WarningOutlined } from '@ant-design/icons';

const renderErrorText = (status) => {
  switch(status) {
    case 404:
      return <p>404 Page not found</p>;

    default:
      return <p>An error occurred</p>;
  }
}

const ErrorDisplay = ({ status }) => {
  return (
    <div className='errorContainer'>
      <Redirect to='/error'/>
      <WarningOutlined className='errorIcon'/>
      <div className='errorText'>{ renderErrorText(status) }</div>
      <Link to='/' className='errorLink'>Return to home</Link>
    </div>
  )
}

export default ErrorDisplay;
