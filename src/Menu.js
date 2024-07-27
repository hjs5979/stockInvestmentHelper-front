import { Button, Card, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PaidIcon from '@mui/icons-material/Paid';
import SihIcon from './sihicon.png';
import SihTypo from './sihtypo.png';
import { Link } from 'react-router-dom';
import {
  getAccessToken,
  getRefreshToken,
  getUserInfo,
  logout,
  setAccessToken,
  setRefreshToken,
} from './cookie';
import StockTable from './StockTable';
import axios from 'axios';

const Menu = ({ children, stockYn }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [loginYn, setLoginYn] = React.useState(false);

  const userId = getUserInfo()?.userId;

  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [accessToken] = React.useState(getAccessToken());
  const [refreshToken] = React.useState(getRefreshToken());

  // useEffect(()=>{

  // },[accessToken, refreshToken])

  const checkUser = async () => {
    try {
      const response = await axios
        .post(apiUrl + 'user/checkUser', {
          accessToken: accessToken,
          refreshToken: refreshToken,
          userId: userId,
        })
        .then((resp) => {
          setAccessToken(resp.data.accessToken);
          setRefreshToken(resp.data.refreshToken);
          setLoginYn(true);
        });
    } catch (e) {
      console.log(e);
      setLoginYn(false);
    }
  };

  const fetchStock = async () => {
    try {
      // 요청이 시작 할 때에는 error 와 users 를 초기화하고
      setError(null);
      setStock(null);
      // loading 상태를 true 로 바꿉니다.
      setLoading(true);

      const response = await axios.get(apiUrl + 'main/stock');
      setStock(response.data);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStock();

    if (!(accessToken == null || refreshToken == null)) {
      checkUser();
    }
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Link to={'/'} style={{ textDecoration: 'none', color: 'black' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={SihIcon}
              alt=''
              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            />
            {/* <img src={SihTypo} alt=""/> */}
            <Container
              sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
            >
              <span style={{ fontWeight: 'bold' }}>S</span>
              <span style={{ fontSize: '10px' }}>tock</span>
              <span style={{ fontWeight: 'bold' }}>I</span>
              <span style={{ fontSize: '10px' }}>nvestment</span>
              <span style={{ fontWeight: 'bold' }}>H</span>
              <span style={{ fontSize: '10px' }}>elper</span>
            </Container>
          </div>
        </Link>
        <Link
          to={'/board'}
          style={{ marginLeft: 'auto', marginRight: '40px', marginTop: '10px' }}
        >
          <Button variant='outlined'>정보게시판</Button>
        </Link>
        {loginYn ? (
          <div style={{ marginRight: '40px', marginTop: '10px' }}>
            환영합니다. {userId}님
            <div style={{ marginLeft: '60px' }}>
              <Link
                to={'/mypage'}
                style={{ fontSize: '10px', marginRight: '10px' }}
              >
                <span>마이페이지</span>
              </Link>
              <Link style={{ fontSize: '10px' }} onClick={() => logout()}>
                <span>로그아웃</span>
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ marginRight: '40px', marginTop: '10px' }}>
            <Link
              to={'/login'}
              style={{ fontSize: '10px', marginRight: '10px' }}
            >
              <span>로그인</span>
            </Link>

            <Link
              to={'/signup'}
              style={{ marginRight: '10px', fontSize: '10px' }}
            >
              <span>회원가입</span>
            </Link>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', margin: '2rem' }}>
        <div
          style={{
            display: 'flex',
            flexGrow: 1,
            width: '70%',
            flexDirection: 'column',
          }}
        >
          {children}
        </div>
        <div>
          {stockYn && stockYn === true ? (
            <Card
              sx={{
                flexGrow: 1,
                margin: '2px',
                height: '90vh',
                overflow: 'auto',
                display: { xs: 'none', sm: 'none', md: 'block' },
              }}
            >
              {stock && <StockTable data={stock} />}
            </Card>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
