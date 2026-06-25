import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { ButtonDark } from "../ButtonDark";
import { useRouter } from "expo-router";

export default function DadosImovelItem({ imovel }) {

    const router = useRouter();

    if (!imovel) return null;

    const EditarImovel = () => {
        router.push(`/imovel/editar-imovel?id=${imovel.id}`);
    };

    const EditarProprietario = () => {
        router.push(`/proprietario/editar-proprietario?id=${imovel.proprietario.id}&imovelId=${imovel.id}`);
    };

    return (
        <View style={styles.cardImovel} >
            <View style={styles.areaTituloCardImovel}>
                <Text style={styles.tituloCardImovel}>Dados</Text>
            </View>

            <View style={styles.areaConteudoCard}>
                <Text style={styles.textoInfo}>
                    <Text style={styles.bold}>Rua: </Text>
                    {imovel.rua}, {imovel.numero}
                </Text>

                {imovel.complemento ? <Text style={styles.textoInfo}>
                    <Text style={styles.bold}>Complemento: </Text>
                    {imovel.complemento}
                </Text> : null}

                <Text style={styles.textoInfo}>
                    <Text style={styles.bold}>Bairro: </Text>
                    {imovel.bairro}
                </Text>

                <Text style={styles.textoInfo}>
                    <Text style={styles.bold}>Cidade/Estado: </Text>
                    {imovel.cidade} - {imovel.estado}
                </Text>

                <Text style={styles.textoInfo}>
                    <Text style={styles.bold}>CEP: </Text>
                    {imovel.cep}
                </Text>

                <View style={{ alignItems: 'center' }}>
                    <ButtonDark
                        title="Editar"
                        onPress={EditarImovel}
                    />
                </View>

                {imovel.proprietario ? <View>
                    <View style={styles.linha} />
                    <Text style={styles.tituloProprietario}>Proprietário</Text>

                    <Text style={styles.textoInfo}>
                        <Text style={styles.bold}>Nome: </Text>
                        {imovel.proprietario.nome}
                    </Text>

                    <Text style={styles.textoInfo}>
                        <Text style={styles.bold}>CPF: </Text>
                        {imovel.proprietario.cpf}
                    </Text>

                    <Text style={styles.textoInfo}>
                        <Text style={styles.bold}>Data de nascimento: </Text>
                        {imovel.proprietario.dataNascimento}
                    </Text>

                    <Text style={styles.textoInfo}>
                        <Text style={styles.bold}>E-mail: </Text>
                        {imovel.proprietario.email}
                    </Text>

                    <Text style={styles.textoInfo}>
                        <Text style={styles.bold}>Telefone: </Text>
                        {imovel.proprietario.telefone}
                    </Text>

                    <View style={{ alignItems: 'center' }}>
                        <ButtonDark
                            title="Editar"
                            onPress={EditarProprietario}
                        />
                    </View>

                </View>
                    : null}

            </View>



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
        marginBottom: 20
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
    textoInfo: {
        fontSize: 16,
        marginVertical: 2
    },
    bold: {
        fontWeight: 'bold'
    },
    linha: {
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