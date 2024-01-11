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
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import StockTable from './StockTable';
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import {
  getToken,
  setAccessToken,
  setRefreshToken,
  setToken,
  setUserInfo,
} from './cookie';
import Menu from './Menu';

export default function LoginPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const userInfo = async (id) => {
    try {
      const response = await axios
        .post(apiUrl + 'user/selectUser', { userId: id })
        .then((resp) => {
          setUserInfo(resp.data);
        });
    } catch (e) {
      console.log('selectUser', e);
    }
  };

  const login = async (values) => {
    try {
      // 요청이 시작 할 때에는 error 와 users 를 초기화하고
      setError(null);

      // loading 상태를 true 로 바꿉니다.
      setLoading(true);

      const response = await axios
        .post(
          apiUrl + 'user/login',
          { userId: values.id, userPassword: values.password },
          { withCredentials: true }
        )
        .then((resp) => {
          setAccessToken(resp.data.accessToken);
          setRefreshToken(resp.data.refreshToken);

          // getToken();
        })
        .then(userInfo(values.id))
        .then(() => (window.location.href = `/`));
      // window.location.href = `/`;

      // console.log(response);
    } catch (e) {
      console.log(e);
      setError(e);
      setOpen(true);
    }
    setLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      id: '',
      password: '',
    },
    validationSchema: Yup.object({
      id: Yup.string().required('아이디를 입력하세요.'),
      password: Yup.string().required('비밀번호를 입력하세요.'),
    }),
    validate: (values) => {},
    onSubmit: (values) => {
      // console.log(values)
      login(values);

      //
    },
  });
  // console.log(formik.values)
  return (
    <Menu>
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <p style={{ fontWeight: 'bold', fontSize: '30px' }}>로그인</p>
        <div>
          <TextField
            style={{ width: '300px' }}
            id='id'
            name='id'
            label='ID'
            variant='outlined'
            onChange={formik.handleChange}
          />
          {/* {formik.errors.id && <div>{formik.errors.id}</div>} */}
        </div>
        <div style={{ marginTop: '10px' }}>
          <TextField
            style={{ width: '300px' }}
            type='password'
            id='password'
            name='password'
            label='PASSWORD'
            variant='outlined'
            onChange={formik.handleChange}
          />
          {/* {formik.errors.password && <div>{formik.errors.password}</div>} */}
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Button
            type='submit'
            style={{ marginTop: '10px', width: '100px' }}
            variant='contained'
          >
            LOGIN
          </Button>
        </form>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          {/* <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle> */}
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              아이디 또는 비밀번호가 일치하지 않습니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>확인</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Menu>
  );
}
