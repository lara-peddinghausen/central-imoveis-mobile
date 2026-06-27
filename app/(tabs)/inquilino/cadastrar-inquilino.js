import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { COLORS } from '../../../src/theme/colors.js';
import InputItem from '../../../src/components/InputItem/index.js';
import { useCallback, useState } from 'react';
import { api } from '../../../src/services/api.js';
import { FONT_SIZE } from '../../../src/theme/typography.js';
import { ButtonDark } from '../../../src/components/ButtonDark/index.js';
import { ButtonLight } from '../../../src/components/ButtonLight/index.js';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

export default function CadastrarInquilino() {
    const router = useRouter();

    // Captura o ID da locação e do imóvel vindos da tela de contrato
    const { locacaoId, imovelId } = useLocalSearchParams();

    const [submitted, setSubmitted] = useState(false);
    const [salvando, setSalvando] = useState(false);

    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');

    useFocusEffect(
        useCallback(() => {
            setNome('');
            setCpf('');
            setTelefone('');
            setEmail('');
            setDataNascimento('');
            setSubmitted(false);
            setSalvando(false);
        }, [])
    );

    const salvarInquilino = async () => {

        Alert.alert("Teste de Clique", "A função salvarInquilino começou a rodar!");

        if (salvando) return;
        setSubmitted(true);

        // Validação de campos obrigatórios básicos
        const camposInvalidos =
            !nome.trim() ||
            !cpf.trim();

        if (camposInvalidos) {
            Alert.alert('Campos Obrigatórios', 'Preencha todos os campos do inquilino (*)');
            return;
        }

        try {
            setSalvando(true);

            const dadosPessoa = {
                nome: nome.trim(),
                cpf: cpf.replace(/\D/g, ''), // Mantém apenas números
                telefone: telefone.trim(),
                email: email.trim(),
                dataNascimento: dataNascimento.trim()
            };

            // Cria a Pessoa/Inquilino no Backend
            const respostaPessoa = await api.post('/pessoa', dadosPessoa);

            // Captura o ID gerado pelo banco de dados
            const pessoaIdGerada = respostaPessoa.data?.id;

            console.log("=== DIAGNÓSTICO DE VÍNCULO ===");
            console.log("locacaoId:", locacaoId);
            console.log("pessoaIdGerada:", pessoaIdGerada);

            // 2. Só tenta fazer o PUT se os dois IDs existirem de verdade
            if (locacaoId && pessoaIdGerada) {

                const payload = {
                    id: Number(locacaoId),
                    pessoa: Number(pessoaIdGerada)
                };

                console.log("Enviando para o PUT /locacao:", payload);

                await api.put('/locacao', payload);

                Alert.alert('Sucesso!', 'Inquilino cadastrado e vinculado ao contrato com sucesso!', [
                    {
                        text: 'OK',
                        onPress: () => router.replace(`/imovel/${imovelId}`)
                    }
                ]);

            } else {
                console.warn("⚠️ Não foi possível vincular: IDs ausentes.");
                Alert.alert('Atenção', 'Inquilino criado, mas não foi possível vinculá-lo ao contrato.');
            }

        } catch (error) {
            console.error("Erro ao cadastrar inquilino:", error);
            if (error.response) {
                Alert.alert('Erro no Cadastro', error.response.data.mensagem || 'O servidor rejeitou os dados do inquilino.');
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
            <View style={styles.titleArea} >
                <View style={styles.linha} />
                <Text style={styles.titulo}>Inquilino</Text>
                <View style={styles.linha} />
            </View>

            <View style={styles.areaFormulario}>
                <Text style={styles.tituloFormulario}>Dados Pessoais</Text>

                <InputItem
                    label='Nome *'
                    placeholder='Digite o nome do inquilino'
                    value={nome}
                    onChangeText={setNome}
                    isRequired
                    error={submitted && !nome.trim()}
                />

                <InputItem
                    label='CPF *'
                    placeholder='Apenas números, sem pontos ou traços'
                    value={cpf}
                    keyboardType='numeric'
                    maxLength={11}
                    onChangeText={setCpf}
                    isRequired
                    error={submitted && !cpf.trim()}
                />

                <InputItem
                    label='Telefone'
                    placeholder='(xx) xxxxx-xxxx'
                    value={telefone}
                    keyboardType='phone-pad'
                    onChangeText={setTelefone}
                />

                <InputItem
                    label='E-mail'
                    placeholder='inquilino@email.com'
                    value={email}
                    keyboardType='email-address'
                    onChangeText={setEmail}
                />

                <InputItem
                    label='Data de nascimento'
                    placeholder='Formato: dd/mm/aaaa'
                    value={dataNascimento}
                    keyboardType='numeric'
                    maxLength={10}
                    onChangeText={setDataNascimento}
                />
            </View>

            <View style={styles.areaAlert}>
                <Text style={styles.textoAlert}>* Campos obrigatórios</Text>
            </View>

            <View style={styles.areaBotoes}>
                <ButtonLight title="Cancelar" onPress={() => router.replace('/home')} flex />
                <ButtonDark title={salvando ? "Salvando..." : "Cadastrar"} onPress={salvarInquilino} disabled={salvando} flex />
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
    tituloFormulario: {
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