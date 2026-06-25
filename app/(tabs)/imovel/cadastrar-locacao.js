import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { COLORS } from '../../../src/theme/colors.js';
import InputItem from '../../../src/components/InputItem/index.js';
import { useState } from 'react';
import { api } from '../../../src/services/api.js';
import { FONT_SIZE } from '../../../src/theme/typography.js';
import { ButtonDark } from '../../../src/components/ButtonDark/index.js';
import { ButtonLight } from '../../../src/components/ButtonLight/index.js';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function CadastrarLocacao() {
    const router = useRouter();

    // Captura o id do imóvel vindo da tela de detalhes
    const { imovelId } = useLocalSearchParams();

    const [submitted, setSubmitted] = useState(false);
    const [salvando, setSalvando] = useState(false);

    const [status, setStatus] = useState('ATIVA');
    const [dataInicio, setDataInicio] = useState('');
    const [dataTermino, setDataTermino] = useState('');
    const [aluguel, setAluguel] = useState('');
    const [observacao, setObservacao] = useState('');

    const cadastrar = async () => {
        if (salvando) return;
        setSubmitted(true);

        const camposObrigatoriosInvalidos =
            !dataInicio.trim() ||
            !dataTermino.trim() ||
            !aluguel.trim();

        if (camposObrigatoriosInvalidos) {
            Alert.alert('Campos Obrigatórios', 'Preencha todos os campos obrigatórios (*)');
            return;
        }

        try {
            setSalvando(true);

            // Limpa o valor monetário para o formato BigDecimal esperado pelo Java
            const aluguelLimpo = aluguel
                .replace('R$', '')
                .replace(/\s/g, '')
                .replace('.', '')
                .replace(',', '.');

            const dadosParaEnvio = {
                status,
                dataInicio: dataInicio.trim(),   // Espera o formato "dd/mm/aaaa"
                dataTermino: dataTermino.trim(), // Espera o formato "dd/mm/aaaa"
                aluguel: parseFloat(aluguelLimpo),
                observacao: observacao.trim(),
                imovel: imovelId ? parseInt(imovelId) : null // Passa o ID do imóvel
            };

            // Salva a locação vinculada ao imóvel
            const resposta = await api.post('/locacao', dadosParaEnvio);

            if (resposta.status === 201 || resposta.status === 200) {
                const locacaoIdGerado = resposta.data?.id;

                Alert.alert(
                    'Sucesso!',
                    'Contrato de locação registrado! Deseja cadastrar os dados do inquilino para este contrato agora?',
                    [
                        {
                            text: 'Não, fazer depois',
                            onPress: () => router.replace(`/imovel/${imovelId}`),
                            style: 'cancel'
                        },
                        {
                            text: 'Sim, cadastrar inquilino',
                            // Envia o id da locação gerada para a próxima tela fazer o vínculo
                            onPress: () => router.replace(`/pessoa/cadastrar-pessoa?locacaoId=${locacaoIdGerado}&imovelId=${imovelId}`),
                            style: 'default'
                        }
                    ],
                    { cancelable: false }
                );
            }

        } catch (error) {
            console.error("Erro requisição cadastro locação:", error);
            if (error.response) {
                Alert.alert('Erro no Cadastro', error.response.data.mensagem || 'O servidor rejeitou os dados da locação.');
            } else {
                Alert.alert('Erro de Rede', 'Não foi possível conectar ao servidor.');
            }
        } finally {
            setSalvando(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {/* Área do título */}
            <View style={styles.areaTitulo} >
                <View style={styles.linha} />
                <Text style={styles.titulo}>Locação</Text>
                <View style={styles.linha} />
            </View>

            {/* Formulário */}
            <View style={styles.areaFormulario}>
                <Text style={styles.formTitle}> Dados do Contrato </Text>

                <InputItem
                    label='Data de Início *'
                    placeholder='Formato: dd/mm/aaaa'
                    value={dataInicio}
                    keyboardType='numeric'
                    maxLength={10} 
                    onChangeText={setDataInicio}
                    isRequired
                    error={submitted && !dataInicio.trim()}
                />

                <InputItem
                    label='Data de Término *'
                    placeholder='Formato: dd/mm/aaaa'
                    value={dataTermino}
                    keyboardType='numeric'
                    maxLength={10}
                    onChangeText={setDataTermino}
                    isRequired
                    error={submitted && !dataTermino.trim()}
                />

                <InputItem
                    label='Valor do Aluguel *'
                    placeholder='Ex: 1500,00'
                    value={aluguel}
                    keyboardType='numeric'
                    onChangeText={setAluguel}
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
                />
            </View>

            <View style={styles.areaAlert}>
                <Text style={styles.textoAlert}>* Campos obrigatórios</Text>
            </View>

            {/* Botões */}
            <View style={styles.areaBotoes}>
                <ButtonDark title={salvando ? "Salvando..." : "Cadastrar"} onPress={cadastrar} disabled={salvando} flex />
                <ButtonLight title="Cancelar" onPress={() => router.replace(`/imovel/${imovelId}`)} flex />
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
    areaTitulo: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    linha: {
        width: '25%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
        marginHorizontal: 15,
    },
    titulo: {
        fontSize: FONT_SIZE.xlarge,
        color: COLORS.darkBlue,
        fontWeight: 'bold',
    },
    areaFormulario: {
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
        marginLeft: 20
    },
    textoAlert: {
        fontStyle: 'italic',
        color: COLORS.red,
    },
    areaBotoes: {
        flexDirection: 'row',
        width: '90%',
        gap: 15
    }
});