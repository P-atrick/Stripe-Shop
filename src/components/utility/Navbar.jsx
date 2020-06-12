import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const Navbar = () => (
  <Menu
    mode="horizontal"
    theme="dark"
    selectable={false}
  >
    <Menu.Item key="home" icon={<HomeOutlined />}>
      <Link to="/">Home</Link>
    </Menu.Item>
    <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
      <Link to="/cart">Cart</Link>
    </Menu.Item>
  </Menu>
);

export default Navbar;
