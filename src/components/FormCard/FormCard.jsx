import React from 'react';
import styles from './FormCard.module.css';

const FormCard = ({ children, onSubmit }) => {
  return (
    <section className={styles.formCard}>
      <form onSubmit={onSubmit} className={styles.formGrid}>
        {children}
      </form>
    </section>
  );
};

export default FormCard;