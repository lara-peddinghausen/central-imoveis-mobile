import { ScrollView, StyleSheet, View } from "react-native";
import InputItem from "../../src/components/InputItem";
import { COLORS } from "../../src/theme/colors";
import { FONT_SIZE } from "../../src/theme/typography";
import { api } from '../../src/services/api.js';
import { useState } from "react";

export default function CadastroAdministrador() {

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [senha, setSenha] = useState('');
    const [repetirSenha, setRepetirSenha] = useState('');

    // 2. Função assíncrona que dispara os dados para o Spring Boot
    const cadastrar = async () => {
        // Validação de campos em branco
        if (!nome || !email || !dataNascimento || !senha || !repetirSenha) {
            Alert.alert('Campos Obrigatórios', 'Por favor, preencha todos os campos marcados com *.');
            return;
        }

        // Validação das senhas iguais
        if (senha !== repetirSenha) {
            Alert.alert('Erro de Validação', 'As senhas inseridas não coincidem.');
            return;
        }

        try {
            // Mapeia os dados exatamente como o record DadosCadastroAdministrador espera no Java
            const dadosParaEnvio = {
                nome: nome,
                email: email,
                dataNascimento: dataNascimento, // Certifique-se de que o Back trate a String ou mande no formato correto
                senha:senha, // Exemplo ou substitua pela propriedade do seu DTO
                // Se o seu DTO no back usar apenas nome, email e senha, envie apenas o necessário!
            };

            // Dispara para o endpoint que você mapeou no seu AdministradorController
            const resposta = await api.post('/administrador', {
                nome,
                email,
                dataNascimento,
                senha // Envia o que o seu DTO real de cadastro pede
            });

            if (resposta.status === 201 || resposta.status === 200) {
                Alert.alert('Sucesso!', 'Usuário cadastrado com sucesso.', [
                    { text: 'OK', onPress: () => router.replace('/login') } // Manda de volta pro login
                ]);
            }

        } catch (error) {
            if (error.response) {
                Alert.alert('Erro no Cadastro', 'O e-mail informado já pode estar em uso ou os dados são inválidos.');
            } else {
                Alert.alert('Erro de Rede', 'Não foi possível estabelecer conexão com o backend Spring Boot.');
            }
        }
    };

    // 3. Função do botão cancelar
    const cancelar = () => {
        router.back(); // Volta para a tela anterior (Login) aproveitando a pilha do Stack
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.areaTitulo}>
                <View style={styles.linha} />
                <Text style={styles.titulo}>Cadastro</Text>
                <View style={styles.linha} />
            </View>

            <View style={styles.areaFormulario}>
                <Text>Preencha seu cadastro</Text>
                <InputItem
                    label='Nome *'
                    placeholder='Insira seu nome'
                    value={nome}
                    onChangeText={setNome}
                />
                <InputItem
                    label='E-mail *'
                    placeholder='Insira seu e-mail'
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <InputItem
                    label='Data de nascimento*'
                    placeholder='Formato: dd/mm/aaaa'
                    value={dataNascimento}
                    onChangeText={setDataNascimento}
                />
                <InputItem
                    label='Senha*'
                    placeholder='Insira sua senha'
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={true}
                />
                <InputItem
                    label='Repetir senha*'
                    placeholder='Insira sua senha novamente'
                    value={repetirSenha}
                    onChangeText={setRepetirSenha}
                    secureTextEntry={true}
                />

                <Text style={styles.textoObrigatorio}>* Campos obrigatórios</Text>
            </View>

            <Text style={styles.textoObrigatorio}>* Campos obrigatórios</Text>

            <View style={styles.espacamentoBotoes}>
                <ButtonLight title="Cadastrar"
                    onPress={cadastrar}
                    flex
                />

                <ButtonDark title="Cancelar"
                    onPress={cancelar}
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
        fontSize: FONT_SIZE.medium,
        fontWeight: 'bold',
        color: COLORS.darkBlue
    },
    areaFormulario: {
        alignItems: 'center',
        width: '80%',
        borderWidth: 1,
        borderColor: COLORS.lightGrey,
        borderRadius: 10,
        padding: 20,
        gap: 15

    },
    textoObrigatorio: {
        marginTop: 10,
        fontStyle: 'italic',
        color: COLORS.red
    },
    espacamentoBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%'
    },
})