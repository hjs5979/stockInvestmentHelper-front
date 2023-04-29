import React,{ useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import NewsListTable from './newsListTable';
import { Button } from '@mui/material';

export default function NewsListPage(props) {
    const {state} = useLocation();
    const param = useParams();
    const [data, setData] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const getAsyncData = async ()=>{
            setLoading(true);
            const ad =  await axios.get("https://sa.thxx.xyz:8080/main/word?wordid="+state.id)
            setData(ad.data.data);
            setLoading(false);
        }
        getAsyncData();
        console.log(data);
    },[param.word])

    return (
        <div>
            {/* {!loading && data.map((news)=>(
                <p>{news.id} {news.category} {news.title} {news.url}</p>
            ))} */}
            {!loading && <NewsListTable data={data} />}
            
            <Link style={{textDecoration:'none'}}to={"https://www.hanaw.com/main/research/research/list.cmd?pid=0&cid=0&srchTitle=ALL&srchWord=" + param.word + "&startDate=2023-03-02&endDate=2023-03-09"}>
            <Button>리서치 센터로 이동            </Button>
            </Link>
            <br/>
            <Link to="/" style={{textDecoration:'none'}}><Button>뒤로 가기</Button></Link>
        </div>
    );
  }