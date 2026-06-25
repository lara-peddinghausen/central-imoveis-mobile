import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { COLORS } from '../../src/theme/colors.js';
import InputItem from '../../src/components/InputItem/index.js';
import { useState } from 'react';
import { apiCorreios } from '../../src/services/api.js';
import { api } from '../../src/services/api.js';
import { useAuth } from '../../src/context/AuthContext.js';
import CheckBox from '../../src/components/CheckBox/index.js';
import { FONT_SIZE } from '../../src/theme/typography.js';
import { ButtonDark } from '../../src/components/ButtonDark/index.js';
import { ButtonLight } from '../../src/components/ButtonLight/index.js';
import ImageSelector from '../../src/components/ImageSelector/index.js';
import { useRouter } from 'expo-router';

export default function CadastrarImovel() {
    const router = useRouter();
    const { user } = useAuth();

    const [submitted, setSubmitted] = useState(false);

    const [salvando, setSalvando] = useState(false);

    const [nome, setNome] = useState('');
    const [cep, setCep] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [tipoLocacao, setTipoLocacao] = useState('RESIDENCIAL');
    const [foto, setFoto] = useState(null);

    const cadastrar = async () => {
        if (!user || !user.id) {
            Alert.alert('Erro de Autenticação', 'Usuário não identificado.');
            return;
        }

        // Se já estiver salvando, impede um segundo clique
        if (salvando) return;

        setSubmitted(true);

        const camposObrigatoriosInvalidos =
            !nome.trim() ||
            !cep.trim() ||
            !rua.trim() ||
            !numero.trim() ||
            !bairro.trim() ||
            !cidade.trim() ||
            !estado.trim();

        if (camposObrigatoriosInvalidos) {
            Alert.alert('Campos Obrigatórios', 'Preencha todos os campos obrigatórios (*)');
            return;
        }

        try {
            setSalvando(true); // Ativa o loading assim que passa na validação

            const formData = new FormData();

            // Injetando textos do imóvel mapeados no Spring Boot
            formData.append('nome', nome);
            formData.append('rua', rua);
            formData.append('cep', cep.replace(/\D/g, ''));
            formData.append('numero', numero);
            formData.append('complemento', complemento);
            formData.append('bairro', bairro);
            formData.append('cidade', cidade);
            formData.append('estado', estado);
            formData.append('tipoLocacao', tipoLocacao);
            formData.append('status', 'DISPONIVEL');
            formData.append('administrador', user.id);

            // Injetando o arquivo físico da imagem
            if (foto) {
                const uriParts = foto.split('.');
                const fileType = uriParts[uriParts.length - 1];

                formData.append('foto', {
                    uri: foto,
                    name: `imovel_${Date.now()}.${fileType}`,
                    type: `image/${fileType}`
                });
            }

            const resposta = await api.post('/imovel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (resposta.status === 201 || resposta.status === 200) {
                // Pega o ID do imóvel que o Spring Boot acabou de salvar
                const imovelCriadoId = resposta.data?.id;

                Alert.alert(
                    'Sucesso!',
                    'Imóvel cadastrado com sucesso! Deseja vincular um proprietário a ele agora?',
                    [
                        {
                            text: 'Não',
                            onPress: () => router.replace('/home'),
                            style: 'cancel'
                        },
                        {
                            text: 'Sim, cadastrar propriétário',
                            // Passa o id do imóvel adiante via parâmetro
                            onPress: () => router.replace(`/proprietario/cadastrar-proprietario?imovelId=${imovelCriadoId}`),
                            style: 'default'
                        }
                    ],
                    { cancelable: false } // Impede o usuário de fechar o alerta clicando fora dele, obrigando a escolher uma opção
                );
            }

        } catch (error) {
            console.error("Erro requisição cadastro:", error);
            Alert.alert('Erro no Cadastro', 'O backend rejeitou os dados.');
        } finally {
            setSalvando(false); // Desativa o loading caso dê erro para o usuário tentar de novo
        }
    }


async function buscarCepAutomatico(cepDigitado) {
    const cepLimpo = cepDigitado.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
        try {
            const response = await apiCorreios.get(`/${cepLimpo}/json`);
            if (response.data.erro === true || response.data.erro === 'true') {
                alert('Este CEP não foi encontrado. Por favor, verifique os números.');
                limparCamposEndereco();
                return;
            }
            setRua(response.data.logradouro || '');
            setBairro(response.data.bairro || '');
            setCidade(response.data.localidade || '');
            setEstado(response.data.uf || '');
        } catch (error) {
            console.error("DEBUG CEP:", error.message);
            limparCamposEndereco();
        }
    }
}


    function limparCamposEndereco() {
        setRua('');
        setBairro('');
        setCidade('');
        setEstado('');
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >

            {/* Título */}
            <View style={styles.areaTitulo} >
                <View style={styles.linha} />
                <Text style={styles.titulo}>Cadastrar Imóvel</Text>
                <View style={styles.linha} />
            </View>

            {/* Formulário */}
            <View style={styles.areaFormulario}>
                <Text style={styles.tituloFormulario}> Preencha os dados do imóvel </Text>

                <InputItem
                    label='Nome do Imóvel *'
                    placeholder='Ex: Apartamento no Centro'
                    value={nome}
                    onChangeText={(texto) => setNome(texto)}
                    isRequired
                    error={submitted && !nome.trim()}
                />
                <InputItem
                    label='CEP *'
                    placeholder='Digite o CEP do imóvel'
                    value={cep}
                    keyboardType='numeric'
                    maxLength={8}
                    onChangeText={(cepLido) => {
                        setCep(cepLido);
                        buscarCepAutomatico(cepLido);
                    }}
                    isRequired
                    error={submitted && !cep.trim()}
                />
                <InputItem
                    label='Rua *'
                    placeholder='Nome da rua ou avenida'
                    value={rua}
                    onChangeText={(texto) => setRua(texto)}
                    isRequired
                    error={submitted && !rua.trim()}
                />
                <InputItem
                    label='Número *'
                    placeholder='Digite o número do imóvel'
                    value={numero}
                    onChangeText={(texto) => setNumero(texto)}
                    isRequired
                    error={submitted && !numero.trim()}
                />
                <InputItem
                    label='Complemento'
                    placeholder='Apto, Bloco, Sala, etc. (Opcional)'
                    value={complemento}
                    onChangeText={(texto) => setComplemento(texto)}
                />
                <InputItem
                    label='Bairro *'
                    placeholder='Nome do bairro'
                    value={bairro}
                    onChangeText={(texto) => setBairro(texto)}
                    isRequired
                    error={submitted && !bairro.trim()}
                />
                <InputItem
                    label='Cidade *'
                    placeholder='Cidade do imóvel'
                    value={cidade}
                    onChangeText={(texto) => setCidade(texto)}
                    isRequired
                    error={submitted && !cidade.trim()}
                />
                <InputItem
                    label='Estado *'
                    placeholder='UF (Ex: SP, RJ, SC)'
                    value={estado}
                    maxLength={2}
                    onChangeText={(texto) => setEstado(texto)}
                    isRequired
                    error={submitted && !estado.trim()}
                />

                {/* Tipo de locação */}
                <View style={styles.areaTipo}>
                    <Text style={styles.texto}>Tipo de locação: *</Text>
                    <View style={styles.areaCheckBox}>
                        <CheckBox
                            label="Residencial"
                            isSelected={tipoLocacao === 'RESIDENCIAL'}
                            onPress={() => setTipoLocacao('RESIDENCIAL')}
                        />
                        <CheckBox
                            label="Temporada"
                            isSelected={tipoLocacao === 'TEMPORADA'}
                            onPress={() => setTipoLocacao('TEMPORADA')}
                        />
                    </View>
                </View>

                {/* Foto */}
                <View style={styles.areaImg}>
                    <ImageSelector textoBtn = "+ Adicionar imagem" onImageSelected={(uri) => setFoto(uri)} />
                </View>
            </View>

            <View style={styles.areaAlert}>
                <Text style={styles.textoAlert}>* Campos obrigatórios</Text>
            </View>

            {/* Botões */}
            <View style={styles.areaBotoes}>
                <ButtonDark title={salvando ? 'Salvando Imóvel...' : 'Cadastrar Imóvel'} onPress={cadastrar} disabled={salvando} flex />
                <ButtonLight title="Cancelar" onPress={() => router.replace('/home')} flex />
            </View>
        </ScrollView >
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
    tituloFormulario: {
        fontSize: FONT_SIZE.large,
        color: COLORS.darkBlue,
        fontWeight: 'bold',
        marginVertical: 15,
    },
    areaTipo: {
        padding: 20,
        alignSelf: 'flex-start',
        marginVertical: 10,
        marginLeft: 15
    },
    texto: {
        fontSize: FONT_SIZE.small,
        marginBottom: 10,
        color: COLORS.black,
    },
    areaCheckBox: {
        flexDirection: 'row',
    },
    areaImg: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 10,
        alignItems: 'center'
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
        flexDirection: 'row'
    }
});