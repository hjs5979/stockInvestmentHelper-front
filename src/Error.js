import { RttOutlined } from '@mui/icons-material';
import axios from 'axios';

const getError = (e) => {
  console.log(e.response.data.message);

  const error = JSON.parse(e.response.data.message);

  return error;
};

export { getError };
