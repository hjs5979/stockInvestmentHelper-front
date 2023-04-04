import React, { useState, useEffect} from "react";
// import * as React from "react";
import { TagCloud } from 'react-tagcloud';
import './App.css';
import axios from "axios";
import {
  Link
} from "react-router-dom";
import { Box, Card, Grid, Typography } from "@mui/material";
import StockTable from "./StockTable";

export default function MainPage(){
  
  const [words, setWords] = useState(null);
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // 요청이 시작 할 때에는 error 와 users 를 초기화하고
        setError(null);
        setWords(null);
        setStock(null);
        // loading 상태를 true 로 바꿉니다.
        setLoading(true);
        const response = await axios.get(
          'http://sa.thxx.xyz:8080/main/words'
        );

        const response2 = await axios.get(
          'http://sa.thxx.xyz:8080/main/stock'
        );
        setWords(response.data); // 데이터는 response.data 안에 들어있습니다.
        setStock(response2.data)
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    
    fetchUsers();
  }, []);

  if (error) return <div>에러가 발생했습니다</div>;
  if (!words) return null;
  if (!stock) return null;

  const wordData = words.data;
  const stockData = stock.data;

  let result = wordData.map(({ id: key,word:value, ...rest }) => ({ key,value, ...rest }));

  const customRender = (tag,size,color)=>{
    return (
      <Link to={tag.value} state={{
        word:tag.value,
        id:tag.key
      }}>
        <span key={tag.value} style={{
          color, 
          fontSize:`${size/20}em`,
          display:'inline-block',
          margin:'3px'}} className={`tag=${size}`}>
          {tag.value}
        </span>
      </Link>
    )
  }

  return (
    <Box sx={{display:"flex",margin:'2rem',justifyContent:'center'}}>
      
      <Box sx={{display:"flex", flexGrow:1, justifyContent:'center',width:'70%',flexDirection:'column'}}>
        <Card sx={{position:'absolute',top:"2rem", alignSelf:"flex-start"}}>
          <img src={process.env.PUBLIC_URL + "/icons8-cat-64.png"} alt="jotnyan" />
          <span>TEAM CAT</span>
        </Card>
        <Card sx={{display:'flex',alignSelf:'center',alignItems:'center',margin:'2px'}}>
          
          <TagCloud
          minSize={40}
          maxSize={100}
          tags={result}
          style={{textAlign:'center'}}
          randomSeed={42}
          renderer={customRender}
          />
        </Card>
      </Box>
      <Card sx={{flexGrow:1,margin:'2px',height:'90vh',overflow:'auto'}}>
        <StockTable data={stockData} />
      </Card>
    </Box>
      
  );
 };
