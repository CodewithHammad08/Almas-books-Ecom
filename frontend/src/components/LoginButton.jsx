import React from 'react';
import { Link } from 'react-router-dom';

export const LoginButton = () => {
  return (
    <Link to="/login" style={{ textDecoration: 'none' }}>
      <button style={{
        padding: '8px 20px',
        backgroundColor: 'transparent',
        color: 'inherit',
        border: '1px solid currentColor',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500
      }}>
        Login
      </button>
    </Link>
  );
};