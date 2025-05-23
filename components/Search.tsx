import { Colors } from "@/constants/Colors";
import { rS, rV } from "@/utils";
import { FontAwesome5 } from "@expo/vector-icons";
import Constants from 'expo-constants';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, TextInput, View } from "react-native";




export const Search = () => {
    const [id, setId] = useState('')
    const router = useRouter()
    const handleFind = () => {
        if (!id) return;
        router.push(`/(tabs)/video/${id}`)
        setId('')
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
        paddingTop: Constants.statusBarHeight,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: rV(10),
        paddingHorizontal: rS(10),
        position: 'relative'
    },
    trigger: {
        width: Dimensions.get('window').width - 20,
        marginTop: rV(5),
        marginHorizontal: 'auto',
        backgroundColor: "#F1F5F9",
        borderRadius: 16,
        paddingVertical: rV(8),
        paddingHorizontal: rS(16),
        gap: rS(8),
        alignItems: 'center',
    },
    icon: {
        position: 'absolute',
        top: Constants.statusBarHeight + rV(8),
        right: 30,
        elevation: 1,
        zIndex: 1

    },
    modal: {
        paddingTop: Constants.statusBarHeight
    }
})
