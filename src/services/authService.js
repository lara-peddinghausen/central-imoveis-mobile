import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── URL base da API ───────────────────────────────────────────
// Emulador Android → 10.0.2.2  |  Dispositivo físico → IP local
const API_URL = 'http://10.0.2.2:8080/api';

// Chaves usadas no AsyncStorage
const TOKEN_KEY = '@jwt_token';
const EMAIL_KEY = '@user_email';


// ─── LOGIN ─────────────────────────────────────────────────────
// Envia credenciais, recebe JWT e salva no dispositivo
export async function login(email, senha) {
    const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        senha,
    });

    const { token } = response.data;

    // Salva token e email para uso futuro (persiste entre sessões)
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(EMAIL_KEY, email);

    return response.data;
}


// ─── CADASTRO ──────────────────────────────────────────────────
// Cria novo usuário no backend (rota pública)
export async function cadastrarAdministrador(nome, email, dataNascimento, senha) {
    const response = await axios.post(`${API_URL}/auth/cadastro`, {
        nome,
        email,
        dataNascimento, 
        senha
    });
    return response.data;
}


// ─── LOGOUT ────────────────────────────────────────────────────
// Remove dados locais (JWT é stateless — não há sessão no servidor)
export async function logout() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(EMAIL_KEY);
}


// ─── LER TOKEN ─────────────────────────────────────────────────
// Retorna o token salvo ou null se não houver
export async function getToken() {
    return AsyncStorage.getItem(TOKEN_KEY);
}


// ─── LER EMAIL ─────────────────────────────────────────────────
export async function getEmail() {
    return AsyncStorage.getItem(EMAIL_KEY);
}


// ─── INSTÂNCIA AXIOS AUTENTICADA ───────────────────────────────
// Cria um cliente Axios com o header Authorization já configurado.
// Use esta função em TODAS as chamadas a rotas protegidas.
export async function apiAutenticada() {
    const token = await getToken();

    return axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
}