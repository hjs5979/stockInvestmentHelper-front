import React, { useState, useEffect } from 'react';
// import * as React from "react";
import './App.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import Menu from './Menu';

export default function BoardDetailPage() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();

  const param = useParams();

  const [boardDetail, setBoardDetail] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        // 요청이 시작 할 때에는 error 와 users 를 초기화하고
        setError(null);
        setBoardDetail(null);
        // loading 상태를 true 로 바꿉니다.
        setLoading(true);
        const response = await axios.post(apiUrl + `board/detail`, {
          boardId: param.boardId,
        });

        setBoardDetail(response.data); // 데이터는 response.data 안에 들어있습니다.
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };

    fetchBoardDetail();
  }, []);

  if (error) return <div>에러가 발생했습니다</div>;
  if (!boardDetail) return null;

  // const rowClick = (event, item) => {
  //   navigate(`/board/${item.boardId}`);
  // };
  const goList = () => {
    navigate(`/board`);
  };
  return (
    <Menu stockYn={true}>
      <div>
        <Typography variant='h2' component='h2'>
          {boardDetail.boardTitle}
        </Typography>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{ marginRight: '10px' }}
            sxvariant='h6'
            component='h6'
          >
            작성자ID
          </Typography>

          <Typography
            sx={{ marginRight: '10px' }}
            variant='subtitle1'
            component='subtitle1'
          >
            {boardDetail.boardWrtId}
          </Typography>

          <Typography
            sx={{ marginRight: '10px' }}
            sxvariant='h6'
            component='h6'
          >
            등록일
          </Typography>

          <Typography variant='subtitle1' component='subtitle1'>
            {boardDetail.boardYmd}
          </Typography>
        </div>
        <p> {boardDetail.boardContent} </p>
        <Button variant='contained' onClick={goList}>
          {' '}
          목록{' '}
        </Button>
      </div>
    </Menu>
  );
}
