import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.2.2:8080', 
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiCorreios = axios.create({
    baseURL: 'https://viacep.com.br/ws/'
})

export { api, apiCorreios };
