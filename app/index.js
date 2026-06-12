import { useContext, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../src/context/AuthContext';
import { COLORS } from '../src/theme/colors';

export default function Index() {
    // 🚀 CORREÇÃO: Mudado de isLoading para loading
    const { signed, loading } = useContext(AuthContext); 
    const router = useRouter();

    useEffect(() => {
        // 🚀 CORREÇÃO: Agora 'loading' existe de verdade!
        if (loading) return; 

        const timer = setTimeout(() => {
            if (signed) {
                router.replace('/(tabs)/home');
            } else {
                router.replace('/login'); 
            }
        }, 0);

        return () => clearTimeout(timer); 
    }, [signed, loading]); // 🚀 CORREÇÃO: Atualizado aqui também

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white }}>
            <ActivityIndicator size="large" color={COLORS.darkBlue} />
        </View>
    );
}