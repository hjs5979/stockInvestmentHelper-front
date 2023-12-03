import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import NewsListTable from './newsListTable';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Menu from './Menu';

export default function NewsListPage(props) {
  const { state } = useLocation();
  const param = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const getAsyncData = async () => {
      setLoading(true);
      const response = await axios.post(apiUrl + 'main/detail', {
        wordId: state.id,
      });
      setData(response.data);
      setLoading(false);
    };
    getAsyncData();
  }, [param.word]);

  console.log(data);

  return (
    <Menu stockYn={true}>
      <div>
        <div className='newsList'>
          <Box>
            <TableContainer
              component={Paper}
              sx={{ margin: '20px', width: '1200px' }}
            >
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>기사제목</TableCell>
                    {/* <TableCell align="right">카테고리</TableCell> */}
                    <TableCell align='center'>링크</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data &&
                    data.map((item) => (
                      <TableRow key={item.newsId}>
                        <TableCell align='center'>{item.newsTitle}</TableCell>
                        {/* <TableCell align="right">{category}</TableCell> */}
                        <TableCell align='center'>
                          <a
                            href={item.newsUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            {' '}
                            이동{' '}
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </div>
      </div>
    </Menu>
  );
}
