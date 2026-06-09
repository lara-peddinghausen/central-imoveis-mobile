import { Image, StyleSheet, Text, View } from "react-native";
import { IconAlugado, IconDisponivel } from "../Icons";
import { COLORS } from "../../theme/colors";
import { IMAGES } from '../../assets/images';
import { ButtonDark } from "../ButtonDark";

export default function ImovelItem({
    status,
    titulo,
    endereco,
    tipo
}) {

    const corStatus =
        status === 'Alugado'
            ? COLORS.yellowCDI
            : COLORS.green;

    const iconStatus =
        status === 'Alugado'
            ? <IconAlugado color={COLORS.darkBlue} />
            : <IconDisponivel color={COLORS.darkBlue} />;

    return (
        <View style={styles.cardImovel}>
            <View style={[
                styles.areaTituloCardImovel,
                { backgroundColor: corStatus }
            ]}>
                {iconStatus}
                <Text style={styles.tituloCardImovel}>{status}</Text>
            </View>
            <View style={styles.areaConteudoCard}>
                <Image
                    style={styles.img}
                    source={IMAGES.apartamentoX}
                />
                <View style={styles.areaTextoCard}>
                    <Text style={styles.tituloImovel}>{titulo}</Text>
                    <Text style={styles.enderecoImovel}>{endereco}</Text>
                    <Text style={styles.tipoImovel}>{tipo}</Text>
                </View>
            </View>

            <ButtonDark
                title="Ver detalhes"
            // onPress={() => navigation.navigate('/cadastroImovel')} 
            />

        </View>
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
        backgroundColor: COLORS.yellowCDI,
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 16,
        paddingBottom: 12
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


})