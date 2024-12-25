import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";


export default function HomeScreen() {
    return (
        <View>
            <Link href={'/(auth)/confirmation'}>confirm</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
});
