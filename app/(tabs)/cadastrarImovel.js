import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../src/theme/colors';
import InputItem from '../../src/components/InputItem';
import { useState } from 'react';
import apiCorreios from '../../src/services/api.js';

export default function CadastrarImovel() {

    const [cep, setCep] = useState('');
    const [bairro, setBairro] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');

    async function buscarCepAutomatico(cepDigitado) {
        const cepLimpo = cepDigitado.replace(/\D/g, '');

        if (cepLimpo.length === 8) {
            try {
                const response = await apiCorreios.get(`/${cepLimpo}/json`);

                // 1. Trata se o ViaCEP retornou que o CEP não existe na base deles
                if (response.data.erro === true || response.data.erro === 'true') {
                    alert('Este CEP não foi encontrado. Por favor, verifique os números.');
                    limparCamposEndereco();
                    return;
                }

                // Se deu certo, preenche os campos
                setBairro(response.data.bairro || '');
                setRua(response.data.logradouro || '');

            } catch (error) {
                // 2 e 3. Trata erros de rede, servidor fora do ar ou requisições malformadas
                console.log('Erro na requisição do ViaCEP:', error);

                if (error.response) {
                    // O servidor respondeu com um status fora do range 2xx (Ex: 400 Bad Request)
                    alert('Erro ao validar o CEP. Verifique o formato digitado.');
                } else if (error.request) {
                    // A requisição foi feita mas não houve resposta (Sem internet)
                    alert('Não foi possível conectar ao serviço de CEP. Verifique sua conexão com a internet.');
                } else {
                    // Outros erros inesperados
                    alert('Ocorreu um erro inesperados ao buscar o CEP.');
                }

                limparCamposEndereco();
            }
        }
    }

    // Função auxiliar para limpar a tela se o CEP falhar (evita lixo na tela)
    function limparCamposEndereco() {
        setBairro('');
        setRua('');
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >

            <View style={styles.areaTitulo} >
                <View style={styles.linha} />
                <Text style={styles.titulo}>Cadastro de Imóvel</Text>
                <View style={styles.linha} />
            </View>

            <View style={styles.areaFormulario}>
                <Text style={styles.tituloFormulario}>
                    Preencha os dados do imóvel
                </Text>
                <InputItem
                    label='Nome do Imóvel*'
                    placeholder='Ex: Apartamento no Centro'
                    value={''}
                    onChangeText={() => { }}
                />
                <InputItem
                    label='Cep*'
                    placeholder='Cep do imóvel'
                    value={cep}
                    keyboardType='numeric' // Abre o teclado numérico no celular
                    maxLength={8} // Impede o usuário de digitar mais de 8 números
                    onChangeText={(cepLido) => {
                        setCep(cepLido);
                        buscarCepAutomatico(cepLido); // Dispara a busca a cada dígito
                    }}
                />
                <InputItem
                    label='Bairro*'
                    placeholder='Nome do bairro'
                    value={bairro} // Agora exibe o que veio da API
                    onChangeText={(texto) => setBairro(texto)}
                />

                <InputItem
                    label='Rua*'
                    placeholder='Nome da rua'
                    value={rua} // Agora exibe o que veio da API
                    onChangeText={(texto) => setRua(texto)}
                />

                <InputItem
                    label='Número*'
                    placeholder='Número do prédio/casa'
                    value={numero}
                    onChangeText={(texto) => setNumero(texto)}
                />

                <InputItem
                    label='Complemento'
                    placeholder='Apartamento, bloco, etc (opcional)'
                    value={complemento}
                    onChangeText={(texto) => setComplemento(texto)}
                />
            </View>


        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 20,
        paddingVertical: 20
    },
    areaTitulo: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    linha: {
        width: '30%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
        marginHorizontal: 20,
    },
    titulo: {
        fontSize: 24,
        color: COLORS.darkBlue,
        fontWeight: 'bold',

    },
    areaFormulario: {
        borderWidth: 1,
        borderColor: COLORS.grey,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
    },
    tituloFormulario: {
        fontSize: 18,
        color: COLORS.darkBlue,
        fontWeight: 'bold',
        marginVertical: 10,
    }
})

