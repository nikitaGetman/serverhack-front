import React, { FC } from 'react';
import './header.scss';

export const Header: FC = () => {
  return (
    <div className="header">
      <div className="header__logo"></div>
      <div className="header__label">Поиск поставщиков</div>

      {/* <div className="header__nav"></div> */}
    </div>
  );
};
