import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { ButtonDark } from "../ButtonDark";
import { useRouter } from "expo-router";

export default function DadosLocacaoItem({ locacao, imovelId }) {
    const router = useRouter();

    // Se o imóvel não tiver nenhuma locação ativa/cadastrada, não renderiza nada
    if (!locacao) return null;

    const VincularInquilino = () => {
        router.push(`/inquilino/cadastrar-inquilino?locacaoId=${locacao.id}&imovelId=${imovelId}`);
    };

    const EditarInquilino = () => {
        router.push(`/inquilino/editar-inquilino?locacaoId=${locacao.id}&imovelId=${imovelId}`);
    };

    const EditarLocacao = () => {
        router.push(`/inquilino/editar-locacao?locacaoId=${locacao.id}&imovelId=${imovelId}`);
    };

    return (
        <View style={styles.container}>

            {/* Cabeçalho do Card com estilo unificado */}
            <View style={styles.areaTitulo}>
                <Text style={styles.titulo}>Contrato Ativo</Text>
            </View>

            {/* Informações do Contrato */}
            <View style={styles.areaConteudo}>
                <Text style={styles.textoInformacao}>
                    <Text style={styles.bold}>Início: </Text>
                    {locacao.dataInicio}
                </Text>

                <Text style={styles.textoInformacao}>
                    <Text style={styles.bold}>Término: </Text>
                    {locacao.dataTermino}
                </Text>

                <Text style={styles.textoInformacao}>
                    <Text style={styles.bold}>Valor do Aluguel: </Text>
                    R$ {locacao.aluguel?.toFixed(2).replace('.', ',')}
                </Text>

                {locacao.observacao ? (
                    <Text style={styles.textoInformacao}>
                        <Text style={styles.bold}>Obs: </Text>
                        {locacao.observacao}
                    </Text>
                ) : null}

                <View style={{ alignItems: 'center' }}>
                    <ButtonDark
                        title="Editar"
                        onPress={EditarLocacao}
                    />
                </View>

                {/* Bloco Condicional do Inquilino */}
                {locacao.pessoa ? (
                    <View>
                        <View style={styles.linha} />
                        <Text style={styles.tituloInquilino}>Inquilino Atual</Text>

                        <Text style={styles.textoInformacao}>
                            <Text style={styles.bold}>Nome: </Text>
                            {locacao.pessoa.nome}
                        </Text>

                        <Text style={styles.textoInformacao}>
                            <Text style={styles.bold}>CPF: </Text>
                            {locacao.pessoa.cpf}
                        </Text>

                        <Text style={styles.textoInformacao}>
                            <Text style={styles.bold}>Data de nascimento: </Text>
                            {locacao.pessoa.dataNascimento}
                        </Text>

                        <Text style={styles.textoInformacao}>
                            <Text style={styles.bold}>E-mail: </Text>
                            {locacao.pessoa.email}
                        </Text>

                        <Text style={styles.textoInformacao}>
                            <Text style={styles.bold}>Telefone: </Text>
                            {locacao.pessoa.telefone}
                        </Text>
                    </View>
                ) : (
                    <View>
                        <View style={styles.linha} />
                        <View style={{ alignItems: 'center', marginTop: 5 }}>
                            <Text style={[styles.textoInformacao, { color: COLORS.red, fontStyle: 'italic', marginBottom: 10 }]}>
                                Nenhum inquilino vinculado a este contrato.
                            </Text>
                            <ButtonDark
                                title="Vincular Inquilino"
                                onPress={VincularInquilino}
                            />
                        </View>
                    </View>

                )}
                <View style={{ alignItems: 'center' }}>
                    <ButtonDark
                        title="Editar"
                        onPress={EditarInquilino}
                    />
                </View>
            </View>

        </View>
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
        marginBottom: 20
    },
    areaTitulo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
    tituloInquilino: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkBlue,
        textAlign: 'center',
        marginBottom: 10,
    }
});