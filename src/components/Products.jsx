import React from 'react';
import { Link } from 'react-router-dom';
import { string } from 'prop-types';
import { Card } from 'antd';
import { toast } from 'react-toastify';
import productsData from '../Data/productsData';
import formatPrice from './utility/FormatPrice';
import 'react-toastify/dist/ReactToastify.css';

const Products = (props) => {
  let { toastMessage } = props;

  if (toastMessage2) {
    toast.configure();
    toast.success(toastMessage, {
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    });
    toastMessage = '';
  }

  return (
    <div>
      <div className="productsContainer">
        {productsData.map((product) => (
          <Link
            to={{
              pathname: `/product/${product.id}`,
            }}
            key={product.id}
          >
            <Card
              className="productCard"
              cover={<img alt={`${product.name}`} src={require(`../../public/assets/product-images/${product.image}`)} />}
              hoverable
              style={{ width: '100' }}
            >
              <p className="productName">{ product.name }</p>
              <p>
                £
                { formatPrice(product.price) }
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Products;

Products.propTypes = {
  toastMessage: string,
};

Products.defaultProps = {
  toastMessage: '',
};
