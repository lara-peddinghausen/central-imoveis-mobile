import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../src/services/api.js';
import { COLORS } from '../../../src/theme/colors.js';
import { FONT_SIZE } from '../../../src/theme/typography.js';
import { ButtonLight } from '../../../src/components/ButtonLight/index.js';

export default function DetalhesContrato() {
    const router = useRouter();
    const { locacaoId, imovelId } = useLocalSearchParams();

    const [locacao, setLocacao] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function obterDadosContrato() {
            try {
                setCarregando(true);
                const response = await api.get(`/locacao/${locacaoId}`);
                setLocacao(response.data);
            } catch (error) {
                console.error("Erro ao carregar contrato:", error);
                Alert.alert("Erro", "Não foi possível carregar as informações deste contrato.");
            } finally {
                setCarregando(false);
            }
        }
        if (locacaoId) obterDadosContrato();
    }, [locacaoId]);

    if (carregando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.darkBlue} />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.cardContrato}>
                <View style={styles.areaTitulo}>
                    <Text style={styles.titulo}>Dados do Contrato</Text>
                </View>

                <View style={styles.areaConteudo}>
                    <Text style={styles.textoInformacao}><Text style={styles.bold}>Status: </Text>{locacao?.status}</Text>
                    <Text style={styles.textoInformacao}><Text style={styles.bold}>Início: </Text>{locacao?.dataInicio}</Text>
                    <Text style={styles.textoInformacao}><Text style={styles.bold}>Término: </Text>{locacao?.dataTermino}</Text>
                    <Text style={styles.textoInformacao}><Text style={styles.bold}>Valor do Aluguel: </Text>R$ {locacao?.aluguel?.toFixed(2).replace('.', ',')}</Text>
                    {locacao?.observacao ? <Text style={styles.textoInformacao}><Text style={styles.bold}>Obs: </Text>{locacao.observacao}</Text> : null}

                    {locacao?.pessoa ? (
                        <View>
                            <View style={styles.line} />
                            <Text style={styles.tituloSecao}>Inquilino Vinculado</Text>
                            <Text style={styles.textoInformacao}><Text style={styles.bold}>Nome: </Text>{locacao.pessoa.nome}</Text>
                            <Text style={styles.textoInformacao}><Text style={styles.bold}>CPF: </Text>{locacao.pessoa.cpf}</Text>
                            <Text style={styles.textoInformacao}><Text style={styles.bold}>E-mail: </Text>{locacao.pessoa.email}</Text>
                            <Text style={styles.textoInformacao}><Text style={styles.bold}>Telefone: </Text>{locacao.pessoa.telefone}</Text>
                        </View>
                    ) : null}
                </View>
            </View>

            <View style={{ width: '90%', maxWidth: 350 }}>
                <ButtonLight
                    title="Voltar para o Histórico"
                    onPress={() => router.replace(`/(tabs)/locacao/historico-locacao?imovelId=${imovelId}`)}
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
        alignItems: 'center',
        gap: 20
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white
    },
    cardContrato: {
        borderWidth: 1,
        borderColor: COLORS.grey,
        borderRadius: 10,
        width: '90%',
        maxWidth: 350,
        borderTopWidth: 0,
        paddingBottom: 15
    },
    areaTitulo: {
        backgroundColor: COLORS.babyBlue,
        width: '100%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderColor: COLORS.grey,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkBlue
    },
    areaConteudo: {
        padding: 15
    },
    textoInformacao: {
        fontSize: 16,
        marginVertical: 3
    },
    bold: {
        fontWeight: 'bold'
    },
    line: {
        width: '80%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
        marginVertical: 15,
        alignSelf: 'center'
    },
    tituloSecao: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.darkBlue,
        textAlign: 'center',
        marginBottom: 10
    }
});