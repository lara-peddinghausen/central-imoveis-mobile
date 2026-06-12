import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api'; // Certifique-se de que o caminho do seu axios está certo

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🚀 ADIÇÃO 2: Verifica se já existe um token salvo assim que o app abre
  useEffect(() => {
    async function loadStorageData() {
      const storageToken = await AsyncStorage.getItem('@centralImoveis:token');
      const storageUser = await AsyncStorage.getItem('@centralImoveis:user');

      if (storageToken && storageUser) {
        // Injeta o token guardado de volta no Axios para as próximas rotas
        api.defaults.headers.common['Authorization'] = `Bearer ${storageToken}`;
        setUser(JSON.parse(storageUser));
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  // 🚀 ADIÇÃO 1: Função de Login que recebe o e-mail e senha do formulário
  async function signIn(email, senha) {
    try {
      // Bate exatamente no seu AuthController do Spring Boot
      const response = await api.post('/auth/login', { email, senha });
      
      // Captura o token, e-mail e role vindo do seu AuthResponse (Record)
      const { token, role } = response.data;

      const usuarioLogado = { email, role };
      setUser(usuarioLogado);

      // Injeta o token no cabeçalho do Axios para todas as próximas requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Salva no celular para não perder a sessão ao fechar o app
      await AsyncStorage.setItem('@centralImoveis:token', token);
      await AsyncStorage.setItem('@centralImoveis:user', JSON.stringify(usuarioLogado));

    } catch (error) {
      console.error("Erro ao realizar login:", error.response?.data || error.message);
      throw error; // Repassa o erro para a sua tela de Login exibir o alerta na tela
    }
  }

  // Função para fazer Logoff (Limpa tudo)
  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}