 // eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import "./FoodItem.css";
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';

// eslint-disable-next-line react/prop-types
const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems = {}, addToCart, removeFromCart, url } = useContext(StoreContext); // Ensure cartItems is defined

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={`${url}/images/${image || 'default.jpg'}`} alt={name || 'Food item'} /> {/* Fallback image and alt text */}

        {!cartItems[id] || cartItems[id] === 0 ? (
          <img 
            className='add' 
            onClick={() => addToCart(id)} 
            src={assets.add_icon_white} 
            alt="Add to cart" 
              />
            ):(
          <div className='food-item-counter'>
            <img 
              onClick={() => removeFromCart(id)} 
              src={assets.remove_icon_red} 
              alt="Remove from cart" 
            />
            <p>{cartItems[id] || 0}</p> {/* Fallback to 0 if cartItems[id] is undefined */}
            <img 
              onClick={() => addToCart(id)} 
              src={assets.add_icon_green} 
              alt="Add more" 
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating stars" />
        </div>
        <p className="food-item-description">{description}</p>
        <p className="food-item-price">
          {price?.toLocaleString('en-NG', { 
            style: 'currency', 
            currency: 'NGN', 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </p>
      </div>
    </div>
  );
};

export default FoodItem;
