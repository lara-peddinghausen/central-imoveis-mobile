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
        <View style={styles.buttonArea}>

            <TouchableOpacity
                style={[
                    styles.button,
                    isCadastroDesativado ? styles.buttonDisabled : styles.buttonDark
                ]}
                // Rota direta passando o id do imóvel por parâmetro
                onPress={() => router.push(`/imovel/cadastrar-locacao?imovelId=${imovelId}`)}
                disabled={isCadastroDesativado} 
            >
                <Text style={styles.buttonText}>Cadastrar contrato</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.buttonDark]}
                // Rota direta para a tela correspondente do histórico
                // onPress={() => router.push(`/imovel/historico-contratos?imovelId=${imovelId}`)}
            >
                <Text style={styles.buttonText}>Ver histórico</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonArea: {
        flexDirection: 'row',
        width: '90%',
        gap: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    button: {
        flex: 1, 
        height: 60, 
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    buttonDisabled: {
        backgroundColor: COLORS.grey,
    },
    buttonDark: {
        backgroundColor: COLORS.darkBlue, 
    },
    buttonText: {
        color: COLORS.white,
        fontSize: FONT_SIZE.medium,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});