import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Menu } from 'antd';
import { HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { AppContext } from '../../Context';

const Navbar = () => {
  const [state] = useContext(AppContext);

  return (
    <Menu
      mode="horizontal"
      selectable={false}
    >
      <Menu.Item key="home">
        <Link to="/"><HomeOutlined /></Link>
      </Menu.Item>

      <Menu.Item key="cart" icon={<ShoppingCartOutlined />} style={{ float: 'right' }}>
        <Link to="/cart">
          Cart
          <Badge
            count={Object.keys(state.cart).length}
            overflowCount={99}
            showZero={true}
          />
        </Link>
      </Menu.Item>

      <Menu.Item key="login" style={{ float: 'right' }}>
        <Link to="/login">Login</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
