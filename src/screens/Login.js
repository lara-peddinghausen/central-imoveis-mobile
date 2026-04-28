import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            senha: ''
        }
    }

    entrar = () => {
        const { email, senha } = this.state;

        if (email === '' || senha === '') {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }


        // Simulação de login
        if (email === 'teste@gmail.com' && senha === '123') {
            Alert.alert('Login realizado com sucesso!');
        } else {
            Alert.alert('E-mail ou senha inválidos');
        }
    };

    cadastrar = () => {
        Alert.alert('Não implementado');
    }

    render() {
        return (
            <View style={styles.container}>

                <Image
                    source={require('../assets/images/logo1.png')}
                    style={styles.img}
                    resizeMode="contain"
                />

                <View style={styles.caixa}>

                    <View>
                        <Text style={{ marginLeft: 10 }}>E-mail</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='E-mail'
                            onChangeText={(loginEmail) => this.setState({ email: loginEmail })} />

                        <Text style={{ marginLeft: 10 }}>Senha</Text>
                        <TextInput style={styles.input}
                            placeholder='Senha'
                            onChangeText={(loginSenha) => this.setState({ senha: loginSenha })} />
                    </View>

                    <View style={styles.espacamentoBotoes}>
                        <TouchableOpacity style={styles.botao}
                        onPress={this.cadastrar}>
                            
                            <View style={styles.btnArea}>
                                <Text style={styles.btnTexto}>Cadastrar</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.botao, { backgroundColor: '#466DC2' }]}
                            onPress={this.entrar}>
                            <View style={styles.btnArea}>
                                <Text style={styles.btnTexto}>Entrar</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    img: {
        width: '100%',
        maxWidth: 300,
        height: undefined,
        aspectRatio: 1.12,
        alignSelf: 'center'
    },
    textoFrase: {
        fontSize: 20,
        textAlign: 'center',
        color: '#dd7d22',
        fontStyle: 'italic'
    },
    botao: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // width: 115,
        // height: 35,
        borderRadius: 30,
        backgroundColor: '#0B3B63',
        margin: 10
    },
    btnArea: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5
    },
    btnTexto: {
        fontWeight: 'bold',
        fontSize: 17,
        color: 'white'
    },
    espacamentoBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    input: {
        width: 250,
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        margin: 10,
    },
    caixa: {
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 24,
        borderColor: '#C8C8C8'
    }

})



