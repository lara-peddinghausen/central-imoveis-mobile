import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── URL BASE UNIFICADA ────────────────────────────────────────
// Ajustada para apontar corretamente para a raiz do Spring Boot
const API_URL = 'http://10.0.2.2:8080';

// CHAVES PADRONIZADAS (Alinhadas com o  AuthContext)
const TOKEN_KEY = '@centralImoveis:token';
const USER_KEY = '@centralImoveis:user';

// ─── INSTÂNCIA PADRÃO DO AXIOS ──────────────────────────────────
// Instância importada em Home.js e AuthContext.js
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// ─── LOGIN LEGACY (Mantido por compatibilidade) ─────────────────
export async function login(email, senha) {
    const response = await api.post('/auth/login', { email, senha });
    const { token, role, id, nome, cpf, dataNascimento } = response.data;

    const usuarioLogado = { id, email, role, nome, cpf, dataNascimento };

    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuarioLogado));

    // Injeta na instância global
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return response.data;
}

// ─── CADASTRO ──────────────────────────────────────────────────
export async function cadastrarAdministrador(nome, email, dataNascimento, senha) {
    const response = await api.post('/auth/cadastro', {
        nome,
        email,
        dataNascimento, 
        senha
    });
    return response.data;
}

// ─── LOGOUT LEGACY ─────────────────────────────────────────────
export async function logout() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    delete api.defaults.headers.common['Authorization'];
}

// ─── LER TOKEN  ─────────────────────────────────────────────────
export async function getToken() {
    return AsyncStorage.getItem(TOKEN_KEY);
}

// ─── INSTÂNCIA AXIOS AUTENTICADA ───────────────────────────────
export async function apiAutenticada() {
    const token = await getToken();
    
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return api;
}