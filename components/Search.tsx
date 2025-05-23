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
        <TextInput keyboardType="numeric" value={id} onChangeText={text => setId(text)} placeholder='Введите номер нарушения...' style={[styles.trigger]} />
        <Pressable onPress={handleFind} style={[styles.icon]}>
            <FontAwesome5 name="search" size={18} color={'white'} />
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
        justifyContent: 'center',
        paddingHorizontal: rS(10),

        marginTop: rV(5),
        gap: rS(3),
    },
    trigger: {
        flex: 1,
        marginHorizontal: 'auto',
        backgroundColor: "#F1F5F9",
        borderRadius: 5,
        paddingLeft: rS(10),
        gap: rS(8),
        height: rV(32),
        alignItems: 'center',
    },
    icon: {
        backgroundColor: Colors.light.primary,
        borderRadius: 5,
        height: rS(33),
        width: rS(40),
        alignItems: 'center',
        justifyContent: 'center'

    },
})
