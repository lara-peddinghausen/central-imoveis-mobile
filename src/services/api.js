import axios from 'axios';
import { router } from 'expo-router';

const api = axios.create({
  baseURL: 'http://10.0.2.2:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Se o servidor responder que o token está inválido/expirado (401 ou 403)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log("Token expirado ou inválido. Redirecionando para o login...");

      // Limpe o token do armazenamento local aqui
      // await AsyncStorage.removeItem('@token');

      // Chuta o usuário de volta para a tela de login
      router.replace('/auth/login');
    }
    return Promise.reject(error);
  }
);

const apiCorreios = axios.create({
  baseURL: 'https://viacep.com.br/ws/'
})

export { api, apiCorreios };
