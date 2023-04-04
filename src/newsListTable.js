import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { Box, Card, Grid, Typography } from "@mui/material";

export default function NewsListTable(props){
    const newsListData = props.data;
    return (
        <div className="newsList">
            <Box>
            <TableContainer component={Paper} sx={{margin:'20px', width:'1000px'}}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">기사제목</TableCell>
                    <TableCell align="right">카테고리</TableCell>
                    <TableCell align="right">링크</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {newsListData.map(({id, title, category, url}) => (
                  <TableRow key={id}>
                    <TableCell align="right">{title}</TableCell>
                    <TableCell align="right">{category}</TableCell>
                    <TableCell align="right">
                    <a href={url}> 이동 </a>
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </Box>
          </div>
    )
}