import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputItem from '../../src/components/InputItem';
import { COLORS } from '../../src/theme/colors';
import { FONT_SIZE } from '../../src/theme/typography';
import { ButtonDark } from '../../src/components/ButtonDark';
import { ButtonLight } from '../../src/components/ButtonLight';
import { useAuth } from '../../src/context/AuthContext';
import { useState, useEffect } from 'react';
import { api } from '../../src/services/api.js';

export default function Perfil() {
    const router = useRouter();
    const { user, atualizarDadosUser, logout } = useAuth(); // 🚀 Importado 'logout' do seu contexto se estiver disponível

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    // Controla se os inputs estão bloqueados ou liberados para edição
    const [isEditable, setIsEditable] = useState(false);

    // Formata a data vinda do banco (yyyy-mm-dd) para a tela (dd/mm/aaaa)
    const formatarDataParaExibicao = (dataStr) => {
        if (!dataStr) return '';
        if (dataStr.includes('-')) {
            const [ano, mes, dia] = dataStr.split('-');
            return `${dia}/${mes}/${ano}`;
        }
        return dataStr;
    };

    // Carrega os dados assim que a tela abre ou quando o objeto 'user' atualizar
    useEffect(() => {
        if (user) {
            setNome(user.nome || '');
            setEmail(user.email || '');
            setCpf(user.cpf || '');

            // Converte a data do banco antes de salvar no estado da tela
            setDataNascimento(formatarDataParaExibicao(user.dataNascimento));
        }
    }, [user]);

    // Logout
    const handleLogout = async () => {
        if (logout) {
            await logout();
        } else {
            await AsyncStorage.removeItem('usuario');
        }
        router.replace('/login');
    };

    // Dispara a caixa de confirmação de exclusão
    const handleConfirmarExclusao = () => {
        Alert.alert(
            "Excluir Conta",
            "Tem certeza que deseja excluir permanentemente seu perfil de administrador? Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir permanentemente",
                    style: "destructive",
                    onPress: handleExcluirPerfil
                }
            ]
        );
    };

    // Faz a requisição DELETE segura para o endpoint do Spring
    const handleExcluirPerfil = async () => {
        try {
            // Chama o endpoint de exclusão do perfil logado atual baseado no Token JWT
            const resposta = await api.delete('/administrador/perfil');

            if (resposta.status === 204 || resposta.status === 200) {
                Alert.alert('Conta Removida', 'Seu perfil de administrador foi excluído com sucesso.');

                // Limpa o estado de login e redireciona
                await handleLogout();
            }
        } catch (error) {
            console.error("Erro ao excluir administrador:", error);
            Alert.alert('Erro', 'Não foi possível excluir o seu perfil. Entre em contato com o suporte.');
        }
    };

    const handleSalvar = async () => {
        try {
            // Garante que se o estado ainda contiver hífens, converte para barras para o Java
            let dataFormatada = dataNascimento;
            if (dataNascimento.includes('-')) {
                const [ano, mes, dia] = dataNascimento.split('-');
                dataFormatada = `${dia}/${mes}/${ano}`;
            }

            const dadosAtualizados = {
                id: user.id,
                nome: nome.trim(),
                dataNascimento: dataFormatada
            };

            // Envia a requisição PUT para o endpoint do Spring Boot
            const resposta = await api.put('/administrador', dadosAtualizados);

            if (resposta.status === 200 || resposta.status === 204) {
                Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
                setIsEditable(false);

                if (atualizarDadosUser) {
                    // Atualiza o contexto global do App
                    atualizarDadosUser(dadosAtualizados);
                }
            }
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            Alert.alert('Erro', 'Não foi possível atualizar os dados no servidor.');
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {/* Título */}
            <View style={styles.areaTitulo} >
                <View style={styles.linha} />
                <Text style={styles.titulo}>Meu perfil</Text>
                <View style={styles.linha} />
            </View>

            {/* Formulário */}
            <View style={styles.areaFormulario}>
                <InputItem
                    label='Nome'
                    placeholder='Seu nome completo'
                    value={nome}
                    onChangeText={setNome}
                    editable={isEditable}
                />

                <InputItem
                    label='E-mail'
                    placeholder='seuemail@email.com'
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    editable={false}
                />

                <InputItem
                    label='CPF'
                    placeholder='Apenas números, sem pontos ou traços'
                    value={cpf}
                    onChangeText={setCpf}
                    keyboardType='numeric'
                    maxLength={11}
                    editable={false}
                />

                <InputItem
                    label='Data de nascimento'
                    placeholder='dd/mm/aaaa'
                    value={dataNascimento}
                    onChangeText={setDataNascimento}
                    editable={isEditable}
                />
            </View>

            {/* Botões */}
            <View style={styles.areaBotoes}>
                {isEditable ? (
                    <>
                        <ButtonLight
                            title="Cancelar"
                            onPress={() => {
                                // Restaura os dados originais e formata a data de volta
                                setNome(user.nome || '');
                                setEmail(user.email || '');
                                setCpf(user.cpf || '');
                                setDataNascimento(formatarDataParaExibicao(user.dataNascimento));
                                setIsEditable(false);
                            }}
                            flex
                        />
                        <ButtonDark
                            title="Salvar"
                            onPress={handleSalvar}
                            flex
                        />
                    </>
                ) : (
                    <>
                        <ButtonLight
                            title="Sair da Conta"
                            onPress={handleLogout}
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

            {/* Excluir perfil (Só exibe quando não estiver editando) */}
            {!isEditable && (
                <View style={styles.areaExcluir}>
                    <ButtonLight
                        title="Excluir Perfil Permanentemente"
                        onPress={handleConfirmarExclusao}
                        styleText={{ color: COLORS.red }}
                    />
                </View>
            )}
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
        paddingHorizontal: 10,
        gap: 20,
    },
    areaTitulo: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    linha: {
        width: '40%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
        marginHorizontal: 20,
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
    areaBotoes: {
        flexDirection: 'row',
        width: '90%',
        gap: 15,
    },
    areaExcluir: {
        width: '90%',
        marginTop: 10,
    }
});