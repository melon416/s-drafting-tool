import React from 'react';
import logoDark from '../assets/images/logo.png';
import logoLight from '../assets/images/logo_light.png';
import './Logo.css';

export default function Logo({ lightMode }) {
  return (
    <div className="logo" style={{ backgroundColor: lightMode ? 'white' : undefined }}>
      <img src={lightMode ? logoLight : logoDark} alt="#" />
    </div>
  );
}
