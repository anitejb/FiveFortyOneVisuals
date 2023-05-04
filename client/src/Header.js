import React from 'react';
import { Link } from 'react-router-dom';
// import logo from './logo.png';
// import './Header.css';

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <h2>FiveFortyOne Visuals</h2>
            </Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/congress">Congress</Link>
          </li>
          <li>
            <Link to="/legcount">Leg Count</Link>
          </li>
          <li>
            <Link to="/bills_actions">Bills Actions</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
