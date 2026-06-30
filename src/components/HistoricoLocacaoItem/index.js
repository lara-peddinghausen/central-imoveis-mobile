import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { ButtonDark } from "../ButtonDark";
import { useRouter } from "expo-router";

export default function HistoricoLocacaoItem({ locacao, imovelId }) {
    const router = useRouter();

    if (!locacao) return null;

    const isAtivo = locacao.status?.toUpperCase() === 'ATIVA';

    const handleVerContrato = () => {
        router.push({
            pathname: `/(tabs)/locacao/detalhes-locacao`,
            params: { locacaoId: locacao.id, imovelId: imovelId }
        });
    };

    const statusFormatado = locacao.status
        ? locacao.status.charAt(0).toUpperCase() + locacao.status.slice(1).toLowerCase()
        : '';

    return (
        <View style={styles.container} >

            {/* O Cabeçalho só aparece se o contrato estiver ATIVO (Verde) */}
            {isAtivo && (
                <View style={styles.areaTitulo}>
                    <Text style={styles.titulo}>Contrato Ativo</Text>
                </View>
            )}

            {/* Informações do contrato */}
            <View style={styles.areaConteudo}>

                <Text style={styles.textoInformacao}>
                    <Text style={styles.bold}>Inquilino: </Text>
                    {locacao.pessoa?.nome || 'Não informado'}
                </Text>

                <Text style={styles.textoInformacao}>
                    <Text style={styles.bold}>Início: </Text>
                    {locacao.dataInicio} - <Text style={styles.bold}>Fim: </Text>
                    {locacao.dataTermino}
                </Text>

                <Text style={styles.textoInformacao}>
                    <Text style={styles.bold}>Aluguel: </Text>
                    R$ {locacao.aluguel?.toFixed(2).replace('.', ',')}
                </Text>

                {!isAtivo && (
                    <Text style={styles.textoInformacao}>
                        <Text style={styles.bold}>Status: </Text>
                        {statusFormatado}
                    </Text>
                )}

                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <ButtonDark
                        title="Ver contrato"
                        onPress={handleVerContrato}
                    />
                </View>
            </View>

        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: COLORS.grey,
        borderRadius: 10,
        width: '100%',
        maxWidth: 350,
        paddingBottom: 15,
        marginBottom: 20,
        backgroundColor: COLORS.white,
        overflow: 'hidden'
    },
    areaTitulo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.green,
        width: '100%',
        height: 40,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: COLORS.grey,
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
    }
});