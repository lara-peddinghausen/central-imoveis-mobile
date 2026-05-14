import { Pressable, StyleSheet, Text } from "react-native";

export const Button02 = ({ onPress, title }) => {
    return (
        <Pressable style={styles.btn}
            onPress={onPress}>
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
        backgroundColor: '#466DC2',
        margin: 10
    },
    btnTexto: {
        fontWeight: 'bold',
        fontSize: 17,
        color: 'white'
    }

})