import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../header/header';

import './base-layout.scss';

export const BaseLayout: FC = () => {
  return (
    <div className="base-layout">
      <Header />
      <div className="base-layout__main">
        <Outlet />
      </div>
    </div>
  );
};
