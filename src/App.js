import React from "react";
// import * as React from "react";
import './App.css';
import {
  Routes,
  Route
} from "react-router-dom";
import NewsListPage from "./newsListPage";
import MainPage from "./MainPage";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";


function App(){
  return (
    <ThemeProvider theme={theme}>

      <Routes>
        <Route path='/:word' exact element={<NewsListPage/>} />
        <Route path='/' exact element={<MainPage />} />
      </Routes>
    </ThemeProvider>
    );
 };

export default App;