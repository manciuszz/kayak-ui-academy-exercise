import React from 'react';
import { hot } from 'react-hot-loader/root';
import styles from './app.css';
import Autocomplete from '../autocomplete';

const App = () => (
  <div className={styles.container}>
    <Autocomplete />
  </div>
);

export default hot(App);
