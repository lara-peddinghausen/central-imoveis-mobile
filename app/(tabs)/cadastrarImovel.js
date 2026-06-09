import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { COLORS } from '../../src/theme/colors';
import InputItem from '../../src/components/InputItem';
import { useState } from 'react';
import { apiCorreios } from '../../src/services/api.js';
import CheckBox from '../../src/components/CheckBox/index.js';
import { FONT_SIZE } from '../../src/theme/typography.js';
import { ButtonDark } from '../../src/components/ButtonDark/index.js';
import { ButtonLight } from '../../src/components/ButtonLight/index.js';
import ImageSelector from '../../src/components/ImageSelector/index.js';


export default function CadastrarImovel() {

    const [nomeImovel, setNomeImovel] = useState('');
    const [cep, setCep] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');

    const [nomeProprietario, setNomeProprietario] = useState('');
    const [cpfProprietario, setCpfProprietario] = useState('');
    const [telefoneProprietario, setTelefoneProprietario] = useState('');
    const [emailProprietario, setEmailProprietario] = useState('');

    const [tipoLocacao, setTipoLocacao] = useState('residencial');

    // A tela de cadastro gerencia o dado bruto que vai para o banco
    const [imagemImovel, setImagemImovel] = useState(null);

    const handleSalvarImovel = () => {
        if (!imagemImovel) {
            Alert.alert("Aviso", "Por favor, adicione uma imagem do imóvel.");
            return;
        }

        // Aqui você faz o seu push/fetch enviando o objeto incluindo o 'imagemImovel'
        console.log("Pronto para enviar para o servidor. URI da imagem:", imagemImovel);
    };

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

                // Preenche os campos retornados pela API
                setRua(response.data.logradouro || '');
                setBairro(response.data.bairro || '');
                setCidade(response.data.localidade || '');
                setEstado(response.data.uf || '');

            } catch (error) {
                console.error("DEBUG CEP:", error.message);

                if (error.response) {
                    alert('Erro ao validar o CEP. Verifique o formato digitado.');
                } else if (error.request) {
                    alert('Não foi possível conectar ao serviço de CEP. Verifique sua conexão com a internet.');
                } else {
                    alert('Ocorreu um erro inesperado ao buscar o CEP.');
                }

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

            <View style={styles.titleArea} >
                <View style={styles.line} />
                <Text style={styles.title}>Cadastrar Imóvel</Text>
                <View style={styles.line} />
            </View>

            <View style={styles.formArea}>
                <Text style={styles.formTitle}> Preencha os dados do imóvel </Text>

                <InputItem
                    label='Nome do Imóvel*'
                    placeholder='Ex: Apartamento no Centro'
                    value={nomeImovel}
                    onChangeText={(texto) => setNomeImovel(texto)}
                />

                <InputItem
                    label='CEP*'
                    placeholder='Digite o CEP do imóvel'
                    value={cep}
                    keyboardType='numeric'
                    maxLength={8}
                    onChangeText={(cepLido) => {
                        setCep(cepLido);
                        buscarCepAutomatico(cepLido);
                    }}
                />

                <InputItem
                    label='Rua*'
                    placeholder='Nome da rua ou avenida'
                    value={rua}
                    onChangeText={(texto) => setRua(texto)}
                />

                <InputItem
                    label='Número*'
                    placeholder='Digite o número do imóvel'
                    value={numero}
                    keyboardType='numeric'
                    onChangeText={(texto) => setNumero(texto)}
                />

                <InputItem
                    label='Complemento'
                    placeholder='Apto, Bloco, Sala, etc. (Opcional)'
                    value={complemento}
                    onChangeText={(texto) => setComplemento(texto)}
                />

                <InputItem
                    label='Bairro*'
                    placeholder='Nome do bairro'
                    value={bairro}
                    onChangeText={(texto) => setBairro(texto)}
                />

                <InputItem
                    label='Cidade*'
                    placeholder='Cidade do imóvel'
                    value={cidade}
                    onChangeText={(texto) => setCidade(texto)}
                />

                <InputItem
                    label='Estado*'
                    placeholder='UF (Ex: SP, RJ, SC)'
                    value={estado}
                    maxLength={2}
                    onChangeText={(texto) => setEstado(texto)}
                />

                <View style={styles.fieldContainer}>
                    <Text style={styles.text}>Tipo de locação: *</Text>

                    <View style={styles.checkBoxArea}>
                        <CheckBox
                            label="Residencial"
                            isSelected={tipoLocacao === 'residencial'}
                            onPress={() => setTipoLocacao('residencial')}
                        />
                        <CheckBox
                            label="Temporada"
                            isSelected={tipoLocacao === 'temporada'}
                            onPress={() => setTipoLocacao('temporada')}
                        />
                    </View>
                </View>


                <ImageSelector onImageSelected={(uri) => setImagemImovel(uri)} />


            </View>


            <View style={styles.formArea}>
                <Text style={styles.formTitle}> Preencha os dados do proprietário </Text>
                <Text>(Opcional)</Text>
                <InputItem
                    label='Nome'
                    placeholder='Digite o nome do proprietário'
                    value={nomeProprietario}
                    onChangeText={(texto) => setNomeProprietario(texto)}
                />
                <InputItem
                    label='CPF'
                    placeholder='Apenas números, sem pontos ou traços'
                    value={cpfProprietario}
                    onChangeText={(texto) => setCpfProprietario(texto)}
                />
                <InputItem
                    label='Telefone'
                    placeholder='(xx) xxxxx-xxxx'
                    value={telefoneProprietario}
                    onChangeText={(texto) => setTelefoneProprietario(texto)}
                />
                <InputItem
                    label='E-mail'
                    placeholder='email@email.com'
                    value={emailProprietario}
                    onChangeText={(texto) => setEmailProprietario(texto)}
                />
            </View>

            <Text>* Campos obrigatórios</Text>

            <ButtonDark
                title="Cadastrar"
                // onPress={cadastrar}
                flex
            />
            <ButtonLight
                title="Cancelar"
                // onPress={cancelar}
                flex
            />


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
    titleArea: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    line: {
        width: '30%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
        marginHorizontal: 20,
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
    fieldContainer: {
        padding: 20,
        alignSelf: 'flex-start',
        marginVertical: 10,
        marginLeft: 15

    },
    text: {
        fontSize: FONT_SIZE.small,
        marginBottom: 10,
        color: COLORS.black,

    },
    checkBoxArea: {
        flexDirection: 'row',

    },
    imageArea: {
        padding: 20,
        backgroundColor: COLORS.white,
        alignItems: 'flex-start'
    },
});