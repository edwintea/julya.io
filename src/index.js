import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import "./i18n";
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import reduxStore from './utils/ReduxConfig'
import common from './utils/common';

const store = reduxStore();

common.productionMode();
ReactDOM.render(
  <BrowserRouter basename="/">
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
  , document.getElementById('root'));

serviceWorker.unregister();