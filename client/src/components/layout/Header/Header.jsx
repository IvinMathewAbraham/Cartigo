import React from 'react';
import UtilityBar from './UtilityBar.jsx';
import MainNavbar from './MainNavbar.jsx';

import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <UtilityBar />
      <MainNavbar />
      
    </header>
  );
}