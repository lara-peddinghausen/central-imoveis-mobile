import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../../src/services/api'; // ajuste seu caminho de import
import { COLORS } from '../../../src/theme/colors';

export default function DetalhesImovel() {
    // 🚀 Captura o ID vindo da URL
    const { id } = useLocalSearchParams();

    const [imovel, setImovel] = useState(null);
    const [carregando, setCarregando] = useState(true);

    const BASE_URL = 'http://10.0.2.2:8080';

    useEffect(() => {
        async function buscarDadosDoBanco() {
            try {
                // 🔒 Busca segura e autenticada direta do Spring Boot usando o ID
                const response = await api.get(`/imovel/${id}`);
                setImovel(response.data);
            } catch (error) {
                console.error("Erro ao buscar detalhes:", error.message);
                Alert.alert('Erro', 'Não foi possível carregar os dados atualizados deste imóvel.');
            } finally {
                setCarregando(false);
            }
        }

        if (id) {
            buscarDadosDoBanco();
        }
    }, [id]);

    // ⏳ Enquanto o Spring Boot responde, exibe o loading na tela
    if (carregando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.darkBlue} />
                <Text style={styles.loadingText}>Carregando dados protegidos...</Text>
            </View>
        );
    }

    // Se o imóvel não for encontrado por segurança
    if (!imovel) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Imóvel não encontrado.</Text>
            </View>
        );
    }

    // 🎨 Renderização perfeita e dinâmica com a "Fonte Única da Verdade" do Banco de Dados
    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.line} />
            <View style={styles.header}>

                <Image
                    source={imovel.fotoUrl ? { uri: `${BASE_URL}${imovel.fotoUrl}` } : require('../../../src/assets/images/logo3.png')}
                    style={styles.img}
                />
                <View style={styles.textHeader}>
                    <Text style={styles.tituloImovel}>{imovel.nome}</Text>
                    <Text style={styles.subtitulo}>{imovel.tipoLocacao}</Text>
                </View>
            </View>
            <View style={styles.line} />

            <View style={[styles.statusBanner, { backgroundColor: imovel.status === 'ALUGADO' ? '#F2C94C' : '#27AE60' }]}>
                <Text style={styles.statusText}>
                    {imovel.status === 'ALUGADO' ? '🏠 Alugado' : '🏠 Disponível'}
                </Text>
            </View>

            <View style={styles.cardDados}>
                <Text style={styles.cardTitle}>Dados</Text>
                <Text style={styles.infoText}><Text style={styles.bold}>Rua:</Text> {imovel.rua}, {imovel.numero}</Text>
                {imovel.complemento ? <Text style={styles.infoText}><Text style={styles.bold}>Complemento:</Text> {imovel.complemento}</Text> : null}
                <Text style={styles.infoText}><Text style={styles.bold}>Bairro:</Text> {imovel.bairro}</Text>
                <Text style={styles.infoText}><Text style={styles.bold}>CEP:</Text> {imovel.cep}</Text>
                <Text style={styles.infoText}><Text style={styles.bold}>Cidade/Estado:</Text> {imovel.cidade} - {imovel.estado}</Text>
            </View>

            {/* Seus próximos blocos de Contrato e Financeiro entram aqui abaixo */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 20,
        paddingTop: 80,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.darkBlue,
        fontStyle: 'italic'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 40
    },
    img: {
        width: '40%',
        height: 100,
        borderRadius: 10,
        resizeMode: 'cover'
    },
    tituloImovel: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.black,
        marginTop: 10
    },
    subtitulo: {
        fontSize: 16,
        color: COLORS.darkBlue,
        textTransform: 'capitalize'
    },
    statusBanner: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 15
    },
    statusText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16
    },
    cardDados: {
        borderWidth: 1,
        borderColor: COLORS.grey,
        borderRadius: 10,
        padding: 15,
        width: '100%'
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkBlue,
        marginBottom: 10
    },
    infoText: {
        fontSize: 16,
        marginVertical: 4
    },
    bold: {
        fontWeight: 'bold'
    },
    line: {
        width: '80%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
    },
    textHeader: {
        alignItems: 'center',
        gap: 5
    }
});