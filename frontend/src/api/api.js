import axios from "axios";
// const local = 'http://localhost:5000'
const local = 'http://e-commerce-backend:5000'
const production = ''
const api = axios.create({
    baseURL : `${local}/api`
})
export default api