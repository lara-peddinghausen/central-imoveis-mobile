import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function DetalhesImovel() {
    const { id } = useLocalSearchParams(); // Captura o ID da URL de forma automática

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gerenciar Imóvel ID: {id}</Text>
            <Text>A barra inferior continua fixada aqui embaixo com sucesso!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#0B3B63' }
});

// EXEMPLO