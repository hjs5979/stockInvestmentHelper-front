import React, { useState, useEffect } from 'react';
// import * as React from "react";
import './App.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  TextField,
  Typography,
} from '@mui/material';
import Menu from './Menu';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAccessToken, getRefreshToken, getUserInfo } from './cookie';
import { formDataInstance } from './BaseApi';
import { getError } from './Error';

export default function BoardAddPage() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();

  const userId = getUserInfo()?.userId;
  const [accessToken] = React.useState(getAccessToken());
  const [refreshToken] = React.useState(getRefreshToken());

  const [error, setError] = React.useState({ code: '', content: '' });

  // ======================== 로그인 확인 팝업 start =============================
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    navigate('/login');
  };
  // ======================== 로그인 확인 팝업 end =============================

  // ======================== 등록 완료 팝업 start =============================
  const [openReg, setOpenReg] = useState(false);

  const handleCloseReg = () => {
    setOpen(false);
    navigate('/board');
  };
  // ======================== 등록완료 팝업 end =============================

  // const [fileCnt, setFileCnt] = React.useState(0);
  // const [fileTtl, setFileTtl] = React.useState(0);

  // ========================= 게시판 등록 API start ===============================
  const regBoard = async (values) => {
    try {
      const response = await formDataInstance(accessToken, refreshToken, userId)
        .post(apiUrl + `board/reg`, values)
        .then(() => setOpenReg(true));
    } catch (e) {
      const error = getError(e);

      if (error.code == 'USER001' || error.code == 'USER002') {
        setOpen(true);
      } else {
        setError({ code: error.code, content: error.content });
        setOpenError(true);
      }
    }
  };
  // ========================= 게시판 등록 API end =================================

  const formik = useFormik({
    initialValues: {
      boardTitle: '',
      boardContent: '',
      atchCnt: 0,
      atchTtlSize: 0,
      fileList: [],
    },
    validationSchema: Yup.object({
      boardTitle: Yup.string().required('제목을 입력하세요'),
      boardContent: Yup.string().required('내용을 입력하세요.'),
      atchCnt: Yup.number().max(3, '최대 3개의 파일을 첨부할 수 있습니다.'),
      atchTtlSize: Yup.number().max(
        31457280,
        '최대 30MB의 파일을 첨부할 수 있습니다.'
      ),
    }),
    validate: (values) => {
      //   const errors = {};
      //   if (idCheck === 1) {
      //     errors.id = '중복된 아이디는 사용할 수 없습니다.';
      //   }
      //   return errors;
    },
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('boardTitle', values.boardTitle);
      formData.append('boardContent', values.boardContent);

      formData.append('atchCnt', values.atchCnt);
      formData.append('atchTtlSize', values.atchTtlSize);

      values.fileList.forEach((file) => {
        formData.append('fileList', file);
      });

      // formData.append('files', values.files);

      console.log('formData', formData);

      regBoard(formData);
    },
  });

  //   if (error) return <div>에러가 발생했습니다</div>;
  //   if (!boardDetail) return null;

  // const rowClick = (event, item) => {
  //   navigate(`/board/${item.boardId}`);
  // };
  const goList = () => {
    if (
      JSON.stringify(formik.initialValues) === JSON.stringify(formik.values)
    ) {
      navigate(`/board`);
    } else {
      setOpenCheck(true);
    }

    // navigate(`/board`);
  };

  // ========================= ReactQuill 설정 start =============================

  const modules = {
    toolbar: {
      container: [
        ['image'],
        [{ header: [1, 2, 3, 4, 5, false] }],
        ['bold', 'underline'],
      ],
    },
  };

  // ========================== ReactQuill 설정 end ===============================

  // ========================== 파일 업로드 start =============================
  // const [files, setFiles] = React.useState([]);

  const fileUpload = React.useRef(null);

  const handleFileChange = (e) => {
    let fileSize = e.target.files[0]?.size;

    if (fileSize >= 10485760) {
    } else {
      formik.setFieldValue('fileList', [
        ...formik.values.fileList,
        e.target.files[0],
      ]);
      formik.setFieldValue('atchCnt', formik.values.atchCnt + 1);
      formik.setFieldValue('atchTtlSize', formik.values.atchTtlSize + fileSize);
    }
  };

  const handleUploadClick = () => {
    fileUpload.current.click();
  };

  const cancelUpld = (e) => {
    const filteredFileList = formik.values.fileList.filter(
      (item, index) => index != e.currentTarget.value
    );
    console.log(filteredFileList);
    const cancelFile = formik.values.fileList[e.currentTarget.value];
    formik.setFieldValue('atchCnt', formik.values.atchCnt - 1);
    formik.setFieldValue(
      'atchTtlSize',
      formik.values.atchTtlSize - cancelFile.size
    );
    formik.setFieldValue('fileList', filteredFileList);
  };
  console.log(formik.values);
  // ========================== 파일 업로드 end ===============================

  // ========================== 목록이동 확인 start =============================

  const [openCheck, setOpenCheck] = useState(false);

  const handleCloseCheckY = () => {
    setOpenCheck(false);
    navigate(`/board`);
  };

  const handleCloseCheckN = () => {
    setOpenCheck(false);
  };

  // ========================== 목록이동 취소 end ===============================

  // ======================== 오류 팝업 start =============================
  const [openError, setOpenError] = useState(false);

  const handleCloseError = () => {
    setOpenError(false);
  };
  // ======================== 오류 팝업 end =============================

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
          <TextField
            sx={{ width: '950px' }}
            size={'small'}
            id='boardTitle'
            value={formik.values.boardTitle}
            onChange={formik.handleChange}
          />
        </div>
        <ReactQuill
          style={{ width: '1000px', height: '600px', marginBottom: '50px' }}
          modules={modules}
          id='boardContent'
          value={formik.values.boardContent}
          onChange={(e) => formik.setFieldValue('boardContent', e)}
        />
      </div>

      <Card variant='outlined' sx={{ width: '1000px' }}>
        <div>
          <Button
            sx={{ marginTop: '10px', marginBottom: '10px', marginLeft: '5px' }}
            variant='contained'
            onClick={handleUploadClick}
            startIcon={<FileUploadIcon />}
            disabled={
              formik.values.atchCnt >= 3 ||
              formik.values.atchTtlSize >= 10485760 * 3
                ? true
                : false
            }
          >
            업로드
          </Button>
          <input
            className='file-input'
            type='file'
            multiple={true}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            ref={fileUpload}
          />
        </div>
        <Divider key='divider1' sx={{ borderWidth: 2 }}></Divider>
        <List>
          {formik.values &&
            formik.values.fileList.map((item, index) => (
              <div key={index + 0}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '10px',
                  }}
                  key={index + 1}
                >
                  <ListItem key={index + 2}>{item.name}</ListItem>
                  <Button
                    variant='outlined'
                    startIcon={<DeleteIcon />}
                    onClick={cancelUpld}
                    value={index}
                    sx={{ marginTop: '5px', marginBottom: '5px' }}
                  >
                    delete
                  </Button>
                </div>
                <Divider key={index + 4} variant='middle'></Divider>
              </div>
            ))}
        </List>
      </Card>

      <div
        style={{
          display: 'flex',
          marginTop: '20px',
          width: '1000px',
        }}
      >
        <Button variant='outlined' onClick={goList}>
          목록
        </Button>

        <form onSubmit={formik.handleSubmit} style={{ marginLeft: 'auto' }}>
          <Button variant='contained' type='submit'>
            등록
          </Button>
        </form>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>로그인이 필요한 서비스입니다.</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>확인</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openReg}
        onClose={handleCloseReg}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>등록이 완료되었습니다.</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReg}>확인</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCheck}
        onClose={handleCloseCheckN}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          작성정보가 있습니다. 목록으로 이동하시겠습니까?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCheckY}>확인</Button>
          <Button onClick={handleCloseCheckN}>취소</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openError}
        onClose={handleCloseError}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle> {error.code} </DialogTitle>
        <DialogContent> {error.content} </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseError}>확인</Button>
        </DialogActions>
      </Dialog>
    </Menu>
  );
}
