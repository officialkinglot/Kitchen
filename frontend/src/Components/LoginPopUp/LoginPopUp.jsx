// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from "react";
import "./LoginPopUp.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";

// eslint-disable-next-line react/prop-types
const LoginPopUp = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const { name, value} = event.target;
    setData((prevData) => ({ ...prevData, [name]: value}));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl =
      currentState === "Login"
        ? `${url}/api/user/login`
        : `${url}/api/user/register`;
    const response = await axios.post(newUrl, data);

    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setShowLogin(false);
      setData({ name: "", email: "", password: "" }); // Reset form fields
    } else {
      alert(response.data.message);
    }
  };

  const onForgotPassword = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${url}/api/user/forgot-password`, {
      email: data.email,
    });
    if (response.data.success) {
      alert("Password reset link sent to your email.");
      setCurrentState("Login");
    } else {
      alert(response.data.message);
    }
  };

  return (
    <div className="login-popup">
      <form
        onSubmit={
          currentState === "Forgot Password" ? onForgotPassword : onLogin
        }
        className="login-popup-container"
      >
        <div className="login-pop-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="your email"
            required
          />
          {currentState !== "Forgot Password" && (
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder="your password"
              required
            />
          )}
        </div>
        <button type="submit">
          {currentState === "Sign Up"
            ? "Create account"
            : currentState === "Forgot Password"
            ? "Reset Password"
            : "Login"}
        </button>
        {currentState === "Login" && (
          <p>
            <span onClick={() => setCurrentState("Forgot Password")}>
              Forgot Password?
            </span>
          </p>
        )}
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p> By continuing, I agree to the terms of use & policy</p>
        </div>
        {currentState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Click Here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopUp;
