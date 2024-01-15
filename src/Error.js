import { RttOutlined } from '@mui/icons-material';
import axios from 'axios';

const getError = (e) => {
  console.log(e.response.data);

  const error = e.response.data;

  return error;
};

export { getError };
