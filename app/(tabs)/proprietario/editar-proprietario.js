import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../src/services/api.js';
import { COLORS } from '../../../src/theme/colors.js';
import { FONT_SIZE } from '../../../src/theme/typography.js';
import InputItem from '../../../src/components/InputItem/index.js';
import { ButtonDark } from '../../../src/components/ButtonDark/index.js';
import { ButtonLight } from '../../../src/components/ButtonLight/index.js';

export default function EditarProprietario() {
    const router = useRouter();

    // Captura os IDs vindos dos parâmetros da rota
    const { id, imovelId } = useLocalSearchParams();

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');

    const carregarProprietario = async () => {
        try {
            setCarregando(true);
            const response = await api.get(`/proprietario/${id}`);
            const proprietario = response.data;

            setNome(proprietario.nome);
            setCpf(proprietario.cpf);
            setTelefone(proprietario.telefone);
            setEmail(proprietario.email);

            if (proprietario.dataNascimento && proprietario.dataNascimento.includes('-')) {
                const [ano, mes, dia] = proprietario.dataNascimento.split('-');
                setDataNascimento(`${dia}/${mes}/${ano}`);
            } else {
                setDataNascimento(proprietario.dataNascimento);
            }

        } catch (error) {
            console.error("Erro ao carregar proprietário:", error);
            Alert.alert('Erro', 'Não foi possível carregar os dados.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        if (id) carregarProprietario();
    }, [id]);

    // Envia os dados atualizados como JSON
    const handleSalvar = async () => {
        if (salvando) return;
        setSubmitted(true);

        const camposInvalidos =
            !nome.trim();

        if (camposInvalidos) {
            Alert.alert('Campos Obrigatórios', 'Preencha todos os campos obrigatórios (*)');
            return;
        }

        try {
            setSalvando(true);

            const dadosParaEnvio = {
                id: parseInt(id),
                nome: nome.trim(),
                cpf: cpf.replace(/\D/g, ''),
                telefone: telefone.trim(),
                email: email.trim(),
                dataNascimento: dataNascimento.trim()
            };

            await api.put(`/proprietario/${id}`, dadosParaEnvio);

            Alert.alert('Sucesso!', 'Dados do proprietário atualizados!', [
                { text: 'OK', onPress: () => router.replace(`/imovel/${imovelId}`) }
            ]);

            setIsEditable(false);
        } catch (error) {
            console.error("Erro ao atualizar proprietário:", error);
            Alert.alert('Erro', 'O servidor rejeitou as atualizações.');
        } finally {
            setSalvando(false);
        }
    };

    if (carregando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.darkBlue} />
                <Text style={styles.loadingText}>Buscando dados do proprietário...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.titleArea}>
                <View style={styles.line} />
                <Text style={styles.title}>Proprietário</Text>
                <View style={styles.line} />
            </View>

            <View style={styles.formArea}>
                <Text style={styles.formTitle}> Dados do Proprietário </Text>

                <InputItem
                    label='Nome completo *'
                    placeholder='Digite o nome do proprietário'
                    value={nome}
                    onChangeText={setNome}
                    editable={isEditable}
                    disabled={!isEditable}
                    isRequired
                    error={submitted && !nome.trim()}
                />

                <InputItem label='CPF *' value={cpf} editable={false} />

                <InputItem
                    label='Telefone'
                    placeholder='(xx) xxxxx-xxxx'
                    value={telefone}
                    keyboardType='phone-pad'
                    onChangeText={setTelefone}
                    editable={isEditable}
                    disabled={!isEditable}
                />
                <InputItem
                    label='E-mail'
                    placeholder='email@email.com'
                    value={email}
                    keyboardType='email-address'
                    onChangeText={setEmail}
                    editable={isEditable}
                    disabled={!isEditable}
                />
                <InputItem
                    label='Data de nascimento'
                    placeholder='Formato: dd/mm/aaaa'
                    value={dataNascimento}
                    onChangeText={setDataNascimento}
                    editable={isEditable}
                    disabled={!isEditable}
                />
            </View>

            <View style={styles.buttonArea}>
                {isEditable ? (
                    <>
                        <ButtonLight
                            title="Cancelar"
                            onPress={() => {
                                carregarProprietario();
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
    buttonArea: {
        flexDirection: 'row',
        width: '90%',
        gap: 10
    }
});