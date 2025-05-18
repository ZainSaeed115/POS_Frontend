import axios from "axios";

export const axiosInstance=axios.create({
    baseURL:'http://pos-backend-b5a5.onrender.com/api/v1',
    // baseURL:'http://localhost:5676/api/v1',
    withCredentials:true
})