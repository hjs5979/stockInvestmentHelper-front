import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import React from 'react';
import { visuallyHidden } from '@mui/utils';

export default function StockTable(props) {
  const stockData = props.data;

  const [order, setOrder] = React.useState('asc');

  const createSortHandler = (event) => {
    if (order === 'desc') {
      sortedStock = stockData?.sort((a, b) => b.stockValue - a.stockValue);
    } else {
      sortedStock = stockData?.sort((a, b) => a.stockValue - b.stockValue);
    }

    const nextOrder = order === 'desc' ? 'asc' : 'desc';

    setOrder(nextOrder);
  };

  let sortedStock = stockData;

  return (
    <div className='stock'>
      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              {/* <TableCell>No</TableCell> */}
              <TableCell align='right' sx={{color: 'white',backgroundColor: '#3183f6', fontWeight:'700'}}>테마</TableCell>
              <TableCell align='right' sx={{backgroundColor: '#3183f6'}}>
                <TableSortLabel
                  active={true}
                  direction={order}
                  onClick={createSortHandler}
                >
                  <span className={'text-white font-bold'}>전일대비등락</span>
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStock &&
              sortedStock.map((item) => (
                <TableRow key={item.stockId}>
                  {/* <TableCell>{id}</TableCell> */}
                  <TableCell align='right'>
                    <p>{item.stockThema}</p>
                  </TableCell>
                  <TableCell align='right'>{item.stockValue + '%'}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
