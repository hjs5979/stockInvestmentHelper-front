import React, { useState, useEffect } from 'react';
// import * as React from "react";
import { TagCloud } from 'react-tagcloud';
import './App.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import StockTable from './StockTable';
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import Menu from './Menu';

export default function SigninPage() {
  const navigate = useNavigate();

  const [idCheck, setIdCheck] = useState(0);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [signOpen, setSignOpen] = useState(false);

  const signHandleClickOpen = () => {
    setSignOpen(true);
  };

  const signHandleClose = () => {
    setSignOpen(false);
    navigate('/login');
  };

  const apiUrl = process.env.REACT_APP_API_URL;

  const idcheck = async () => {
    try {
      const response = await axios.post(apiUrl + 'user/idcheck', {
        userId: formik.values.id,
      });

      setIdCheck(response.data);

      setOpen(true);
    } catch (e) {
      console.log(e);
    }
  };

  const signin = async (values) => {
    try {
      const response = await axios.post(apiUrl + 'user/signin', {
        userId: values.id,
        userPassword: values.password,
        userEmail: values.email,
        userName: values.name,
      });

      setSignOpen(true);
    } catch (e) {
      console.log(e);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: '',
      password: '',
      name: '',
      email: '',
    },
    validationSchema: Yup.object({
      id: Yup.string().required('아이디를 입력하세요.'),
      password: Yup.string().required('비밀번호를 입력하세요.'),
      name: Yup.string().required('이름을 입력하세요.'),
      email: Yup.string().required('이메일을 입력하세요.'),
    }),
    validate: (values) => {
      const errors = {};
      if (idCheck == 1) {
        errors.id = '중복된 아이디는 사용할 수 없습니다.';
      }
      return errors;
    },
    onSubmit: (values) => {
      signin(values);
    },
  });

  return (
    <Menu>
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <p>사용할 아이디</p>
        <TextField
          style={{ width: '300px' }}
          id='id'
          name='id'
          variant='outlined'
          onChange={formik.handleChange}
        />
        <Button
          style={{ marginTop: '10px', width: '150px' }}
          variant='outlined'
          onClick={() => idcheck()}
        >
          아이디 중복 확인
        </Button>

        <p>사용할 비밀번호</p>
        <TextField
          style={{ width: '300px' }}
          id='passsword'
          name='password'
          variant='outlined'
          onChange={formik.handleChange}
        />

        <p>이름</p>
        <TextField
          style={{ width: '300px' }}
          id='name'
          name='name'
          variant='outlined'
          onChange={formik.handleChange}
        />

        <p>사용할 이메일</p>
        <TextField
          style={{ width: '300px' }}
          id='email'
          name='email'
          variant='outlined'
          onChange={formik.handleChange}
        />

        <form onSubmit={formik.handleSubmit}>
          <Button
            type='submit'
            style={{ marginTop: '20px', width: '100px' }}
            variant='contained'
          >
            회원가입
          </Button>
        </form>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogContent>
            {idCheck == 0 ? (
              <DialogContentText id='alert-dialog-description'>
                사용가능한 아이디입니다.
              </DialogContentText>
            ) : (
              <DialogContentText id='alert-dialog-description'>
                중복된 아이디입니다.
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>확인</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={signOpen}
          onClose={signHandleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              회원가입이 완료되었습니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={signHandleClose}>확인</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Menu>
  );
}
