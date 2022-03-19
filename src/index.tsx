import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';

import './assets/styles/index.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider locale={ruRU}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
