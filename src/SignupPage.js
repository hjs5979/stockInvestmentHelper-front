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
  DropDown,
  Select,
  MenuItem,
} from '@mui/material';
import StockTable from './StockTable';
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import Menu from './Menu';

export default function SigninPage() {
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;

  // ----------------------- 아이디 중복 체크 제어 start --------------------------
  const [idCheck, setIdCheck] = useState(0);

  // 아이디 중복 체크 팝업 state
  const [open, setOpen] = useState(false);

  // 아이디 중복 체크 팝업 닫기
  const handleClose = () => {
    setOpen(false);
  };

  //아이디 중복체크 api
  const idcheck = async () => {
    try {
      const response = await axios.post(apiUrl + '/idcheck', {
        userId: formik.values.id,
      });

      setIdCheck(response.data);

      setOpen(true);
    } catch (e) {
      console.log(e);
    }
  };

  // ----------------------- 아이디 중복 체크 제어 end --------------------------

  // ------------------------ 회원가입 완료 팝업 제어 start -------------------------------
  // 회원가입 완료 팝업 state
  const [signOpen, setSignOpen] = useState(false);

  // 회원가입 완료 팝업 닫기 event
  const signHandleClose = () => {
    setSignOpen(false);
    navigate('/login');
  };

  // 회원가입 api
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
  // ------------------------ 회원가입 완료 팝업 제어 end -------------------------------

  // ---------------------------------- formik start -----------------------------------------------

  const formik = useFormik({
    initialValues: {
      id: '',
      password: '',
      name: '',
      emailLocal: '',
      emailDomain: '',
    },
    validationSchema: Yup.object({
      id: Yup.string()
        .required('아이디를 입력하세요.')
        .min(5, '아이디는 5자 이상으로 설정해야 합니다.'),
      password: Yup.string()
        .required('비밀번호를 입력하세요.')
        .matches(
          /^(?=.*[a-zA-Z])(?=.*[0-9]).{10,20}$/,
          '비밀번호는 숫자, 영문 조합 10자리 이상 20자리 이하로 설정해야 합니다.'
        ),
      name: Yup.string().required('이름을 입력하세요.'),
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
      const errors = {};
      if (idCheck === 1) {
        errors.id = '중복된 아이디는 사용할 수 없습니다.';
      }
      return errors;
    },

    onSubmit: (values) => {
      const signinValues = {
        ...values,
        email: values.emailLocal + '@' + values.emailDomain,
      };
      signin(signinValues);
    },
  });

  //formik 에러 제어
  const isFormikError = (name) => {
    return Boolean(formik.touched[name] && formik.errors[name]);
  };
  // ---------------------------------- formik end -----------------------------------------------

  // ---------------------------------- 이메일 제어 start -------------------------------
  const emails = [
    { id: '', name: '선택' },
    { id: '10', name: 'naver.com' },
    { id: '20', name: 'gmail.com' },
    { id: '30', name: 'kakao.com' },
    { id: '40', name: '직접 입력' },
  ];

  const [emailDomain, setEmailDomain] = React.useState('');

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
        {isFormikError('id') ? (
          <span style={{ color: '#ff0000' }}>{formik.errors.id}</span>
        ) : (
          ''
        )}
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
          type='password'
        />
        {isFormikError('password') ? (
          <span style={{ color: '#ff0000' }}>{formik.errors.password}</span>
        ) : (
          ''
        )}

        <p>이름</p>
        <TextField
          style={{ width: '300px' }}
          id='name'
          name='name'
          variant='outlined'
          onChange={formik.handleChange}
        />
        {isFormikError('name') ? (
          <span style={{ color: '#ff0000' }}>{formik.errors.name}</span>
        ) : (
          ''
        )}

        <p>사용할 이메일</p>
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
            {idCheck === 0 ? (
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
