import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../src/theme/colors.js";
import { FONT_SIZE } from "../src/theme/typography.js";
import { api } from '../src/services/api.js';
import { useCallback, useState } from "react";
import { ButtonDark } from "../src/components/ButtonDark/index.js";
import { ButtonLight } from "../src/components/ButtonLight/index.js";
import InputItem from "../src/components/InputItem/index.js";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";

export default function CadastroAdministrador() {
    const router = useRouter();

    const [submitted, setSubmitted] = useState(false);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [repetirSenha, setRepetirSenha] = useState('');

    useFocusEffect(
        useCallback(() => {
            setNome('');
            setEmail('');
            setDataNascimento('');
            setCpf('');
            setSenha('');
            setRepetirSenha('');
            setSubmitted(false);
        }, [])
    );

    // Função assíncrona que dispara os dados para o Spring Boot
    const cadastrar = async () => {
        setSubmitted(true);

        const camposObrigatoriosInvalidos =
            !nome.trim() ||
            !email.trim() ||
            !dataNascimento.trim() ||
            !cpf.trim() ||
            !senha.trim() ||
            !repetirSenha.trim();

        if (camposObrigatoriosInvalidos) {
            Alert.alert('Campos Obrigatórios', 'Por favor, preencha todos os campos obrigatórios');
            return;
        }

        if (senha !== repetirSenha) {
            Alert.alert('Erro de Validação', 'As senhas inseridas não coincidem.');
            return;
        }

        try {
            // Mapeia os dados como o record DadosCadastroAdministrador espera no Java
            const dadosParaEnvio = {
                nome,
                email,
                dataNascimento,
                cpf: cpf.replace(/\D/g, ''),
                senha
            };

            // Dispara para o endpoint mapeado em AdministradorController
            const resposta = await api.post('/administrador', dadosParaEnvio);

            if (resposta.status === 201 || resposta.status === 200) {
                Alert.alert('Sucesso!', 'Usuário cadastrado com sucesso.', [
                    { text: 'OK', onPress: () => router.replace('/login') }
                ]);
            }

        } catch (error) {
            console.error("Erro requisição cadastro:", error);
            if (error.response) {
                Alert.alert('Erro no Cadastro', 'O e-mail informado já pode estar em uso ou os dados são inválidos.');
            } else {
                Alert.alert('Erro de Rede', 'Não foi possível estabelecer conexão com o backend Spring Boot.');
            }
        }
    };

    const cancelar = () => {
        router.back();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>

            {/* Título */}
            <View style={styles.areaTitulo}>
                <View style={styles.linha} />
                <Text style={styles.titulo}>Cadastro</Text>
                <View style={styles.linha} />
            </View>

            {/* Formulário */}
            <View style={styles.areaFormulario}>
                <Text style={styles.areaSubtitulo}>Preencha seu cadastro</Text>
                <InputItem
                    label='Nome *'
                    placeholder='Insira seu nome'
                    value={nome}
                    onChangeText={(texto) => setNome(texto)}
                    isRequired
                    error={submitted && !nome.trim()}
                />
                <InputItem
                    label='E-mail *'
                    placeholder='Insira seu e-mail'
                    value={email}
                    onChangeText={(texto) => setEmail(texto)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    isRequired
                    error={submitted && !email.trim()}
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
                    label='Data de nascimento*'
                    placeholder='Formato: dd/mm/aaaa'
                    value={dataNascimento}
                    onChangeText={(texto) => setDataNascimento(texto)}
                    isRequired
                    error={submitted && !dataNascimento.trim()}
                />
                <InputItem
                    label='Senha*'
                    placeholder='Insira sua senha'
                    value={senha}
                    onChangeText={(texto) => setSenha(texto)}
                    secureTextEntry={true}
                    isRequired
                    error={submitted && !senha.trim()}

                />
                <InputItem
                    label='Repetir senha*'
                    placeholder='Insira sua senha novamente'
                    value={repetirSenha}
                    onChangeText={(texto) => setRepetirSenha(texto)}
                    secureTextEntry={true}
                    isRequired
                    error={submitted && !repetirSenha.trim()}
                />
            </View>

            <Text style={styles.textoObrigatorio}>* Campos obrigatórios</Text>

            {/* Botões */}
            <View style={styles.areaBotoes}>
                <ButtonLight title="Cancelar"
                    onPress={cancelar}
                    flex
                />

                <ButtonDark title="Cadastrar"
                    onPress={cadastrar}
                    flex
                />
            </View>


        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 20,
        paddingVertical: 30
    },
    linha: {
        width: '30%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
        marginHorizontal: 10
    },
    areaTitulo: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    titulo: {
        fontSize: FONT_SIZE.xlarge,
        fontWeight: 'bold',
        color: COLORS.darkBlue
    },
    areaFormulario: {
        alignItems: 'center',
        width: '90%',
        borderWidth: 1,
        borderColor: COLORS.lightGrey,
        borderRadius: 10,
        padding: 20,
        gap: 5

    },
    areaSubtitulo: {
        fontSize: FONT_SIZE.medium,
        fontWeight: '500',
        color: COLORS.black,
        marginBottom: 10,
    },
    textoObrigatorio: {
        marginTop: 10,
        alignSelf: 'flex-start',
        marginLeft: 5,
        fontStyle: 'italic',
        color: COLORS.red
    },
    areaBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        gap: 10
    },
})