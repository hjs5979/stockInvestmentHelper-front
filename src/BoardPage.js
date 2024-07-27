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
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import Menu from './Menu';
import moment from 'moment';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { getError } from './Error';

export default function BoardPage() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [inqCndt, setInqCndt] = useState({ inqCndtCon: '', inqCndtDcd: '10' });

  const [searchParam, setSearchParam] = useState({
    inqCndtCon: '',
    inqCndtDcd: '10',
  });

  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [boardCnt, setBoardCnt] = useState(null);

  //젠킨스 테스트용 주석

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ code: '', content: '' });

  // ============================== 게시물 리스트 조회 API start ==============================

  const fetchBoards = async () => {
    try {
      // 요청이 시작 할 때에는 error 와 users 를 초기화하고
      setBoard(null);
      // loading 상태를 true 로 바꿉니다.

      const response = await axios.post(apiUrl + 'board/list', searchParam);

      setBoard(response.data.content); // 데이터는 response.data 안에 들어있습니다.
      setBoardCnt(response.data.countBoard);
    } catch (e) {
      const error = getError(e);

      setError({ code: error.code, content: error.content });
      setOpenError(true);
    }
  };

  // ============================== 게시물 리스트 조회 API end ================================

  useEffect(() => {
    fetchBoards();
  }, [searchParam]);

  const search = () => {
    setSearchParam(inqCndt);
  };

  // const sortedItems = word?.slice(0,30).sort((a, b) => b.wordCount - a.wordCount);

  // let result = sortedItems?.map(({ wordId: key, wordContent:value, wordCount:count }) => ({ key, value, count }));

  const handleChange = (event, cndt) => {
    console.log(event);
    setInqCndt({ ...inqCndt, [cndt]: event.target.value });
  };

  const rowClick = (event, item) => {
    navigate(`/board/${item.boardId}`);
  };

  const addFunc = () => {
    navigate('/board/add');
  };

  // ======================== 오류 팝업 start =============================
  const [openError, setOpenError] = useState(false);

  const handleCloseError = () => {
    setOpenError(false);
  };
  // ======================== 오류 팝업 end =============================

  return (
    <Menu stockYn={true}>
      <div style={{ width: '79%' }}>
        <div style={{ display: 'flex', marginTop: '20px', marginLeft: '20px' }}>
          {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
          <Select
            defaultValue={10}
            sx={{ width: '100px', marginRight: '10px' }}
            onChange={(event) => handleChange(event, 'inqCndtDcd')}
            value={inqCndt.inqCndtDcd}
          >
            <MenuItem value={10}>전체</MenuItem>
            <MenuItem value={20}>제목</MenuItem>
            <MenuItem value={30}>작성자</MenuItem>
            <MenuItem value={40}>내용</MenuItem>
          </Select>
          <TextField
            sx={{ marginRight: '10px' }}
            onChange={(event) => handleChange(event, 'inqCndtCon')}
            value={inqCndt.inqCndtCon}
          />
          <Button onClick={search} variant='outlined'>
            검색
          </Button>

          <Button
            sx={{ marginLeft: 'auto' }}
            onClick={() => addFunc()}
            variant='contained'
          >
            글쓰기
          </Button>
        </div>
        <div>
          {/* <Box sx={{display:"flex", flexGrow:1, justifyContent:'center',width:'70%',flexDirection:'column'}}> */}
          <TableContainer
            component={Paper}
            sx={{ margin: '20px', width: '1100px' }}
          >
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: 'white',
                      backgroundColor: '#3183f6',
                      fontWeight: '700',
                    }}
                    align='center'
                  >
                    순번
                  </TableCell>
                  {/* <TableCell align="right">카테고리</TableCell> */}
                  <TableCell
                    sx={{
                      color: 'white',
                      backgroundColor: '#3183f6',
                      fontWeight: '700',
                    }}
                    align='center'
                  >
                    제목
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'white',
                      backgroundColor: '#3183f6',
                      fontWeight: '700',
                    }}
                    align='center'
                  >
                    첨부파일
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'white',
                      backgroundColor: '#3183f6',
                      fontWeight: '700',
                    }}
                    align='center'
                  >
                    작성자ID
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'white',
                      backgroundColor: '#3183f6',
                      fontWeight: '700',
                    }}
                    align='center'
                  >
                    등록일자
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {board &&
                  board.map((item, index) => (
                    <TableRow
                      key={item.boardId}
                      onClick={(e) => rowClick(e, item)}
                      hover={true}
                      selected={true}
                    >
                      <TableCell align='center'>{boardCnt - index}</TableCell>
                      <TableCell align='center'>{item.boardTitle}</TableCell>
                      <TableCell align='center'>
                        {item.atchYn == 1 ? <AttachmentIcon /> : ''}
                      </TableCell>
                      <TableCell align='center'>{item.boardWrtId}</TableCell>
                      <TableCell align='center'>
                        {moment(item.boardCretTs).format('YYYY-MM-DD')}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

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
