import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../../src/services/api.js';
import { COLORS } from '../../../src/theme/colors.js';
import { FONT_SIZE } from '../../../src/theme/typography.js';
import InputItem from '../../../src/components/InputItem/index.js';
import { ButtonDark } from '../../../src/components/ButtonDark/index.js';
import { ButtonLight } from '../../../src/components/ButtonLight/index.js';

export default function EditarInquilino() {
    const router = useRouter();

    // Captura o id da pessoa (inquilino) e do imóvel para o retorno da rota
    const { pessoaId, imovelId } = useLocalSearchParams();

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');

    // Função para buscar os dados atuais do inquilino do banco
    const carregarInquilino = async () => {
        try {
            setCarregando(true);
            const idLimpo = parseInt(pessoaId, 10);
            const response = await api.get(`/pessoa/${idLimpo}`);
            const inquilino = response.data;

            setNome(inquilino.nome);
            setCpf(inquilino.cpf);
            setTelefone(inquilino.telefone || '');
            setEmail(inquilino.email || '');

            // Converte a data do Java para formato brasileiro (dd/mm/aaaa)
            if (inquilino.dataNascimento && inquilino.dataNascimento.includes('-')) {
                const [ano, mes, dia] = inquilino.dataNascimento.split('-');
                setDataNascimento(`${dia}/${mes}/${ano}`);
            } else {
                setDataNascimento(inquilino.dataNascimento || '');
            }

        } catch (error) {
            console.error("Erro ao carregar dados do inquilino:", error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do inquilino.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        if (pessoaId) {
            carregarInquilino();
        }
    }, [pessoaId]);

    // Envia os dados editados ao backend via @PutMapping
    const handleSalvar = async () => {
        if (salvando) return;
        setSubmitted(true);

        if (!nome.trim()) {
            Alert.alert('Campos Obrigatórios', 'O nome do inquilino é obrigatório (*)');
            return;
        }

        try {
            setSalvando(true);

            const dadosParaEnvio = {
                id: parseInt(pessoaId, 10), 
                nome: nome.trim(),
                email: email.trim() || null,
                telefone: telefone.trim() || null,
                dataNascimento: dataNascimento.trim() || null
            };

            await api.put('/pessoa', dadosParaEnvio);

            Alert.alert('Sucesso!', 'Dados do inquilino atualizados!', [
                { text: 'OK', onPress: () => router.replace(`/imovel/${imovelId}`) }
            ]);

            setIsEditable(false);
        } catch (error) {
            console.error("Erro ao atualizar inquilino:", error);
            Alert.alert('Erro', 'O servidor rejeitou as alterações do inquilino.');
        } finally {
            setSalvando(false);
        }
    };

    if (carregando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.darkBlue} />
                <Text style={styles.loadingText}>Buscando dados do inquilino...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.titleArea}>
                <View style={styles.line} />
                <Text style={styles.title}>Inquilino</Text>
                <View style={styles.line} />
            </View>

            <View style={styles.formArea}>
                <Text style={styles.formTitle}> Dados do Inquilino </Text>

                <InputItem
                    label='Nome completo *'
                    placeholder='Digite o nome do inquilino'
                    value={nome}
                    onChangeText={setNome}
                    editable={isEditable}
                    disabled={!isEditable}
                    isRequired
                    error={submitted && !nome.trim()}
                />

                <InputItem
                    label='CPF'
                    value={cpf}
                    editable={false}
                />

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
                    keyboardType='numeric'
                    maxLength={10}
                    onChangeText={setDataNascimento}
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
                                carregarInquilino();
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