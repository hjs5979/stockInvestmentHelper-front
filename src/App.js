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
import SigninPage from './SigninPage';
import BoardPage from './BoardPage';
import StockTable from './StockTable';
import BoardDetailPage from './BoardDetailPage';
import { Card } from '@mui/material';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path='/' exact element={<MainPage />} />
        <Route path='/:word' exact element={<NewsListPage />} />
        <Route path='/login' exact element={<LoginPage />} />
        <Route path='/signin' exact element={<SigninPage />} />
        <Route path='/board' exact element={<BoardPage />} />
        <Route path='/board/:boardId' exact element={<BoardDetailPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
