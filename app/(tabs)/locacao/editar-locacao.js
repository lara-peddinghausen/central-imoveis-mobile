import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../src/services/api.js';
import { COLORS } from '../../../src/theme/colors.js';
import { FONT_SIZE } from '../../../src/theme/typography.js';
import InputItem from '../../../src/components/InputItem/index.js';
import { ButtonDark } from '../../../src/components/ButtonDark/index.js';
import { ButtonLight } from '../../../src/components/ButtonLight/index.js';

export default function EditarLocacao() {
    const router = useRouter();

    // Captura o ID da locação e do imóvel associado pelos parâmetros da rota
    const { locacaoId, imovelId } = useLocalSearchParams();

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [dataInicio, setDataInicio] = useState('');
    const [dataTermino, setDataTermino] = useState('');
    const [aluguel, setAluguel] = useState('');
    const [observacao, setObservacao] = useState('');
    const [status, setStatus] = useState('ATIVA');
    const [idPessoa, setIdPessoa] = useState(null);

    // Função para buscar os dados atuais da locação no Spring Boot
    const carregarLocacao = async () => {
        try {
            setCarregando(true);
            const response = await api.get(`/locacao/${locacaoId}`);
            const locacao = response.data;

            setStatus(locacao.status);
            setObservacao(locacao.observacao || '');
            setIdPessoa(locacao.pessoa || null);

            // Formata o valor do aluguel vindo como Double/BigDecimal para String legível
            if (locacao.aluguel) {
                setAluguel(locacao.aluguel.toFixed(2).replace('.', ','));
            }

            // Trata a conversão de data para padrão brasileiro (dd/mm/aaaa)
            if (locacao.dataInicio && locacao.dataInicio.includes('-')) {
                const [ano, mes, dia] = locacao.dataInicio.split('-');
                setDataInicio(`${dia}/${mes}/${ano}`);
            } else {
                setDataInicio(locacao.dataInicio || '');
            }

            if (locacao.dataTermino && locacao.dataTermino.includes('-')) {
                const [ano, mes, dia] = locacao.dataTermino.split('-');
                setDataTermino(`${dia}/${mes}/${ano}`);
            } else {
                setDataTermino(locacao.dataTermino || '');
            }

        } catch (error) {
            console.error("Erro ao carregar locação:", error);
            Alert.alert('Erro', 'Não foi possível carregar os dados desta locação.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        if (locacaoId) {
            carregarLocacao();
        }
    }, [locacaoId]);

    // Envia as atualizações modificadas para o servidor
    const handleSalvar = async () => {
        if (salvando) return;
        setSubmitted(true);

        const camposInvalidos = !aluguel.trim();

        if (camposInvalidos) {
            Alert.alert('Campos Obrigatórios', 'Preencha todos os campos obrigatórios (*)');
            return;
        }

        try {
            setSalvando(true);

            // Limpa a máscara monetária brasileira para enviar o float correto esperado pelo Java
            const aluguelLimpo = aluguel
                .replace('R$', '')
                .replace(/\s/g, '')
                .replace('.', '')
                .replace(',', '.');

            const dadosParaEnvio = {
                id: parseInt(locacaoId, 10),
                dataInicio: dataInicio,
                dataTermino: dataTermino,
                aluguel: parseFloat(aluguelLimpo),
                observacao: observacao.trim(),
                pessoa: idPessoa?.id ? idPessoa.id : (typeof idPessoa === 'number' || typeof idPessoa === 'string' ? parseInt(idPessoa, 10) : null) //variável de estado que guarda a pessoa ou o ID dela
            };

            await api.put('/locacao', dadosParaEnvio);

            Alert.alert('Sucesso!', 'Contrato de locação atualizado com sucesso!', [
                { text: 'OK', onPress: () => router.replace(`/imovel/${imovelId}`) }
            ]);

            setIsEditable(false);
        } catch (error) {
            console.error("Erro ao atualizar locação:", error);
            Alert.alert('Erro', 'O servidor rejeitou as atualizações do contrato.');
        } finally {
            setSalvando(false);
        }
    };

    if (carregando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.darkBlue} />
                <Text style={styles.loadingText}>Buscando dados do contrato...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.titleArea}>
                <View style={styles.line} />
                <Text style={styles.title}>Locação</Text>
                <View style={styles.line} />
            </View>

            <View style={styles.formArea}>
                <Text style={styles.formTitle}> Dados do Contrato </Text>

                <InputItem
                    label='Data de Início'
                    value={dataInicio}
                    editable={false}
                />

                <InputItem
                    label='Data de Término'
                    value={dataTermino}
                    editable={false}
                />

                <InputItem
                    label='Valor do Aluguel *'
                    placeholder='Ex: 1500,00'
                    value={aluguel}
                    onChangeText={setAluguel}
                    keyboardType='numeric'
                    editable={isEditable}
                    disabled={!isEditable}
                    isRequired
                    error={submitted && !aluguel.trim()}
                />

                <InputItem
                    label='Observação (Opcional)'
                    placeholder='Adicione detalhes sobre o contrato'
                    value={observacao}
                    onChangeText={setObservacao}
                    multiline={true}
                    numberOfLines={3}
                    editable={isEditable}
                    disabled={!isEditable}
                />
            </View>

            {isEditable && (
                <View style={styles.areaAlert}>
                    <Text style={styles.textoAlert}>* Campos obrigatórios</Text>
                </View>
            )}

            <View style={styles.buttonArea}>
                {isEditable ? (
                    <>
                        <ButtonLight
                            title="Cancelar"
                            onPress={() => {
                                carregarLocacao();
                                setIsEditable(false);
                            }}
                            flex
                        />
                        <ButtonDark
                            title={salvando ? "Salvando..." : "Salvar"}
                            onPress={handleSalvar}
                            disabled={salvando}
                            flex
                        />
                    </>
                ) : (
                    <>
                        <ButtonLight
                            title="Voltar"
                            onPress={() => router.replace(`/imovel/${imovelId}`)}
                            flex
                        />
                        <ButtonDark
                            title="Editar"
                            onPress={() => setIsEditable(true)}
                            flex
                        />
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        flexGrow: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 20,
        paddingVertical: 20
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
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    line: {
        width: '25%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
        marginHorizontal: 15,
    },
    title: {
        fontSize: FONT_SIZE.xlarge,
        color: COLORS.darkBlue,
        fontWeight: 'bold',
    },
    formArea: {
        borderWidth: 1,
        borderColor: COLORS.grey,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
        paddingBottom: 15,
    },
    formTitle: {
        fontSize: FONT_SIZE.large,
        color: COLORS.darkBlue,
        fontWeight: 'bold',
        marginVertical: 15,
    },
    areaAlert: {
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginBottom: -10
    },
    textoAlert: {
        fontStyle: 'italic',
        color: COLORS.red,
    },
    buttonArea: {
        flexDirection: 'row',
        width: '90%',
        gap: 10
    }
});