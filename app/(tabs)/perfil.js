import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputItem from '../../src/components/InputItem';
import { COLORS } from '../../src/theme/colors';
import { FONT_SIZE } from '../../src/theme/typography';
import { ButtonDark } from '../../src/components/ButtonDark';
import { ButtonLight } from '../../src/components/ButtonLight';

export default function Perfil() {
    const router = useRouter();

    const handleLogout = async () => {
        // Limpa as credenciais salvas no celular
        await AsyncStorage.removeItem('usuario');
        // Expulsa o usuário das abas e o manda para a tela limpa de login
        router.replace('/login');
    };

    return (
        <View style={styles.container}>

            <View style={styles.titleArea} >
                <View style={styles.line} />
                <Text style={styles.title}>Meu perfil</Text>
                <View style={styles.line} />
            </View>

            <View style={styles.formArea}>
                <InputItem
                    label='Nome'
                    placeholder=''
                    value={''}
                    keyboardType='numeric'
                    onChangeText={() => { }}
                />
                <InputItem
                    label='E-mail'
                    placeholder=''
                    value={''}
                    onChangeText={() => { }}
                />
                <InputItem
                    label='Data de nascimento'
                    placeholder=''
                    value={''}
                    onChangeText={() => { }}
                />
            </View>



            <View style={styles.buttonArea}>
                <ButtonDark
                    title="Editar"
                    // onPress={cadastrar}
                    flex
                />
                {/* <ButtonLight
                    title="Cancelar"
                    // onPress={cancelar}
                    flex
                /> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        flexGrow: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 20,

    },
    titleArea: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    line: {
        width: '40%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
        marginHorizontal: 20,
    },
    title: {
        fontSize: FONT_SIZE.xlarge,
        color: COLORS.darkBlue,
        fontWeight: 'bold',
    },
    buttonArea: {
        flexDirection: 'row',
        width: 200
    },
    formArea: {
        borderWidth: 1,
        borderColor: COLORS.grey,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
        paddingBottom: 15,
    },
});

