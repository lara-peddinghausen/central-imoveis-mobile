import { Picker } from '@react-native-picker/picker';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { IconAlugado, IconDisponivel } from '../../src/components/Icons';
import ImovelItem from '../../src/components/ImovelItem';
import { COLORS } from '../../src/theme/colors';
import { Dropdown } from 'react-native-element-dropdown';


const properties = [
    { status: 'Alugado', titulo: 'Apartamento X', endereco: 'Rua da Matriz, 21', tipo: 'Residencial' },
    { status: 'Disponível', titulo: 'Apartamento Y', endereco: 'Avenida Brasil, 100', tipo: 'Comercial' },
    { status: 'Disponível', titulo: 'Casa Z', endereco: 'Travessa da Paz, 5', tipo: 'Residencial' },
];

export default function Home() {

    const navigation = useNavigation();
    const nomeUsuario = 'Lara';
    const [imovel, setImovel] = useState('Todos');
    const [filteredProperties, setFilteredProperties] = useState(properties);

    const dadosDropdown = [
        { label: 'Todos', value: 'Todos' },
        { label: 'Alugado', value: 'Alugado' },
        { label: 'Disponível', value: 'Disponível' },
    ];

    useEffect(() => {
        navigation.setOptions({
            title: `Olá, ${nomeUsuario}!`
        });
    }, [navigation, nomeUsuario]);

    useEffect(() => {
        if (imovel === 'Todos') {
            setFilteredProperties(properties);
        } else {
            setFilteredProperties(properties.filter(p => p.status === imovel));
        }
    }, [imovel]);

    const totalImoveis = properties.length;
    const imoveisAlugados = properties.filter(p => p.status === 'Alugado').length;
    const imoveisDisponiveis = properties.filter(p => p.status === 'Disponível').length;

    return (

        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >

            <Image
                source={require('../../src/assets/images/logo4.png')}
                style={styles.textoLogo}
            />

            <View style={styles.linha} />

            <View style={styles.areaLogo}>
                <Image
                    source={require('../../src/assets/images/logo3.png')}
                    style={styles.logo}
                />
                <View style={{ gap: 10 }}>
                    <View style={styles.areaTextoNumeros}>
                        <Text style={styles.textoNumeros}>
                            Total de Imóveis
                        </Text>
                        <Text style={styles.textoNumeros}>{totalImoveis}</Text>
                    </View>

                    <View style={styles.areaTextoNumeros}>
                        <IconAlugado />
                        <Text style={styles.textoNumeros}>
                            Alugados
                        </Text>
                        <Text style={styles.textoNumeros}>{imoveisAlugados}</Text>
                    </View>

                    <View style={styles.areaTextoNumeros}>
                        <IconDisponivel />
                        <Text style={styles.textoNumeros}>
                            Disponíveis
                        </Text>
                        <Text style={styles.textoNumeros}>{imoveisDisponiveis}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.linha} />

            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                containerStyle={styles.menuContainer}
                itemTextStyle={styles.itemTextStyle}
                activeColor={COLORS.babyBlue}
                iconColor={COLORS.darkBlue}
                data={dadosDropdown}
                labelField="label"
                valueField="value"
                value={imovel}
                dropdownPosition="bottom"
                onChange={item => {
                    setImovel(item.value);
                }}
            />

            {filteredProperties.map((item, index) => (
                <ImovelItem
                    key={index}
                    status={item.status}
                    titulo={item.titulo}
                    endereco={item.endereco}
                    tipo={item.tipo}
                />
            ))}

        </ScrollView >
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
        paddingVertical: 20
    },
    logo: {
        height: 150,
        width: 100,
        resizeMode: 'contain',
        alignSelf: 'flex-start',
    },
    textoLogo: {
        width: '100%',
        maxWidth: 250,
        height: 80,
        resizeMode: 'contain',
        marginBottom: -20
    },
    linha: {
        width: '80%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
    },
    areaLogo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30
    },
    areaTextoNumeros: {
        borderWidth: 1,
        borderColor: COLORS.darkBlue,
        borderRadius: 10,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 15,
        height: 40
    },
    textoNumeros: {
        fontSize: 16,
    },
    vetor: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    areaPicker: {
        borderWidth: 1,
        borderColor: COLORS.darkBlue,
        borderRadius: 10,
        overflow: 'hidden',
        width: 250,
        height: 40,
        justifyContent: 'center'
    },
    dropdown: {
        borderWidth: 1,
        borderColor: COLORS.darkBlue,
        borderRadius: 10,
        width: 250,
        height: 40,
        paddingHorizontal: 12,
        backgroundColor: COLORS.white,
    },
    menuContainer: {
        borderRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginTop: 4,
        width: 250,
        maxHeight: 200,
        elevation: 3,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        backgroundColor: COLORS.white,
        overflow: 'hidden',
    },
    itemTextStyle: {
        fontSize: 16,
        color: COLORS.black,
    },

})