import { Colors } from "@/constants/Colors";
import { rS, rV } from "@/utils";
import { FontAwesome5 } from "@expo/vector-icons";
import Constants from 'expo-constants';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, TextInput, View } from "react-native";


// const read = async () => {
//     const images: FileSystemUploadResult[] = []
//     for (const i of image) {
//         const data = await startUpload(i, (progress) => setRes({ ...res, progress }))
//         if (data)
//             images.push(data)
//         setRes({ ...res, progress: 0 })
//     }
//     const final = await fetch('http://10.0.2.2:3000/final', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             images: images.map(i => JSON.parse(i?.body ?? '').file),
//             firstParam: 'yourValue',
//             secondParam: 'yourOtherValue',
//         }),
//     })
//     Toast.show({ type: 'success', text1: "Загрузка завершена", text2: "Загрузка прошла успешна" })
//
//     const b = await final.json()
//     console.log(b, "FINAL")
// }
//

export const Search = () => {
    const [id, setId] = useState('')
    const router = useRouter()
    const handleFind = () => {
        if (!id) return;
        router.push(`/(tabs)/video/${id}`)
    }
    return <View style={[styles.container]}>
        <TextInput value={id} onChangeText={text => setId(text)} placeholder='Введите номер нарушения...' style={[styles.trigger]} />
        <Pressable onPress={handleFind} style={[styles.icon]}>
            <FontAwesome5 name="search" size={20} color={Colors.light.primary} />
        </Pressable>

    </View>
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        backgroundColor: Colors.light.slate200,
        marginTop: Constants.statusBarHeight,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: rV(10),
        paddingHorizontal: rS(10),
        position: 'relative'
    },
    trigger: {
        width: '100%',
        backgroundColor: Colors.light.background,
        borderColor: Colors.light.primary,
        borderWidth: 1,
        borderRadius: 16,
        paddingVertical: rS(8),
        paddingHorizontal: rS(16),
        gap: rS(8),
        alignItems: 'center',
    },
    icon: {
        position: 'absolute',
        right: 30,
        elevation: 1,
        zIndex: 1

    },
    modal: {
        paddingTop: Constants.statusBarHeight
    }
})
