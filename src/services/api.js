import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiCorreios = axios.create({
    baseURL: 'https://viacep.com.br/ws'
})

export default { api, apiCorreios };
