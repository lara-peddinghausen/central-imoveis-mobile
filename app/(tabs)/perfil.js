import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Perfil() {
    const router = useRouter();

    const handleLogout = async () => {
        // Limpa as credenciais salvas no celular
        await AsyncStorage.removeItem('usuario');
        // Expulsa o usuário das abas e o manda para a tela limpa de login
        router.replace('/login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meu Perfil</Text>
            <Text style={styles.info}>Administrador do Sistema</Text>
            
            <View style={styles.buttonContainer}>
                <Button title="Sair do Aplicativo" onPress={handleLogout} color="#DC3545" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 16 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    info: { fontSize: 16, color: '#666', marginBottom: 24 },
    buttonContainer: { width: '80%' }
});

// EXEMPLO