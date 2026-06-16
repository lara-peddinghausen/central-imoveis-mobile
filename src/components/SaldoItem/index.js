import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { ButtonDark } from "../ButtonDark";
import { useRouter } from "expo-router";

export default function Saldo({ financeiro }) {

    const router = useRouter();

    if (!financeiro) return null;

    return (
        <View style={styles.cardImovel} >
            <View style={styles.areaTituloCardImovel}>
                <Text style={styles.tituloCardImovel}>Saldo atual</Text>
            </View>

            <View style={styles.areaConteudoCard}>
                <Text style={styles.bold}>
                    {}
                </Text>

            </View>

            <ButtonDark
                title="Ver detalhes"

            />

        </View >
    );
}

const styles = StyleSheet.create({
    cardImovel: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.grey,
        borderRadius: 10,
        width: '100%',
        maxWidth: 350,
        borderTopWidth: 0,
        paddingBottom: 15,
    },
    areaTituloCardImovel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        backgroundColor: COLORS.babyBlue,
        width: '100%',
        height: 40,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderColor: COLORS.grey,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    tituloCardImovel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.darkBlue
    },
    areaConteudoCard: {
        padding: 15,
        width: '100%'
    },
    img: {
        width: 130,
        height: 100,
        borderRadius: 8
    },
    areaTextoCard: {
        flex: 1,
        alignItems: 'flex-start',
    },
    enderecoImovel: {
        fontSize: 16,
        color: COLORS.grey,
    },
    tituloImovel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 4,
    },

    tipoImovel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.darkBlue,
        marginTop: 8,
    },
    infoText: {
        fontSize: 16,
        marginVertical: 2
    },
    bold: {
        fontWeight: 'bold'
    },
    line: {
        width: '80%',
        height: 2,
        backgroundColor: COLORS.darkBlue,
        marginVertical: 20,
        alignSelf: 'center'
    },
    tituloProprietario: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkBlue,
        textAlign: 'center',
        marginBottom: 10,
    }

})