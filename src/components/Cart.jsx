import React, { useContext } from 'react';
import { Table } from 'antd';
import { AppContext } from '../Context';
import { formatPrice } from './utility/FormatPrice'

export const Cart = () => {

  const [state] = useContext(AppContext);

  const tableColumns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product'
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice'
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice'
    }
  ];

  const tableData = []
  Object.entries(state.cart).forEach((item) => {
    tableData.push({
      key: item[0],
      product: item[1].name,
      unitPrice: `£${formatPrice(item[1].unitPrice)}`,
      quantity: item[1].quantity,
      totalPrice: `£${formatPrice(item[1].totalPrice)}`
    })
  })
 
  return (
    <div>
      <Table
        columns={tableColumns}
        dataSource={tableData}
        footer={() => `Total Price: £${formatPrice(state.totalPrice)}`}
        pagination={false}
      />
    </div>
  )
}