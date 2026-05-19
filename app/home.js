import { Picker } from '@react-native-picker/picker';
import { useNavigation } from 'expo-router';
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button01 } from '../components/Button01';


export default function Home() {

    const navigation = useNavigation();

    const nomeUsuario = 'Lara';

    const [imovel, setImovel] = useState('');

    useEffect(() => {
        navigation.setOptions({
            title: `Olá, ${nomeUsuario}!`
        });
    }, []);

    return (

        <View style={styles.container}>

            <Image
                source={require('../assets/images/logo4.png')}
                style={styles.textoLogo}
            />

            <View style={styles.linha} />

            <View style={styles.areaLogo}>
                <Image
                    source={require('../assets/images/logo3.png')}
                    style={styles.logo}
                />
                <View style={{ gap: 10 }}>
                    <View style={styles.areaTextoNumeros}>
                        <Text style={styles.textoNumeros}>
                            Total de Imóveis
                        </Text>
                        <Text style={styles.textoNumeros}>3</Text>
                    </View>

                    <View style={styles.areaTextoNumeros}>
                        <Image
                            source={require('../assets/images/vetorAlugado.png')}
                            style={[styles.vetor, { marginRight: -30 }]}
                        />

                        <Text style={styles.textoNumeros}>
                            Alugados
                        </Text>

                        <Text style={styles.textoNumeros}>1</Text>
                    </View>

                    <View style={styles.areaTextoNumeros}>
                        <Image
                            source={require('../assets/images/vetorDisponivel.png')}
                            style={[styles.vetor, { marginRight: -15 }]}
                        />
                        <Text style={styles.textoNumeros}>
                            Disponíveis
                        </Text>

                        <Text style={styles.textoNumeros}>2</Text>
                    </View>
                </View>

            </View>

            <View style={styles.linha} />

            <View style={styles.areaPicker}>
                <Picker
                    selectedValue={imovel}
                    onValueChange={(itemValue) => setImovel(itemValue)}
                >
                    <Picker.Item label="Filtro" value="" />
                    <Picker.Item label="Alugado" value="Alugado" />
                    <Picker.Item label="Disponível" value="Disponível" />
                </Picker>
            </View>

            <View>
                <View style={styles.areaTituloCardImovel}>
                    <Image
                        source={require('../assets/images/vetorAlugado.png')}
                        style={styles.vetor}
                    />
                    <Text style={styles.tituloCardImovel}>Alugado</Text>
                </View>
                <View>
                    <Image></Image>
                    <Text></Text>
                    <Text></Text>
                    <Text></Text>
                </View>
                {/* <Button01
                    title="Ver detalhes"
                // onPress={() => navigation.navigate('/cadastroImovel')} 
                /> */}
            </View>

        </View>


    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 20
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
        backgroundColor: '#0B3B63',
    },
    areaLogo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30
    },
    areaTextoNumeros: {
        borderWidth: 2,
        borderColor: '#0B3B63',
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
        fontWeight: 'bold'
    },
    vetor: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    areaPicker: {
        borderWidth: 2,
        borderColor: '#0B3B63',
        borderRadius: 10,
        overflow: 'hidden',
        width: 250,
        height: 40,
        justifyContent: 'center'
    },
    areaTituloCardImovel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#F4CC68',
        width: 350,
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10
    },
    tituloCardImovel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0B3B63'
    }


})



