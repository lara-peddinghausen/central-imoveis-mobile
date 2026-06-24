import { useNavigation } from 'expo-router';
import React, { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { IconAlugado, IconDisponivel } from '../../src/components/Icons';
import ImovelItem from '../../src/components/ImovelItem';
import { COLORS } from '../../src/theme/colors';
import { Dropdown } from 'react-native-element-dropdown';
import { AuthContext } from '../../src/context/AuthContext'; // Garantido o uso correto
import { api } from '../../src/services/api';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FONT_SIZE } from '../../src/theme/typography';


export default function Home() {

    const navigation = useNavigation();
    // Pegando o user de dentro do AuthContext
    const { user, signOut } = useContext(AuthContext);

    // Estados para controlar o perfil dinâmico vindo do Spring Boot
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [carregandoPerfil, setCarregandoPerfil] = useState(true);

    const [imovel, setImovel] = useState('Todos');

    // Começa com a lista de imóveis vazia para preencher com o banco de dados
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);

    const dadosDropdown = [
        { label: 'Todos', value: 'Todos' },
        { label: 'Alugado', value: 'ALUGADO' },
        { label: 'Disponível', value: 'DISPONIVEL' }
    ];

    // Busca o perfil do usuário e os imóveis do banco
    useFocusEffect(
        useCallback(() => {
            async function carregarDadosIniciais() {
                try {
                    // Recupera o token salvo direto do celular antes de fazer a busca
                    const tokenSalvo = await AsyncStorage.getItem('@centralImoveis:token');

                    // Se o token existir, garante que ele está nos cabeçalhos da API para evitar o 403
                    if (tokenSalvo) {
                        api.defaults.headers.common['Authorization'] = `Bearer ${tokenSalvo}`;
                    }

                    // Busca o perfil do administrador
                    const perfilResponse = await api.get('/administrador/perfil');
                    if (perfilResponse.data && perfilResponse.data.nome) {
                        const primeiroNome = perfilResponse.data.nome.split(' ')[0];
                        setNomeUsuario(primeiroNome);
                    }

                    // Passa o ID do administrador logado na URL se ele existir
                    let urlImoveis = '/imovel';
                    if (user && user.id) {
                        urlImoveis = `/imovel?administradorId=${user.id}`;
                    }

                    // Busca os imóveis atualizados do backend
                    const imoveisResponse = await api.get(urlImoveis);

                    if (imoveisResponse.data && imoveisResponse.data.content) {
                        setProperties(imoveisResponse.data.content);
                        setFilteredProperties(imoveisResponse.data.content);
                    }

                } catch (error) {
                    console.log("Erro ao carregar dados do backend:", error.message);


                    // Adicione este log detalhado para vermos no terminal o motivo exato do 403
                    if (error.response) {
                        console.log("Status do Erro:", error.response.status);
                        console.log("Detalhes do Erro do Spring:", error.response.data);
                    }
                } finally {
                    setCarregandoPerfil(false);
                }
            }

            carregarDadosIniciais();

            // Retorno limpo obrigatório do useCallback
            return () => { };
        }, [user])
    );

    // Atualiza o título do cabeçalho
    useEffect(() => {
        navigation.setOptions({
            title: `Olá, ${nomeUsuario || 'Usuário'}!`,
            headerStyle: {
                backgroundColor: COLORS.darkBlue, 
                height: 90, 
            },
            headerTitleStyle: {
                fontSize: FONT_SIZE.xlarge,
                fontWeight: 'bold',
                color: COLORS.white,
            },
            headerTitleAlign: 'center',
            headerStatusBarHeight: 40,
        });
    }, [navigation, nomeUsuario]);

    // Filtro do dropdown
    useEffect(() => {
        if (imovel === 'Todos') {
            setFilteredProperties(properties);
        } else {
            setFilteredProperties(properties.filter(p => p.status === imovel));
        }
    }, [imovel, properties]);

    // Contadores dinâmicos baseados nos dados do banco
    const totalImoveis = properties.length;
    const imoveisAlugados = properties.filter(p => p.status === 'ALUGADO' || p.status === 'Alugado').length;
    const imoveisDisponiveis = properties.filter(p => p.status === 'DISPONIVEL' || p.status === 'Disponível').length;

    if (carregandoPerfil) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white }}>
                <ActivityIndicator size="large" color={COLORS.darkBlue} />
            </View>
        );
    }

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
                        <Text style={styles.textoNumeros}>Total de Imóveis</Text>
                        <Text style={styles.textoNumeros}>{totalImoveis}</Text>
                    </View>

                    <View style={styles.areaTextoNumeros}>
                        <IconAlugado />
                        <Text style={styles.textoNumeros}>Alugados</Text>
                        <Text style={styles.textoNumeros}>{imoveisAlugados}</Text>
                    </View>

                    <View style={styles.areaTextoNumeros}>
                        <IconDisponivel />
                        <Text style={styles.textoNumeros}>Disponíveis</Text>
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

            {filteredProperties.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum imóvel encontrado.</Text>
            ) : (
                filteredProperties.map((item, index) => (
                    <ImovelItem
                        key={item.id || index}
                        imovel={item}
                    />
                ))
            )}
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
    emptyText: {
        fontSize: 16,
        color: COLORS.grey,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    }
});