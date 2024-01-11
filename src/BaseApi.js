import { RttOutlined } from '@mui/icons-material';
import axios from 'axios';

const instance = (at, rt, userId, userRole) =>
  axios.create({
    headers: {
      accessToken: at,
      refreshToken: rt,
      userId: userId,
      userRole: userRole,
    },
  });

const formDataInstance = (at, rt, userId) =>
  axios.create({
    headers: {
      accessToken: at,
      refreshToken: rt,
      userId: userId,
      'Content-Type': 'multipart/form-data',
    },
  });

const dnldInstance = (at, rt, userId) =>
  axios.create({
    headers: {
      accessToken: at,
      refreshToken: rt,
      userId: userId,
    },
    responseType: 'blob',
  });

export { instance, formDataInstance, dnldInstance };
