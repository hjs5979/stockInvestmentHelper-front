import React, { useState, useEffect } from 'react';
// import * as React from "react";
import './App.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import Menu from './Menu';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function BoardAddPage() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      boardTitle: '',
      boardContent: '',
    },
    validationSchema: Yup.object({
      boardTitle: Yup.string().required('제목을 입력하세요'),
      boardContent: Yup.string().required('내용을 입력하세요.'),
    }),
    validate: (values) => {
      //   const errors = {};
      //   if (idCheck === 1) {
      //     errors.id = '중복된 아이디는 사용할 수 없습니다.';
      //   }
      //   return errors;
    },
    onSubmit: (values) => {
      //   signup(values);
    },
  });

  //   if (error) return <div>에러가 발생했습니다</div>;
  //   if (!boardDetail) return null;

  console.log();

  // const rowClick = (event, item) => {
  //   navigate(`/board/${item.boardId}`);
  // };
  const goList = () => {
    navigate(`/board`);
  };

  const modules = {
    toolbar: {
      container: [
        ['image'],
        [{ header: [1, 2, 3, 4, 5, false] }],
        ['bold', 'underline'],
      ],
    },
  };

  return (
    <Menu stockYn={true}>
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <Typography sx={{ marginRight: '10px' }}>제목 : </Typography>
          <TextField sx={{ width: '950px' }} size={'small'}></TextField>
        </div>
        <ReactQuill
          style={{ width: '1000px', height: '600px' }}
          modules={modules}
        ></ReactQuill>
      </div>
      <div style={{ margin: 'auto', marginLeft: '10px' }}>
        <Button variant='outlined'> 등록 </Button>
      </div>
    </Menu>
  );
}
