import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { api } from '../../../src/services/api';
import { COLORS } from '../../../src/theme/colors';
import { IconAlugado, IconContrato, IconDisponivel } from '../../../src/components/Icons';
import { FONT_SIZE } from '../../../src/theme/typography';
import DadosImovelItem from '../../../src/components/DadosImovelItem';
import ButtonLocacao from '../../../src/components/ButtonLocacao';


export default function DetalhesImovel() {
    // Captura o ID vindo da URL
    const { id } = useLocalSearchParams();

    const [imovel, setImovel] = useState(null);
    const [carregando, setCarregando] = useState(true);

    const BASE_URL = 'http://10.0.2.2:8080';

    useFocusEffect(
        useCallback(() => {
            async function buscarDadosDoBanco() {
                try {
                    // Busca segura e autenticada direta do Spring Boot usando o ID
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
        }, [id])
    );

    // Loading na tela
    if (carregando) {
        return (
            <View style={styles.areaLoading}>
                <ActivityIndicator size="large" color={COLORS.darkBlue} />
                <Text style={styles.textoLoading}>Carregando dados protegidos...</Text>
            </View>
        );
    }

    // Se o imóvel não for encontrado
    if (!imovel) {
        return (
            <View style={styles.areaLoading}>
                <Text style={styles.textoLoading}>Imóvel não encontrado.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.linha} />

            {/* Header */}
            <View style={styles.header}>
                <Image
                    source={imovel.fotoUrl ? { uri: `${BASE_URL}${imovel.fotoUrl}` } : require('../../../src/assets/images/logo3.png')}
                    style={styles.img}
                />
                <View style={styles.textoHeader}>
                    <Text style={styles.tituloImovel}>{imovel.nome}</Text>

                    <Text style={styles.subtitulo}>
                        {imovel.tipoLocacao
                            ? imovel.tipoLocacao.charAt(0).toUpperCase() + imovel.tipoLocacao.slice(1).toLowerCase()
                            : ''}
                    </Text>
                </View>
            </View>

            <View style={styles.linha} />

            {/* Banner */}
            <View style={[styles.statusBanner, { backgroundColor: imovel.status === 'ALUGADO' ? COLORS.yellowCDI : COLORS.green }]}>
                <Text>
                    {imovel.status === 'ALUGADO' ?
                        (<View style={styles.areaStatus}>
                            <IconAlugado color={COLORS.darkBlue} />
                            <Text style={styles.textoStatus}>Alugado</Text>
                        </View>) :
                        (<View style={styles.areaStatus}>
                            <IconDisponivel color={COLORS.darkBlue} />
                            <Text style={styles.textoStatus}>Disponível</Text>
                        </View>)}
                </Text>
            </View>

            {/* Card com dados do imóvel */}
            <DadosImovelItem imovel={imovel} />

            <View style={styles.linha} />

            {/* Área dos botões da locação */}
            <View style={styles.areaSubtitulo}>
                <IconContrato color={COLORS.darkBlue} />
                <Text style={styles.subtitulo}>Locações</Text>
            </View>
            <ButtonLocacao
                imovelId={imovel?.id}
                statusImovel={imovel?.status}
            />

            <View style={styles.linha} />

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 20,
        paddingTop: 80,
    },
    areaLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white
    },
    textoLoading: {
        marginTop: 10,
        color: COLORS.darkBlue,
        fontStyle: 'italic'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    img: {
        width: '50%',
        height: 120,
        borderRadius: 10,
        resizeMode: 'cover'
    },
    textoHeader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20,
    },
    tituloImovel: {
        fontSize: FONT_SIZE.xlarge,
        fontWeight: 'bold',
        color: COLORS.black,
        textAlign: 'left',
    },
    subtitulo: {
        fontSize: FONT_SIZE.large,
        color: COLORS.darkBlue,
        fontWeight: 'bold',
        textAlign: 'left',
        marginTop: 4,
    },
    statusBanner: {
        width: '100%',
        padding: 10,
        alignItems: 'center',
        marginVertical: 15
    },
    textoStatus: {
        color: COLORS.darkBlue,
        fontWeight: 'bold',
        fontSize: FONT_SIZE.large,
        marginLeft: -30
    },
    linha: {
        width: '80%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
    },
    areaStatus: {
        flexDirection: 'row',
        gap: 40
    },
    areaSubtitulo: {
        gap: 2,
        alignItems: 'center'
    }
});