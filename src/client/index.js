import React from 'react';
import { render, hydrate } from 'react-dom';

import App from '../components/app';

const renderMethod = module.hot ? render : hydrate; // Fixes that annoying "Warning: Expected server HTML to contain a matching <div> in <div>."
renderMethod(<App />, document.getElementById('root'));
