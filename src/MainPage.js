import React, { useState, useEffect } from 'react';
// import * as React from "react";
import { TagCloud } from 'react-tagcloud';
import './App.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Box, Card } from '@mui/material';
import Menu from './Menu';

export default function MainPage() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [word, setWord] = useState(null);
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // 요청이 시작 할 때에는 error 와 users 를 초기화하고
        setError(null);
        setWord(null);
        setStock(null);
        // loading 상태를 true 로 바꿉니다.
        setLoading(true);
        const response = await axios.get(apiUrl + 'main/word');

        const response2 = await axios.get(apiUrl + 'main/stock');
        setWord(response.data); // 데이터는 response.data 안에 들어있습니다.
        setStock(response2.data);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (error) return <div>에러가 발생했습니다</div>;
  if (!word) return null;
  if (!stock) return null;

  const sortedItems = word
    ?.slice(0, 60)
    .sort((a, b) => b.wordCount - a.wordCount);

  let result = sortedItems?.map(
    ({ wordId: key, wordContent: value, wordCount: count }) => ({
      key,
      value,
      count,
    })
  );

  // console.log(result)

  const customRender = (tag, size, color) => {
    return (
      <Link
        to={`/word?wordId=${tag.key}`}
        state={{
          word: tag.value,
          id: tag.key,
        }}
      >
        <span
          key={tag.key}
          style={{
            color,
            fontSize: `${size / 20}em`,
            display: 'inline-block',
            margin: '3px',
          }}
          className={`tag=${size}`}
        >
          {tag.value}
        </span>
      </Link>
    );
  };

  return (
    <Menu stockYn={true}>
      <Box
        sx={{
          display: 'flex',
          margin: '2rem',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'center',
            width: '70%',
            flexDirection: 'column',
          }}
        >
          <Card
            sx={{
              display: 'flex',
              alignSelf: 'center',
              margin: '2px',
              width: '80%',
              marginBottom: '100px',
            }}
          >
            {result && (
              <TagCloud
                minSize={40}
                maxSize={100}
                tags={result}
                style={{ textAlign: 'center', fontFamily: 'TheJamsil4Medium' }}
                randomSeed={42}
                renderer={customRender}
              />
            )}
          </Card>
        </Box>
      </Box>
    </Menu>
  );
}
