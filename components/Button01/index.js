import { Pressable, StyleSheet, Text } from "react-native";

export const Button01 = ({ onPress, title, backgroundColor }) => {
    return (
        <Pressable
            style={[
                styles.btn,
                { backgroundColor: backgroundColor || '#0B3B63' }
            ]}
            onPress={onPress}
        >
            <Text style={styles.btnTexto}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 115,
        height: 35,
        borderRadius: 30,
        backgroundColor: '#0B3B63',
        margin: 10
    },
    btnTexto: {
        fontWeight: 'bold',
        fontSize: 17,
        color: 'white'
    }

})