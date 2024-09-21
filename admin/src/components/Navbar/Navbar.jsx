 // eslint-disable-next-line no-unused-vars
import React from 'react';
import './Navbar.css';
import { assets } from "../../assets/assets";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='navbar'>
      <Link to="http://localhost:5173"><img className="logo" src={assets.bag_icon} alt="Logo" /></Link>
      <img className="profile" src={assets.profile_icon} alt="Profile Icon" />
    </div>
  );
};

export default Navbar;
