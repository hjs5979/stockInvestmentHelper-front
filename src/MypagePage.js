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
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import StockTable from './StockTable';
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import Menu from './Menu';
import { getUserInfo } from './cookie';

export default function MypagePage() {
  const apiUrl = process.env.REACT_APP_API_URL;

  // ---------------------- 비밀번호 오류 팝업 start ----------------------------------
  const [pwOpen, setPwOpen] = useState(false);
  const handlePwClose = () => {
    setPwOpen(false);
  };
  // ---------------------- 비밀번호 오류 팝업 end ----------------------------------

  // ---------------------- 회원정보 수정 완료 팝업 start ----------------------------------
  const [mdfcOpen, setMdfcOpen] = useState(false);
  const handleMdfcClose = () => {
    setMdfcOpen(false);
    setOpen(false);
    setPwMdfcOpen(false);
  };
  // ---------------------- 회원정보 수정 완료 팝업 end ----------------------------------

  // ---------------------- 회원정보 수정 팝업 start -----------------------------

  const [open, setOpen] = useState(false);

  const handleOk = () => {
    const obj = {
      ...formik.values,
      email: formik.values.emailLocal + '@' + formik.values.emailDomain,
    };

    mdfcUserInfo(obj);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // ------------------------- 회원정보 수정 start --------------------------------

  const mdfcUserInfo = async (values) => {
    try {
      const response = await axios
        .post(
          apiUrl + 'user/mdfc',
          {
            userId: values.id,
            userEmail: values.email,
            userPassword: values.password,
          },
          { withCredentials: true }
        )
        .then((resp) => {
          console.log(resp);
          setMdfcOpen(true);
        });
    } catch (e) {
      console.log(e);
      setPwOpen(true);
    }
  };

  // ------------------------- 회원정보 수정 end   --------------------------------

  // -------------------------- formik 제어 start ---------------------------------
  const formik = useFormik({
    initialValues: {
      id: getUserInfo()?.userId,
      emailLocal: getUserInfo()?.userEmail.split('@')[0],
      emailDomain: getUserInfo()?.userEmail.split('@')[1],
    },
    validationSchema: Yup.object({
      id: Yup.string().required('아이디를 입력하세요.'),
      // password: Yup.string()
      //   .required('비밀번호를 입력하세요.')
      //   .matches(
      //     /^(?=.*[a-zA-Z])(?=.*[0-9]).{10,20}$/,
      //     '비밀번호는 숫자, 영문 조합 10자리 이상 20자리 이하로 설정해야 합니다.'
      //   ),
      emailLocal: Yup.string()
        .required('이메일을 입력하세요.')
        .matches(
          /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*$/,
          '올바른 이메일이 아닙니다.'
        ),
      emailDomain: Yup.string()
        .required('이메일 도메인을 입력하세요.')
        .matches(
          /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/,
          '올바른 이메일도메인이 아닙니다.'
        ),
    }),
    validate: (values) => {
      // const errors = {};
      // if (idCheck === 1) {
      //   errors.id = '중복된 아이디는 사용할 수 없습니다.';
      // }
      // return errors;
    },
    onSubmit: (values) => {
      setOpen(true);
    },
    // mdfcUserInfo(values);
  });

  //formik 에러 제어
  const isFormikError = (name) => {
    return Boolean(formik.touched[name] && formik.errors[name]);
  };
  // -------------------------- formik 제어 end ---------------------------------

  // ---------------------------------- 이메일 제어 start -------------------------------
  const emails = [
    { id: '', name: '선택' },
    { id: '10', name: 'naver.com' },
    { id: '20', name: 'gmail.com' },
    { id: '30', name: 'kakao.com' },
    { id: '40', name: '직접 입력' },
  ];

  const emailsId = emails.filter((item) => {
    return item.name == getUserInfo()?.userEmail.split('@')[1];
  })[0].id;

  const [emailDomain, setEmailDomain] = React.useState(emailsId);

  React.useEffect(() => {
    let emailDomainValue = '';
    const emailDomainObj = emails.filter((item) => {
      return item.id == emailDomain;
    })[0];

    if (emailDomainObj?.id === '40') {
      emailDomainValue = '';
    } else {
      emailDomainValue = emailDomainObj.name;
    }
    formik.setFieldValue('emailDomain', emailDomainValue);
  }, [emailDomain]);

  // ---------------------------------- 이메일 제어 end -------------------------------

  // --------------------------- 비밀번호 수정 start --------------------------------------

  const [pwMdfcOpen, setPwMdfcOpen] = useState(false);

  const handlePwMdfcOk = () => {};

  const handlePwMdfcClose = () => {
    setPwMdfcOpen(false);
  };

  const mdfcPassword = async (values) => {
    try {
      const response = await axios
        .post(
          apiUrl + 'user/mdfcPassword',
          {
            userId: values.id,
            userPassword: values.exPassword,
            newPassword: values.newPassword,
          },
          { withCredentials: true }
        )
        .then((resp) => {
          console.log(resp);
          setMdfcOpen(true);
        });
    } catch (e) {
      console.log(e);
      setPwOpen(true);
    }
  };

  const pwFormik = useFormik({
    initialValues: {
      id: '',
      exPassword: '',
      newPassword: '',
    },
    validationSchema: Yup.object({
      exPassword: Yup.string().required('비밀번호를 입력하세요.'),
      newPassword: Yup.string()
        .required('새로운 비밀번호를 입력하세요.')
        .matches(
          /^(?=.*[a-zA-Z])(?=.*[0-9]).{10,20}$/,
          '비밀번호는 숫자, 영문 조합 10자리 이상 20자리 이하로 설정해야 합니다.'
        ),
    }),
    validate: (values) => {},
    onSubmit: (values) => {
      console.log('test');
      // mdfcPassword(values);
    },
  });

  //formik 에러 제어
  const isPwFormikError = (name) => {
    return Boolean(formik.touched[name] && formik.errors[name]);
  };
  // --------------------------- 비밀번호 수정 end ----------------------------------------

  return (
    <Menu>
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <p style={{ fontWeight: 'bold' }}>아이디</p>
        <Typography sx={{ marginRight: '10px' }} sxvariant='h6' component='h6'>
          {getUserInfo()?.userId}
        </Typography>

        {/* <form onSubmit={pwFormik.handleSubmit}> */}
        <Button
          style={{ marginTop: '20px', width: '150px' }}
          variant='outlined'
          onClick={() => setPwMdfcOpen(true)}
        >
          비밀번호 수정
        </Button>

        <p style={{ fontWeight: 'bold' }}>이름</p>
        <Typography sx={{ marginRight: '10px' }} sxvariant='h6' component='h6'>
          {getUserInfo()?.userName}
        </Typography>

        <p>이메일</p>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              style={{ width: '200px', marginRight: '10px' }}
              variant='outlined'
              onChange={formik.handleChange}
              value={formik.values.emailLocal}
              id='emailLocal'
              name='emailLocal'
            />
            {isFormikError('emailLocal') ? (
              <span style={{ color: '#ff0000' }}>
                {formik.errors.emailLocal}
              </span>
            ) : (
              ''
            )}
          </div>
          <p> @ </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              style={{ width: '200px', marginLeft: '10px' }}
              id='emailDomain'
              name='emailDomain'
              variant='outlined'
              onChange={formik.handleChange}
              value={formik.values.emailDomain}
              disabled={emailDomain === '40' ? false : true}
            />
            {isFormikError('emailDomain') ? (
              <span style={{ color: '#ff0000' }}>
                {formik.errors.emailDomain}
              </span>
            ) : (
              ''
            )}
          </div>
          <Select
            sx={{ width: '200px', marginLeft: '10px' }}
            onChange={(e) => setEmailDomain(e.target.value)}
            value={emailDomain}
          >
            {emails.map((item) => (
              <MenuItem value={item.id}>{item.name}</MenuItem>
            ))}
          </Select>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <Button
            type='submit'
            style={{ marginTop: '20px', width: '100px' }}
            variant='contained'
          >
            수정
          </Button>
        </form>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{'비밀번호 확인'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              비밀번호를 입력하세요.
            </DialogContentText>
            <TextField
              style={{ width: '300px', marginTop: '10px' }}
              id='passsword'
              name='password'
              variant='outlined'
              onChange={formik.handleChange}
              type='password'
            />
          </DialogContent>
          <DialogActions>
            <form onSubmit={formik.handleSubmit}>
              <Button onClick={handleOk}>확인</Button>
            </form>
            <Button onClick={handleClose}>취소</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={pwOpen}
          onClose={handlePwClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              비밀번호를 확인하세요.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePwClose}>확인</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={mdfcOpen}
          onClose={handleMdfcClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              회원정보가 수정되었습니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleMdfcClose}>확인</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={pwMdfcOpen}
          onClose={handlePwMdfcClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{'비밀번호 수정'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              현재 비밀번호를 입력하세요.
            </DialogContentText>
            <TextField
              style={{
                width: '300px',
                marginTop: '10px',
                marginBottom: '10px',
              }}
              id='exPasssword'
              name='exPassword'
              variant='outlined'
              onChange={pwFormik.handleChange}
              type='password'
            />
            {isPwFormikError('exPassword') ? (
              <span style={{ color: '#ff0000' }}>
                {formik.errors.exPassword}
              </span>
            ) : (
              ''
            )}
            <DialogContentText id='alert-dialog-description'>
              새로운 비밀번호를 입력하세요.
            </DialogContentText>
            <TextField
              style={{ width: '300px', marginTop: '10px' }}
              id='newPasssword'
              name='newPassword'
              variant='outlined'
              onChange={pwFormik.handleChange}
              type='password'
            />
            {isPwFormikError('newPassword') ? (
              <span style={{ color: '#ff0000' }}>
                {formik.errors.newPassword}
              </span>
            ) : (
              ''
            )}
          </DialogContent>
          <DialogActions>
            <form onSubmit={pwFormik.handleSubmit}>
              <Button type='submit'>확인</Button>
            </form>
            <Button onClick={handlePwMdfcClose}>취소</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Menu>
  );
}
