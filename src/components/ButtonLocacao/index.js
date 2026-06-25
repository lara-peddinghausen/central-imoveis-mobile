import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';


import { COLORS } from '../../theme/colors';
import { FONT_SIZE } from '../../theme/typography';

export default function ButtonLocacao({ imovelId, statusImovel }) {
    const router = useRouter();

    // Regra de negócio: Fica desativado se o status for 'ALUGADO'
    const isCadastroDesativado = statusImovel === 'ALUGADO';

    return (
        <View style={styles.areaBotoes}>

            <TouchableOpacity
                style={[
                    styles.botao,
                    isCadastroDesativado ? styles.botaoDisabled : styles.botaoDark
                ]}
                // Rota direta passando o id do imóvel por parâmetro
                onPress={() => router.push(`/imovel/cadastrar-locacao?imovelId=${imovelId}`)}
                disabled={isCadastroDesativado} 
            >
                <Text style={styles.textoBotao}>Cadastrar contrato</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.botao, styles.botaoDark]}
                // Rota direta para a tela correspondente do histórico
                // onPress={() => router.push(`/imovel/historico-contratos?imovelId=${imovelId}`)}
            >
                <Text style={styles.textoBotao}>Ver histórico</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    areaBotoes: {
        flexDirection: 'row',
        width: '90%',
        gap: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    botao: {
        flex: 1, 
        height: 60, 
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    botaoDisabled: {
        backgroundColor: COLORS.grey,
    },
    botaoDark: {
        backgroundColor: COLORS.darkBlue, 
    },
    textoBotao: {
        color: COLORS.white,
        fontSize: FONT_SIZE.medium,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});