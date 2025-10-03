// components/Button/Button.js
import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, secondary, ...props }) => {
  const buttonClass = secondary ? styles.secondary : styles.primary;
  return (
    <button className={`${styles.button} ${buttonClass}`} {...props}>
      {children}
    </button>
  );
};

export default Button;