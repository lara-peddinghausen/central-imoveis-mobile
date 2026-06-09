import { ScrollView, StyleSheet, View } from "react-native";
import InputItem from "../src/components/InputItem";
import { COLORS } from "../src/theme/colors";
import { FONT_SIZE } from "../src/theme/typography";


export default function CadastroAdministrador() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.areaTitulo}>
                <View style={styles.linha} />
                <Text style={styles.titulo}>Cadastro</Text>
                <View style={styles.linha} />
            </View>

            <View style={styles.areaFormulario}>
                <Text>Preencha seu cadastro</Text>
                <InputItem
                    label='Nome*'
                    placeholder='Insira seu nome'
                    value={''}
                    onChangeText={() => { }}
                />
                <InputItem
                    label='E-mail*'
                    placeholder='Insira seu e-mail'
                    value={''}
                    onChangeText={() => { }}
                />
                <InputItem
                    label='Data de nascimento*'
                    placeholder='Formato: dd/mm/aaaa'
                    value={''}
                    onChangeText={() => { }}
                />
                <InputItem
                    label='Senha*'
                    placeholder='Insira sua senha'
                    value={''}
                    onChangeText={() => { }}
                />
                <InputItem
                    label='Repetir senha*'
                    placeholder='Insira sua senha novamente'
                    value={''}
                    onChangeText={() => { }}
                />

                <Text style={styles.textoObrigatorio}>* Campos obrigatórios</Text>
            </View>

            <Text style={styles.textoObrigatorio}>* Campos obrigatórios</Text>

            <View style={styles.espacamentoBotoes}>
                <ButtonLight title="Cadastrar"
                    onPress={cadastrar}
                    flex
                />

                <ButtonDark title="Cancelar"
                    // onPress={entrar}
                    //onPress={() => router.replace('/home')}
                    flex
                />
            </View>


        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 20
    },
    linha: {
        width: '30%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
        marginHorizontal: 10
    },
    areaTitulo: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    titulo: {
        fontSize: FONT_SIZE.medium,
        fontWeight: 'bold',
        color: COLORS.darkBlue
    },
    areaFormulario: {
        alignItems: 'center',
        width: '80%',
        borderWidth: 1,
        borderColor: COLORS.lightGrey,
        borderRadius: 10,
        padding: 20,
        gap: 15

    },
    textoObrigatorio: {
        marginTop: 10,
        fontStyle: 'italic',
        color: COLORS.red
    },
    espacamentoBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
})