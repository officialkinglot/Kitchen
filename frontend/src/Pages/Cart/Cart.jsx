 // eslint-disable-next-line no-unused-vars 
import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className='cart-items'>
        <div className="cart-items-title">
          <p>Items</p>
          <p className='separate-title'>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list?.map((item, index) => { // Add optional chaining to food_list
          if (cartItems?.[item._id] > 0) { // Add optional chaining to cartItems
            return (
              <div key={index}> {/* Added key prop for unique mapping */}
                <div className='cart-items-title cart-items-item'>
                  <img src={`${url}/images/${item.image || 'default.jpg'}`} alt={item.name || 'Food item'} /> {/* Fallback for item.image */}
                  <p>{item.name}</p>
                  <p>{item.price?.toLocaleString('en-NG', { // Add optional chaining to item.price
                    style: 'currency',
                    currency: 'NGN',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>{(item.price * cartItems[item._id])?.toLocaleString('en-NG', { // Add optional chaining
                    style: 'currency',
                    currency: 'NGN',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</p>

                  <p className='cross' onClick={() => removeFromCart(item._id)}> X </p>
                </div>
                <hr />
              </div>
            );
          }
          return null; // Ensure a return statement even if condition is false
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Sub Total</p>
              <p>{getTotalCartAmount()?.toLocaleString('en-NG', { // Add optional chaining to getTotalCartAmount
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{(getTotalCartAmount() === 0 ? 0 : 1000)?.toLocaleString('en-NG', { // Add optional chaining
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b className='total'>Total</b>
              <b>{(getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 1000)?.toLocaleString('en-NG', { // Add optional chaining
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}> PROCEED TO CHECKOUT </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>Have a promocode? Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder='promocode' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
