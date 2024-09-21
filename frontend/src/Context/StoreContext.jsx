import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [eventData, setEventData] = useState([]); // State to hold event data
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const url = "https://naijakitchen.onrender.com";

  const addToCart = async (itemId) => {
    const updatedCartItems = { ...cartItems };
    
    // Update local state
    if (!updatedCartItems[itemId]) {
      updatedCartItems[itemId] = 1;
    } else {
      updatedCartItems[itemId] += 1;
    }

    setCartItems(updatedCartItems);

    // Update backend if token exists
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    const updatedCartItems = { ...cartItems };
    
    if (updatedCartItems[itemId] > 1) {
      updatedCartItems[itemId] -= 1;
    } else {
      delete updatedCartItems[itemId];
    }

    setCartItems(updatedCartItems);

    // Update backend if token exists
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemQuantity = cartItems[itemId];
      if (itemQuantity > 0) {
        const itemInfo = food_list.find((product) => product._id === itemId);
        if (itemInfo) {
          totalAmount += itemInfo.price * itemQuantity;
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const loadCartData = async (userToken) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token: userToken } }
      );
      setCartItems(response.data.cartData);
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  const fetchEventData = async () => {
    try {
      const response = await axios.get(url + "/api/events/list");
      setEventData(response.data.data);
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      await fetchEventData();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    eventData,
    setEventData,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
