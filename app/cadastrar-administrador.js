import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../src/theme/colors.js";
import { FONT_SIZE } from "../src/theme/typography.js";
import { api } from '../src/services/api.js';
import { useState } from "react";
import { ButtonDark } from "../src/components/ButtonDark/index.js";
import { ButtonLight } from "../src/components/ButtonLight/index.js";
import InputItem from "../src/components/InputItem/index.js";
import { useNavigation, useRouter } from "expo-router";

export default function CadastroAdministrador() {
    const router = useRouter();

    const [submitted, setSubmitted] = useState(false);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [repetirSenha, setRepetirSenha] = useState('');

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
        router.back(); // Volta para a tela anterior (Login) aproveitando a pilha do Stack
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.titleArea}>
                <View style={styles.line} />
                <Text style={styles.title}>Cadastro</Text>
                <View style={styles.line} />
            </View>

            <View style={styles.formArea}>
                <Text style={styles.subtitleArea}>Preencha seu cadastro</Text>
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

            <Text style={styles.requiredText}>* Campos obrigatórios</Text>

            <View style={styles.buttonsArea}>

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
    line: {
        width: '30%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
        marginHorizontal: 10
    },
    titleArea: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    title: {
        fontSize: FONT_SIZE.xlarge,
        fontWeight: 'bold',
        color: COLORS.darkBlue
    },
    formArea: {
        alignItems: 'center',
        width: '90%',
        borderWidth: 1,
        borderColor: COLORS.lightGrey,
        borderRadius: 10,
        padding: 20,
        gap: 5

    },
    subtitleArea: {
        fontSize: FONT_SIZE.medium,
        fontWeight: '500',
        color: COLORS.black,
        marginBottom: 10,
    },
    requiredText: {
        marginTop: 10,
        alignSelf: 'flex-start',
        marginLeft: 5,
        fontStyle: 'italic',
        color: COLORS.red
    },
    buttonsArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        gap: 10
    },
})