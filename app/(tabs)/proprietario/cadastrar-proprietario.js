import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { COLORS } from '../../../src/theme/colors.js';
import InputItem from '../../../src/components/InputItem/index.js';
import { useState } from 'react';
import { api } from '../../../src/services/api.js';
import { FONT_SIZE } from '../../../src/theme/typography.js';
import { ButtonDark } from '../../../src/components/ButtonDark/index.js';
import { ButtonLight } from '../../../src/components/ButtonLight/index.js';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function CadastrarProprietario() {
    const router = useRouter();

    const { imovelId } = useLocalSearchParams();

    const [submitted, setSubmitted] = useState(false);

    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');

    const cadastrar = async () => {
    setSubmitted(true);

    const camposObrigatoriosInvalidos =
        !nome.trim() ||
        !cpf.trim();

    if (camposObrigatoriosInvalidos) {
        Alert.alert('Campos Obrigatórios', 'Preencha todos os campos obrigatórios (*)');
        return;
    }

    try {
        const dadosParaEnvio = {
            nome,
            cpf: cpf.replace(/\D/g, ''), 
            telefone,
            email,
            dataNascimento
        };

        // 1. Cadastra o Zezinho no banco
        const resposta = await api.post('/proprietario', dadosParaEnvio);

        if (resposta.status === 201 || resposta.status === 200) {

            const proprietarioIdGerado = resposta.data?.id;

            // 2. Se veio o imovelId pela URL, faz a mágica do vínculo automático
            if (imovelId && proprietarioIdGerado) {
                try {
                    // 🚀 Bate no @GetMapping("/{id}") que acabamos de adicionar no Java (Adeus erro 404!)
                    const respostaImovelAtual = await api.get(`/imovel/${imovelId}`);
                    const imovelDados = respostaImovelAtual.data;

                    // 🚀 Bate no @PostMapping("/vincular-proprietario") do Java (Adeus erro 403!)
                    await api.post('/imovel/vincular-proprietario', {
                        id: parseInt(imovelId),
                        nome: imovelDados.nome,       
                        status: imovelDados.status,   
                        fotoUrl: imovelDados.fotoUrl, 
                        proprietario: proprietarioIdGerado 
                    }, {
                        headers: {
                            'Authorization': api.defaults.headers.common['Authorization']
                        }
                    });

                    Alert.alert('Sucesso!', 'Proprietário cadastrado e vinculado ao imóvel com sucesso!', [
                        { text: 'OK', onPress: () => router.replace('/home') }
                    ]);
                    return; 

                } catch (erroVinculo) {
                    console.error("Erro ao vincular:", erroVinculo);
                    Alert.alert('Aviso', 'Proprietário cadastrado, mas houve uma falha ao vinculá-lo ao imóvel.');
                    router.replace('/home');
                    return;
                }
            }

            // Fallback caso a tela tenha sido aberta sozinha pelo menu
            Alert.alert('Sucesso!', 'Proprietário cadastrado com sucesso.', [
                { text: 'OK', onPress: () => router.replace('/home') }
            ]);
        }

    } catch (error) {
        console.error("Erro requisição cadastro proprietário:", error);
        if (error.response) {
            Alert.alert('Erro no Cadastro', error.response.data.mensagem || 'Dados inválidos inseridos.');
        } else {
            Alert.alert('Erro de Rede', 'Não foi possível conectar ao servidor.');
        }
    }
};

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.titleArea} >
                <View style={styles.line} />
                <Text style={styles.title}>Proprietário</Text>
                <View style={styles.line} />
            </View>

            <View style={styles.formArea}>
                <Text style={styles.formTitle}> Dados do Proprietário </Text>

                <InputItem
                    label='Nome *'
                    placeholder='Digite o nome do proprietário'
                    value={nome}
                    onChangeText={(texto) => setNome(texto)}
                    isRequired
                    error={submitted && !nome.trim()}
                />
                <InputItem
                    label='CPF *'
                    placeholder='Apenas números, sem pontos ou traços'
                    value={cpf}
                    keyboardType='numeric'
                    maxLength={11}
                    onChangeText={(texto) => setCpf(texto)}
                    isRequired
                    error={submitted && !cpf.trim()}
                />
                <InputItem
                    label='Telefone'
                    placeholder='(xx) xxxxx-xxxx'
                    value={telefone}
                    keyboardType='phone-pad'
                    onChangeText={(texto) => setTelefone(texto)}
                />
                <InputItem
                    label='E-mail'
                    placeholder='email@email.com'
                    value={email}
                    keyboardType='email-address'
                    onChangeText={(texto) => setEmail(texto)}
                />
                <InputItem
                    label='Data de nascimento'
                    placeholder='Formato: dd/mm/aaaa'
                    value={dataNascimento}
                    onChangeText={(texto) => setDataNascimento(texto)}
                />
            </View>

            <View style={styles.alertArea}>
                <Text style={styles.alertText}>* Campos obrigatórios</Text>
            </View>

            <View style={styles.buttonArea}>
                <ButtonDark title="Cadastrar" onPress={cadastrar} flex />
                <ButtonLight title="Cancelar" onPress={() => router.replace('/home')} flex />
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
    alertArea: {
        alignSelf: 'flex-start',
        marginLeft: 20
    },
    alertText: {
        fontStyle: 'italic',
        color: COLORS.red,
    },
    buttonArea: {
        flexDirection: 'row'
    }
});