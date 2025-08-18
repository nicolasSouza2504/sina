
import axios from 'axios';
import api from './api';

const axiosClient = axios.create({
    baseURL: `${api.apiBaseUrl}`,

});


export default axiosClient;