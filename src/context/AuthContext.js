import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { useContext } from 'react';

export const AuthContext = createContext({});

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //Verifica se já existe um token salvo assim que o app abre
  useEffect(() => {
    async function loadStorageData() {

      // await AsyncStorage.clear();

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

  // Função de Login que recebe o e-mail e senha do formulário
  async function signIn(email, senha) {
    try {
      const response = await api.post('/auth/login', { email, senha });

      console.log("👉 O QUE O JAVA ESTÁ DEVOLVENDO NO LOGIN:", response.data);

      // 🚀 1. CAPTURA ATUALIZADA: Pegando todos os novos campos que o Java enviou
      const { token, role, id, nome, cpf, dataNascimento, email: emailDoBanco } = response.data;

      // 🚀 2. OBJETO ATUALIZADO: Incluindo os novos campos para a tela de Perfil ler
      const usuarioLogado = { id, email: emailDoBanco || email, role, nome, cpf, dataNascimento };
      setUser(usuarioLogado);

      // Injeta o token no cabeçalho do Axios para todas as próximas requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Salva no celular para não perder a sessão ao fechar o app
      await AsyncStorage.setItem('@centralImoveis:token', token);
      await AsyncStorage.setItem('@centralImoveis:user', JSON.stringify(usuarioLogado));

    } catch (error) {
      console.error("Erro ao realizar login:", error.response?.data || error.message);
      throw error;
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