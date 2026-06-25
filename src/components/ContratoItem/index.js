import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { ButtonDark } from "../ButtonDark";
import { useRouter } from "expo-router";

export default function ContratoItem({ locacao }) {

    const router = useRouter();

    if (!locacao) return null;

    return (
        // Título
        <View style={styles.container} >
            <View style={styles.areaTitulo}>
                <Text style={styles.titulo}>Contrato ativo</Text>
            </View>

            {/* Informações */}
            <View style={styles.areaConteudo}>
                <Text style={styles.textoInformacao}>
                    <Text style={styles.bold}>Rua: </Text>
                    {imovel.rua}, {imovel.numero}
                </Text>

                {imovel.complemento ? <Text style={styles.textoInformacao}>
                    <Text style={styles.bold}>Complemento: </Text>
                    {imovel.complemento}
                </Text> : null}

                <Text style={styles.textoInformacao}>
                    <Text style={styles.bold}>Bairro: </Text>
                    {imovel.bairro}
                </Text>

                <Text style={styles.textoInformacao}>
                    <Text style={styles.bold}>Cidade/Estado: </Text>
                    {imovel.cidade} - {imovel.estado}
                </Text>

                <Text style={styles.textoInformacao}>
                    <Text style={styles.bold}>CEP: </Text>
                    {imovel.cep}
                </Text>

                {imovel.proprietario ? <View>
                    <View style={styles.linha} />
                    <Text style={styles.tituloProprietario}>Proprietário</Text>

                    <Text style={styles.textoInformacao}>
                        <Text style={styles.bold}>Nome: </Text>
                        {imovel.proprietario.nome}
                    </Text>

                    <Text style={styles.textoInformacao}>
                        <Text style={styles.bold}>CPF: </Text>
                        {imovel.proprietario.cpf}
                    </Text>

                    <Text style={styles.textoInformacao}>
                        <Text style={styles.bold}>Data de nascimento: </Text>
                        {imovel.proprietario.dataNascimento}
                    </Text>

                    <Text style={styles.textoInformacao}>
                        <Text style={styles.bold}>E-mail: </Text>
                        {imovel.proprietario.email}
                    </Text>

                    <Text style={styles.textoInformacao}>
                        <Text style={styles.bold}>Telefone: </Text>
                        {imovel.proprietario.telefone}
                    </Text>

                </View>
                    : null}
            </View>

            <ButtonDark
                title="Editar"

            />

        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.grey,
        borderRadius: 10,
        width: '100%',
        maxWidth: 350,
        borderTopWidth: 0,
        paddingBottom: 15,
    },
    areaTitulo: {
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
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.darkBlue
    },
    areaConteudo: {
        padding: 15,
        width: '100%'
    },
    img: {
        width: 130,
        height: 100,
        borderRadius: 8
    },
    areaTexto: {
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
    textoInformacao: {
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