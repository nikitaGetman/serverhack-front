import React, { FC } from 'react';
import { Routes, Route } from 'react-router-dom';

import { BaseLayout } from './components/base-layout/base-layout';
import { DashboardPage } from './pages/Dashboard/Dashboard';

export const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<DashboardPage />} />
      </Route>
    </Routes>
  );
};
