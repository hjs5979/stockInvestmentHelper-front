import React, { useState, useEffect } from 'react';
// import * as React from "react";
import './App.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import Menu from './Menu';
import {
  getAccessToken,
  getRefreshToken,
  getUserInfo,
  getUserRole,
  setAccessToken,
  setRefreshToken,
} from './cookie';
import { dnldInstance, formDataInstance, instance } from './BaseApi';
import DOMPurify from 'dompurify';
import moment from 'moment';
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Yup from 'yup';

export default function BoardDetailPage() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();

  const param = useParams();

  const [error, setError] = React.useState();

  const [boardDetail, setBoardDetail] = useState(null);

  const userId = getUserInfo()?.userId;
  const [accessToken] = React.useState(getAccessToken());
  const [refreshToken] = React.useState(getRefreshToken());

  const userRole = getUserRole();

  const [mode, setMode] = React.useState('view');

  const [initialValues, setInitialValues] = React.useState({
    boardTitle: '',
    boardContent: '',
    atchCnt: 0,
    atchTtlSize: 0,
    fileList: [],
    atchNo: 0,
  });

  const goList = () => {
    console.log('formik-value', formik.values);
    console.log('formik-initialValue', formik.initialValues);
    if (JSON.stringify(initialValues) === JSON.stringify(formik.values)) {
      navigate(`/board`);
    } else {
      setOpenCheck(true);
    }
  };

  // ======================== 로그인 확인 팝업 start =============================
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    navigate('/login');
  };
  // ======================== 로그인 확인 팝업 end =============================

  // ======================== 게시판 조회 API start ============================

  const fetchBoardDetail = async () => {
    try {
      // 요청이 시작 할 때에는 error 와 users 를 초기화하고
      setBoardDetail(null);

      const response = await instance(accessToken, refreshToken, userId).post(
        apiUrl + `board/detail`,
        {
          boardId: param.boardId,
        }
      );

      setBoardDetail(response.data); // 데이터는 response.data 안에 들어있습니다.

      if (response.data.fileList == null) {
        formik.setValues({ ...response.data, fileList: [] });
        setInitialValues({ ...response.data, fileList: [] });
      } else {
        formik.setValues(response.data);
        setInitialValues(response.data);
      }
    } catch (e) {
      if (
        (e.response.data?.message == '유효하지 않음1') |
        (e.response.data?.message == '유효하지 않음2')
      ) {
        setOpen(true);
      } else {
        setError(e.repsonse.data.message);
        setOpenError(true);
      }
    }
  };

  useEffect(() => {
    fetchBoardDetail();
  }, [mode]);

  // ======================== 게시판 조회 API end ============================

  // ======================== 다운로드 API start =============================

  const download = async (item) => {
    try {
      // 요청이 시작 할 때에는 error 와 users 를 초기화하고

      const response = await dnldInstance(accessToken, refreshToken, userId)
        .get(
          apiUrl +
            `atch/dnld?atchNo=${Number(item.atchNo)}&atchDtlno=${Number(
              item.atchDtlno
            )}`
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;

          link.setAttribute('download', item.atchNm); // 다운로드될 파일의 이름 설정
          document.body.appendChild(link);
          link.click();
        });
    } catch (e) {
      setError(e.repsonse.data.message);
      setOpenError(true);
    }
  };

  // ======================== 다운로드 API end =============================

  // ======================== 수정 formik, API start =======================

  const [cancelFileList, setCancelFileList] = React.useState([]);

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: Yup.object({
    //   boardTitle: Yup.string().required('제목을 입력하세요'),
    //   boardContent: Yup.string().required('내용을 입력하세요.'),
    //   fileCnt: Yup.number().max(3, '최대 3개의 파일을 첨부할 수 있습니다.'),
    //   fileTtl: Yup.number().max(
    //     31457280,
    //     '최대 30MB의 파일을 첨부할 수 있습니다.'
    //   ),
    // }),
    validate: (values) => {
      //   const errors = {};
      //   if (idCheck === 1) {
      //     errors.id = '중복된 아이디는 사용할 수 없습니다.';
      //   }
      //   return errors;
    },
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('boardId', param.boardId);
      formData.append('boardTitle', values.boardTitle);
      formData.append('boardContent', values.boardContent);

      values.fileList?.forEach((file) => {
        if (file instanceof File) {
          formData.append('fileList', file);
        }
      });

      cancelFileList?.map((cancelFile, index) => {
        // let obj = {
        //   atchNo: cancelFile.atchNo,
        //   atchDtlno: cancelFile.atchDtlno,
        // };

        formData.append('cancelFiles[' + index + '].atchNo', cancelFile.atchNo);
        formData.append(
          'cancelFiles[' + index + '].atchDtlno',
          cancelFile.atchDtlno
        );
      });
      if (values.atchNo != null) {
        formData.append('atchNo', values.atchNo);
      }

      formData.append('atchTtlSize', values.atchTtlSize);
      formData.append('atchCnt', values.atchCnt);

      // console.log('atchTtlSize', values.atchTtlSize);
      // console.log('atchCnt', values.atchCnt);
      console.log('formik - cancelFile', cancelFileList);
      // console.log('formData', formData);

      mdfcBoard(formData);

      setCancelFileList([]);
    },
  });

  // ======================== 수정 formik, API end =========================

  // ======================== 파일 업로드 start ============================

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
    // console.log(e.currentTarget.value);

    const filteredFileList = formik.values.fileList.filter(
      (item, index) => index != e.currentTarget.value
    );

    const cancelFile = formik.values.fileList[e.currentTarget.value];
    console.log('cancelFile', cancelFile);
    formik.setFieldValue('atchCnt', formik.values.atchCnt - 1);
    formik.setFieldValue(
      'atchTtlSize',
      formik.values.atchTtlSize -
        (cancelFile instanceof File ? cancelFile.size : cancelFile.atchSize)
    );
    formik.setFieldValue('fileList', filteredFileList);

    if (!(cancelFile instanceof File)) {
      setCancelFileList([...cancelFileList, cancelFile]);
    }
  };
  console.log(formik.values);
  // ======================== 파일 업로드 end ==============================

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

  // ========================= 게시판 수정 API start ===============================
  const mdfcBoard = async (values) => {
    try {
      const response = await formDataInstance(accessToken, refreshToken, userId)
        .post(apiUrl + `board/mdfc`, values)
        .then(() => setOpenMdfc(true));
    } catch (e) {
      if (
        (e.response.data?.message == '유효하지 않음1') |
        (e.response.data?.message == '유효하지 않음2')
      ) {
        setOpen(true);
      } else {
        setError(e.repsonse.data.message);
        setOpenError(true);
      }
    }
  };
  // ========================= 게시판 수정 API end =================================

  // ======================== 수정 완료 팝업 start =============================
  const [openMdfc, setOpenMdfc] = useState(false);

  const handleCloseMdfc = () => {
    setOpenMdfc(false);
    setMode('view');
  };
  // ======================== 수정 완료 팝업 end =============================

  // ========================== 목록이동 확인 start =============================

  const [openCheck, setOpenCheck] = useState(false);

  const handleCloseCheckY = () => {
    setOpenCheck(false);
    navigate(`/board`);
  };

  const handleCloseCheckN = () => {
    setOpenCheck(false);
  };

  // ========================== 목록이동 취소 end =================================

  // ========================== 게시판 삭제 API start =============================

  const deleteBoard = async () => {
    try {
      const response = await instance(
        accessToken,
        refreshToken,
        userId,
        userRole
      ).post(apiUrl + `board/delete`, { boardId: param.boardId });
    } catch (e) {
      setError(e.repsonse.data.message);
      setOpenError(e.repsonse.data.message);
    }
  };

  // ========================== 게시판 삭제 API end ===============================

  // ======================== 삭제 확인 팝업 start =============================
  const [openDel, setOpenDel] = useState(false);

  const handleCloseDelY = () => {
    deleteBoard();
    setOpenDel(false);
    setOpenDelDone(true);
  };

  const handleCloseDelN = () => {
    setOpenDel(false);
  };

  // ======================== 삭제 확인 팝업 end =============================

  // ======================== 삭제 완료 팝업 start =============================
  const [openDelDone, setOpenDelDone] = useState(false);

  const handleCloseDelDone = () => {
    setOpenDelDone(false);
    navigate('/board');
  };
  // ======================== 삭제 완료 팝업 end =============================

  // ======================== 오류 팝업 start =============================
  const [openError, setOpenError] = useState(false);

  const handleCloseError = () => {
    setOpenDelDone(false);
  };
  // ======================== 오류 팝업 end =============================

  const ViewTemplate = () => {
    return (
      <div>
        <Typography variant='h2' component='h2'>
          {boardDetail?.boardTitle}
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
            {boardDetail?.boardWrtId}
          </Typography>

          <Typography
            sx={{ marginRight: '10px' }}
            sxvariant='h6'
            component='h6'
          >
            등록일
          </Typography>

          <Typography variant='subtitle1' component='subtitle1'>
            {moment(boardDetail?.boardCretTs).format('YYYY-MM-DD')}
          </Typography>
        </div>
        <div
          style={{ height: '300px' }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(boardDetail?.boardContent),
          }}
        ></div>

        <List>
          {boardDetail?.fileList &&
            boardDetail?.fileList.length > 0 &&
            boardDetail?.fileList.map((item, index) => (
              <div key={index + 0}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '10px',
                  }}
                  key={index + 1}
                >
                  <Link
                    key={index + 2}
                    underline='hover'
                    onClick={() => download(item)}
                  >
                    {item.atchNm}
                  </Link>
                </div>
              </div>
            ))}
        </List>

        <div style={{ display: 'flex', width: '1000px' }}>
          <Button
            variant='outlined'
            onClick={() => navigate(`/board`)}
            sx={{ margin: 'auto' }}
          >
            목록
          </Button>
          {boardDetail?.boardWrtId == userId ? (
            <div>
              <Button
                variant='contained'
                onClick={() => setMode('mdfc')}
                sx={{ marginRight: '10px' }}
              >
                수정
              </Button>
              <Button
                variant='outlined'
                sx={{ marginRight: '10px' }}
                onClick={() => setOpenDel(true)}
              >
                삭제
              </Button>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  };

  return (
    <Menu stockYn={true}>
      {mode == 'view' ? <ViewTemplate></ViewTemplate> : ''}

      {mode == 'mdfc' ? (
        <div>
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
                value={formik.values?.boardTitle}
                onChange={formik.handleChange}
                // value={quill.boardTitle}
                // onChange={(e) => setQuill({ ...quill, boardTitle: e.target.value })}
              />
            </div>
            <ReactQuill
              style={{ width: '1000px', height: '600px', marginBottom: '50px' }}
              modules={modules}
              id='boardContent'
              value={formik.values?.boardContent}
              onChange={(e) => formik.setFieldValue('boardContent', e)}
            />
          </div>

          <Card variant='outlined' sx={{ width: '1000px' }}>
            <div>
              <Button
                sx={{
                  marginTop: '10px',
                  marginBottom: '10px',
                  marginLeft: '5px',
                }}
                variant='contained'
                onClick={handleUploadClick}
                startIcon={<FileUploadIcon />}
                disabled={
                  formik.values?.atchCnt >= 3 ||
                  formik.values?.atchTtlSize >= 10485760 * 3
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
                formik.values.fileList?.length > 0 &&
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
                      <ListItem key={index + 2}>
                        {item instanceof File ? item.name : item.atchNm}
                      </ListItem>
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
              marginTop: '10px',
              width: '1000px',
            }}
          >
            <Button variant='outlined' onClick={goList} sx={{ margin: 'auto' }}>
              목록
            </Button>
            <div
              style={{
                display: 'flex',
              }}
            >
              <form onSubmit={formik.handleSubmit}>
                <Button variant='contained' type='submit'>
                  수정
                </Button>
              </form>
              <Button
                variant='outlined'
                onClick={() => setMode('view')}
                sx={{ margin: 'auto', marginLeft: '10px' }}
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
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
        open={openMdfc}
        onClose={handleCloseMdfc}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>수정이 완료되었습니다.</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMdfc}>확인</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCheck}
        onClose={handleCloseCheckN}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          수정내용이 있습니다. 목록으로 이동하시겠습니까?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCheckY}>확인</Button>
          <Button onClick={handleCloseCheckN}>취소</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDel}
        onClose={handleCloseDelN}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>게시물을 삭제하시겠습니까?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelY}>확인</Button>
          <Button onClick={handleCloseDelN}>취소</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDelDone}
        onClose={handleCloseDelDone}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>게시물이 삭제되었습니다.</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelDone}>확인</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openError}
        onClose={handleCloseError}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent> {error} </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseError}>확인</Button>
        </DialogActions>
      </Dialog>
    </Menu>
  );
}
