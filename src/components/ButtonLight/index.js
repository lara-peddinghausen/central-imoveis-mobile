import { Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "../../theme/colors";

export const ButtonLight = ({ onPress, title, flex = false }) => {
    return (
        <Pressable style={[
            styles.btn,
            flex && { flex: 1 }
        ]}
            onPress={onPress}>
            <Text style={styles.btnText}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
        height: 35,
        borderRadius: 30,
        backgroundColor: COLORS.lightBlue,
        margin: 10,
        marginTop: 20,
        paddingHorizontal: 30,
    },
    btnText: {
        fontWeight: 'bold',
        fontSize: 17,
        color: 'white'
    }

})