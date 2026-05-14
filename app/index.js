import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function Index() {
  const [logado, setLogado] = useState(null);

  useEffect(() => {
    verificarLogin();
  }, []);

  async function verificarLogin() {
    const usuario = await AsyncStorage.getItem('usuario');

    if (usuario) {
      setLogado(true);
    } else {
      setLogado(false);
    }
  }

  if (logado === null) {
    return null;
  }

  if (logado) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}