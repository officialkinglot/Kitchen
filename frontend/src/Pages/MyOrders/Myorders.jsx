import React, { useContext, useEffect, useState } from 'react';
import "./Myorders.css";
import { StoreContext } from '../../Context/StoreContext';
import axios from "axios";
import { assets } from '../../assets/assets';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options).replace(/(\d+)(st|nd|rd|th)/, '$1');
};

const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const period = parseInt(hours) >= 12 ? 'PM' : 'AM';
  const formattedHours = parseInt(hours) % 12 || 12;
  return `${formattedHours}:${minutes} ${period}`;
};

const Myorders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      const sortedOrders = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      console.log("Sorted Orders:", sortedOrders); // Debugging line
      setOrders(sortedOrders || []); // Add fallback for response data
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchEventBookings = async () => {
    try {
      const response = await axios.get(url + "/api/events/list", { headers: { token } });
      const sortedEvents = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      console.log("Sorted Events:", sortedEvents); // Debugging line
      setEvents(sortedEvents || []); // Add fallback for response data
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchEventBookings();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="my-orders-container">
        {orders.length > 0 ? orders.map((order, index) => (
          <div key={index} className='my-orders-order'  >
            <img src={assets.parcel_icon} alt="Parcel Icon" className="parcel-icon" />
            <p className='order-items'>
              {order.items?.map((item, itemIndex) => ( // Ensure order.items exists
                <span key={itemIndex}>
                  {item.name} x {item.quantity}
                  {itemIndex === order.items.length - 1 ? '' : ', '}
                </span>
              ))}
            </p>
            <p className='my-order-price'>
              {order.amount?.toLocaleString('en-NG', { // Ensure order.amount exists
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
            <p>Items: {order.items?.length || 0}</p> {/* Fallback to 0 if order.items is undefined */}
            <div className='status'><span>&#x25cf;</span> <b>{order.status}</b></div>
            <button onClick={fetchOrders} className='track-order-btn'>Track Order</button>
          </div>
        )) : <p>No orders found.</p>}

        {/* Display the list of events */}
        {events.length > 0 ? events.map((event, index) => (
          <div key={index} className='event-item'>
            <h3>Event Booking:</h3>
            <p className="yourname">Name: {event.name}</p>
            <p>Venue: {event.eventVenue}</p>
            <p>Type: {event.eventType}</p>
            <p>Capacity: {event.capacity} People</p>
            <button onClick={fetchEventBookings} > <div className='status'><span>{event.status}</span></div></button>
            <p><b><button>Booked</button></b></p>

            <p className="date">Date: {formatDate(event.eventDate)}</p>
            <p>Time: {(event.eventTime)}</p> {/* Use formatTime function */}
            <p className="food">Food: {event.foodTypes}</p>
            <p>Phone: {event.phoneNumber}</p>
          </div>
        )) : <p>No event bookings found.</p>}
      </div>
    </div>
  );
};

export default Myorders;
