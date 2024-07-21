import React from 'react';
// import * as React from "react";
import './App.css';
import { Routes, Route } from 'react-router-dom';
import NewsListPage from './newsListPage';
import MainPage from './MainPage';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import Menu from './Menu';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import BoardPage from './BoardPage';
import StockTable from './StockTable';
import BoardDetailPage from './BoardDetailPage';
import BoardAddPage from './BoardAddPage';
import MypagePage from './MypagePage';

import { Card } from '@mui/material';
import TestPage from './TestPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path='/' exact element={<MainPage />} />
        <Route path='/:word' exact element={<NewsListPage />} />
        <Route path='/login' exact element={<LoginPage />} />
        <Route path='/signup' exact element={<SignupPage />} />
        <Route path='/board' exact element={<BoardPage />} />
        <Route path='/board/:boardId' exact element={<BoardDetailPage />} />
        <Route path='/board/add' exact element={<BoardAddPage />} />
        <Route path='/mypage' exact element={<MypagePage />} />
        <Route path='/test' exact element={<TestPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
