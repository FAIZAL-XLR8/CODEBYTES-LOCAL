import axios from "axios"

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL !== undefined 
        ? import.meta.env.VITE_API_URL 
        : (import.meta.env.DEV ? "http://localhost:3000" : ""),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default axiosClient