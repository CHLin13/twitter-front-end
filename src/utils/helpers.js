import axios from 'axios'
import Swal from 'sweetalert2'

// const baseURL = process.env.NODE_ENV === 'production' ? 'https://thawing-taiga-98720.herokuapp.com/api' : 'http://localhost:3000/api'

const baseURL = "http://localhost:3000/api"

const axiosInstance = axios.create({
  baseURL
})

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})


axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('simpleTwitter-token')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  err => Promise.reject(err)
)

export const apiHelper = axiosInstance
