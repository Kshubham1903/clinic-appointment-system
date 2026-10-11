import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="navbar">
      <h2>HealthSync Clinic Portal</h2>
      <nav className="nav-links">
        <NavLink to="/patient">Patient</NavLink>
        <NavLink to="/doctor">Doctor</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
