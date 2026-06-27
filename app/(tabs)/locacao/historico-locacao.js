import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { api } from '../../../src/services/api.js';
import { COLORS } from '../../../src/theme/colors.js';
import { FONT_SIZE } from '../../../src/theme/typography.js';
import { ButtonLight } from '../../../src/components/ButtonLight/index.js';
import HistoricoLocacaoItem from '../../../src/components/HistoricoLocacaoItem/index.js';

export default function HistoricoLocacoes() {
    const router = useRouter();

    // Se você quiser o histórico de um imóvel específico, passe o imovelId por parâmetro.
    // Se deixar vazio, ele pode buscar o histórico geral do sistema.
    const { imovelId } = useLocalSearchParams();

    const [locacoes, setLocacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    // Busca o histórico de locações no backend de forma atualizada
   const carregarHistorico = useCallback(async () => {
    try {
        setCarregando(true);
        
        const url = imovelId ? `/locacao/historico/${imovelId}` : '/locacao';
        const response = await api.get(url);
        
        // Captura a lista bruta vinda do backend (tratando paginação ou array direto)
        let listaBruta = [];
        if (response.data && response.data.content) {
            listaBruta = response.data.content;
        } else {
            listaBruta = response.data || [];
        }

        // Aplica a ordenação combinada (Ativo primeiro + Ordem de Pilha pelo ID)
        const listaOrdenada = listaBruta.sort((a, b) => {
            const aAtivo = a.status?.toUpperCase() === 'ATIVA';
            const bAtivo = b.status?.toUpperCase() === 'ATIVA';

            // Se 'a' for ATIVA e 'b' não, 'a' sobe para o topo
            if (aAtivo && !bAtivo) return -1;
            // Se 'b' for ATIVA e 'a' não, 'b' sobe para o topo
            if (!aAtivo && bAtivo) return 1;

            // Se ambos tiverem o mesmo peso de status (ex: dois inativos), 
            // ordena como PILHA: o ID maior (mais recente) aparece primeiro
            return b.id - a.id;
        });

        // 3. Salva a lista já perfeitamente ordenada no seu estado
        setLocacoes(listaOrdenada);

    } catch (error) {
        console.error("Erro ao carregar histórico de locações:", error);
        Alert.alert('Erro', 'Não foi possível carregar o histórico de contratos.');
    } finally {
        setCarregando(false);
    }
}, [imovelId]);

    // Dispara a busca sempre que a tela entrar em foco
    useFocusEffect(
        useCallback(() => {
            carregarHistorico();
        }, [carregarHistorico])
    );

    // Função auxiliar para estilizar dinamicamente a cor do status do contrato
    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'ATIVA':
                return { color: COLORS.green, fontWeight: 'bold' };
            case 'CANCELADA':
                return { color: COLORS.red, fontWeight: 'bold' };
            case 'FINALIZADA':
                return { color: COLORS.grey, fontWeight: 'bold' };
            default:
                return { color: COLORS.black };
        }
    };

    if (carregando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.darkBlue} />
                <Text style={styles.loadingText}>Carregando histórico de contratos...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {/* Cabeçalho da Tela */}
            <View style={styles.titleArea}>
                <View style={styles.line} />
                <Text style={styles.title}>Histórico</Text>
                <View style={styles.line} />
            </View>

            {/* Lista de Contratos Encontrados */}
            {locacoes.map((item, index) => (
                <HistoricoLocacaoItem
                    key={item.id || index}
                    locacao={item}
                    imovelId={imovelId}
                />
            ))}

            {/* Botão de Voltar */}
            <View style={styles.buttonArea}>
                <ButtonLight
                    title="Voltar"
                    onPress={() => imovelId ? router.replace(`/imovel/${imovelId}`) : router.replace('/home')}
                    flex
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        flexGrow: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 15,
        gap: 20,
        paddingBottom: 30,
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
    titleArea: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    line: {
        width: '20%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
        marginHorizontal: 15,
    },
    title: {
        fontSize: FONT_SIZE.xlarge,
        color: COLORS.darkBlue,
        fontWeight: 'bold',
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.grey,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 30,
    },
    cardContrato: {
        borderWidth: 1,
        borderColor: COLORS.grey,
        borderRadius: 10,
        width: '100%',
        maxWidth: 350,
        borderTopWidth: 0,
        backgroundColor: COLORS.white,
        overflow: 'hidden',
        marginBottom: 10,
    },
    areaTituloCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.babyBlue,
        width: '100%',
        height: 40,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderColor: COLORS.grey,
    },
    tituloCard: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.darkBlue,
    },
    statusText: {
        fontSize: 14,
    },
    areaConteudoCard: {
        padding: 15,
        gap: 4,
    },
    textoInformacao: {
        fontSize: 16,
        //  marginVertical: 2
    },
    bold: {
        fontWeight: 'bold'
    },
    buttonArea: {
        width: '100%',
        maxWidth: 350,
        marginTop: 10,
    }
});