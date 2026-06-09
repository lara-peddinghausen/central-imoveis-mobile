import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../src/theme/colors';
import InputItem from '../../src/components/InputItem';
import { useState } from 'react';
import apiCorreios from '../../src/services/api.js';

export default function CadastrarImovel() {

    const [cep, setCep] = useState('');

    const [dados, setDados] = useState('')

    async function buscar() {
        if (cep == '') {
            alert('Digite um CEP válido')
            return
        }

        try {
            const response = await apiCorreios.get(`/${cep}/json`)
            console.log(response.data);
            setDados(response.data)
        } catch (error) {
            console.log('ERROR: ' + error);
        }
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
                    onChangeText={(cepLido) => setCep(cepLido)}
                />
                <InputItem
                    label='Bairro*'
                    placeholder='Nome do bairro'
                    value={''}
                    onChangeText={() => { }}
                />
                <InputItem
                    label='Rua*'
                    placeholder='Nome da rua'
                    value={''}
                    onChangeText={() => { }}
                />
                <InputItem
                    label='Número*'
                    placeholder='Número do prédio/casa'
                    value={''}
                    onChangeText={() => { }}
                />
                <InputItem
                    label='Complemento'
                    placeholder='Apartamento, bloco, etc (opcional)'
                    value={''}
                    onChangeText={() => { }}
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

