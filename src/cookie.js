import Cookies from 'js-cookie';

// import { USER, TOKEN_NAME, EMPID, SEARCH_PARAMS } from '@/app/shared/config/commonCode';
// import { environment } from '@/app/shared/config/environment';

// const getSearchParams = () => {
//   return Cookies.get(SEARCH_PARAMS);
// }

// const setSearchParams = (value) => {
//   Cookies.set(SEARCH_PARAMS, value);
// }

// const removeSearchParams = () => {
//   sessionStorage.removeItem(SEARCH_PARAMS);
// }

// const getEmpId = () => {
//   return Cookies.get(EMPID);
// }

// const setEmpId = (empid) => {
//   Cookies.set(EMPID, empid);
// }

const getAccessToken = () => {
  return localStorage.getItem('accessToken');
  // console.log(Cookies.get("userId"));
};

const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
  // console.log(Cookies.get("userId"));
};

const setAccessToken = (token) => {
  localStorage.setItem('accessToken', token);
};

const setRefreshToken = (token) => {
  localStorage.setItem('refreshToken', token);
};

const getUserInfo = () => {
  const userInfoJson = localStorage.getItem('userInfo');

  const userInfo = JSON.parse(userInfoJson);

  return userInfo;
  //   return null

  // {
  //     id: 'admin',
  //     name: '관리자',
  //     empid: '12345',
  //     emn: '',
  //     lgnTs: '',
  // }

  // return Cookies.get(USER);
};

const setUserInfo = (info) => {
  const infoJson = JSON.stringify(info);
  localStorage.setItem('userInfo', infoJson);
};

// const removeToken = () => {
//   localStorage.removeItem('userInfo');
//   localStorage.removeItem('authorization');
// };

// const ssoLogin = () => {
//   // console.log('sso login', process.env.NEXT_PUBLIC_MODE)
//   // admin 에서는 직접 로그인 막음
//   // window.location.href = `${process.env.NEXT_PUBLIC_SSO_AUTH}`;

//   localStorage.clear();

//   const LOGOUT_URL = window.location.protocol + '//' + window.location.host + '/auth/logout'
//   window.location.href = LOGOUT_URL;
// }

const logout = () => {
  // removeToken();
  localStorage.clear();
  window.location.href = `/`;
};

const hasValidToken = () => {
  if (getAccessToken() !== null && getAccessToken() !== undefined) {
    return true;
  } else {
    return false;
  }
};

const getIsAdmin = () => {
  // userData.userDatacldPotlAthrList: []
  // "01" 포함되면 관리자, 없거나 "10"번 => 사용자

  return true; //test

  /** 
    let userData = JSON.parse(getUserInfo())    
    let isAdmin = false;
    // console.log('getIsAdmin userData', userData)

    if(userData && userData.cldPotlAthrList) {
        isAdmin = userData.cldPotlAthrList.includes(commonCode.ATHR_DCD_ADM)
    }
    return isAdmin;
  */
};

export {
  // ssoLogin,
  logout,
  //   getEmpId,
  //   setEmpId,
  setAccessToken,
  setRefreshToken,
  getUserInfo,
  setUserInfo,
  getAccessToken,
  getRefreshToken,
  // removeToken,
  hasValidToken,
  getIsAdmin,
  //   getSearchParams, setSearchParams, removeSearchParams
};
