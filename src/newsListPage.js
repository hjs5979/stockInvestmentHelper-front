import React, { useEffect, useState } from 'react';
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
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
  TextField,
  Typography,
} from '@mui/material';
import Menu from './Menu';

export default function NewsListPage(props) {
  const [searchParams] = useSearchParams();
  const wordId = searchParams.get('wordId');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wordContent, setWordContent] = useState('');
  const [inqCndtCon, setInqCndtCon] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL;

  const getAsyncData = async () => {
    //setLoading(true);
    const response = await axios.post(apiUrl + 'main/detail', {
      wordId: wordId,
      inqCndtCon: inqCndtCon,
    });
    setData(response.data.detailOutVoList);
    setWordContent(response.data.wordContent);
    //setLoading(false);

    return response;
  };

  useEffect(() => {
    getAsyncData();
  }, []);

  const handleChange = (event) => {
    console.log(event.target.value);
    setInqCndtCon(event.target.value);
  };

  const search = () => {
    getAsyncData();
  };

  return (
    <Menu stockYn={true}>
      <div>
        <div className='newsList'>
          <Box sx={{ marginX: '20px', marginY: '2px' }}>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              <Typography
                variant='h4'
                gutterBottom
                sx={{ marginRight: '10px' }}
              >
                {`"${wordContent}"`}
              </Typography>

              <TextField
                sx={{ marginRight: '10px' }}
                onChange={(event) => handleChange(event)}
                value={inqCndtCon}
              />
              <Button variant='outlined' onClick={() => search()}>
                검색
              </Button>
            </div>
            <TableContainer component={Paper} sx={{ width: '100%' }}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align='center'
                      sx={{
                        color: 'white',
                        backgroundColor: '#3183f6',
                        fontWeight: '700',
                      }}
                    >
                      기사제목
                    </TableCell>
                    {/* <TableCell align="right">카테고리</TableCell> */}
                    <TableCell
                      align='center'
                      sx={{
                        color: 'white',
                        backgroundColor: '#3183f6',
                        fontWeight: '700',
                      }}
                    >
                      링크
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data &&
                    data.map((item) => (
                      <TableRow key={item.newsId}>
                        <TableCell align='center'>{item.newsTitle}</TableCell>
                        {/* <TableCell align="right">{category}</TableCell> */}
                        <TableCell align='center'>
                          <Button
                            variant='contained'
                            size='small'
                            href={item.newsUrl}
                            target='_blank'
                            sx={{ backgroundColor: '#000000' }}
                          >
                            이동
                          </Button>

                          {/* <a
                            href={item.newsUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            {' '}
                            이동{' '}
                          </a> */}
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
