import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { COLORS } from '../../../src/theme/colors.js';

export default function EditarInquilino() {
    return (
        <View style={styles.container}></View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        flexGrow: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 20,
        paddingVertical: 20
    },
    
});