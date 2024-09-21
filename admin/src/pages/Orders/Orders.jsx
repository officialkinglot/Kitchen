import React, { useState, useEffect, useContext } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../../../frontend/src/Context/StoreContext";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date
    .toLocaleDateString("en-US", options)
    .replace(/(\d+)(st|nd|rd|th)/, "$1");
};

const Orders = () => {
  const { url } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]); // State to store the list of events

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        // Sort orders in descending order based on creation date
        const sortedOrders = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        console.log("Fetched orders:", sortedOrders); // Debugging line
        setOrders(sortedOrders);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
    }
  };

  const fetchEventBookings = async () => {
    try {
      const response = await axios.get(`${url}/api/events/list`);
      if (response.data.success) {
        // Sort events in descending order based on creation date
        const sortedEvents = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        console.log("Fetched events:", sortedEvents); // Debugging line
        setEvents(sortedEvents);
      } else {
        toast.error("Error fetching events");
      }
    } catch (error) {
      toast.error("Error fetching events");
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) await fetchAllOrders();
    toast.success("Order status updated");
  };

  const eventStatusHandler = async (event, eventId) => {
    try {
      const response = await axios.post(`${url}/api/events/updateStatus`, {
        eventId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchEventBookings();
        toast.success("Event status updated");
      } else {
        toast.error("Error updating event status");
      }
    } catch (error) {
      toast.error("Error updating event status");
    }
  };

  const removeOrder = async (orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/remove`, {
        id: orderId,
      });
      await fetchAllOrders();
      if (response.data.success) {
        toast.success("Order removed successfully");
      } else {
        toast.error("Error removing order");
      }
    } catch (error) {
      toast.error("Error removing order");
    }
  };

  const removeEvent = async (eventId) => {
    try {
      const response = await axios.post(`${url}/api/events/remove`, {
        id: eventId,
      });
      await fetchEventBookings();
      if (response.data.success) {
        toast.success("Event removed successfully");
      } else {
        toast.error("Error removing event");
      }
    } catch (error) {
      toast.error("Error removing event");
    }
  };

  useEffect(() => {
    fetchAllOrders();
    fetchEventBookings();
  }, []);

  return (
    <div className="order-add">
      <h3>ORDER PAGE</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <div>
              <p className="order-item-name">
              {order.address.firstName +"" + order.address.lastName}:
              </p>
              <div className="order-item-address">
                <p>{order.address.street + ""}</p>
                <p>{order.address.city + "," + order.address.state + ""}:</p>
              </div>
              <span className="order-item-phone">
                {order.address.phone}📞☎️📱
              </span>
              <div className="order-item-food">
                <div className="order-item-food2">
                  {order.items.map((item, itemIndex) => (
                    <span key={itemIndex} className="food-item">
                      {item.name} X {item.quantity},
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <p className="item-item">Items: {order.items.length} </p>
            <p className="item-price">
              {order.amount.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="selector"
            >
              <option value="Food Order Processing">
                Food Order Processing⌛
              </option>
              <option value="Out For Delivery🚚">Out For Delivery🚚</option>
              <option value="Delivered✅">Delivered✅</option>
            </select>
            <button
              onClick={() => removeOrder(order._id)}
              className="delete-button"
            >
              Delete Order
            </button>
          </div>
        ))}

        {/* Display the list of events */}
        {events.map((event, index) => (
          <div key={index} className="event-item">
            <h3>Event Booking</h3>
            <p className="yourname">Name: {event.name}</p>
            <p>Venue: {event.eventVenue}</p>
            <p>Type: {event.eventType}</p>
            <p>Capacity: {event.capacity} People</p>
            <p className="date">Date of Event: {formatDate(event.eventDate)}</p>
            <p>Time: {event.eventTime}</p>
            <select
              onChange={(e) => eventStatusHandler(e, event._id)}
              value={event.status}
              className="eventselector"
            >
              <option value="Pending ⌛">Pending⌛</option>
              <option value="Paid ✅">Paid✅</option>
            </select>
            <p>Phone: {event.phoneNumber}</p>
            <button
              onClick={() => removeEvent(event._id)}
              className="delete-button"
            >
              Delete Event
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .event-item {
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .event-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .event-item h3 {
          color: #333;
          font-size: 20px;
          margin-bottom: 10px;
        }

        .event-item p {
          color: #555;
          font-size: 16px;
          font-weight: bold;
          margin: 5px 0;
        }

        .selector {
          padding: 5px;
          margin-top: 10px;
          margin-bottom: 10px;
          font-size: 16px;
        }

        .delete-button {
          background-color: #ff4d4d;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 5px 10px;
          cursor: pointer;
          margin-top: 10px;
        }

        .delete-button:hover {
          background-color: #ff1a1a;
        }
      `}</style>
    </div>
  );
};

export default Orders;
