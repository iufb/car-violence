import { rGetMediaList } from "@/api/violence";
import { NewsList, ScreenContainer, Search } from "@/components";
import { Card, Typography } from "@/components/ui";
import { rS, rV } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import React from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";


export default function HomeScreen() {

    return (
        <ScreenContainer style={[styles.container]} >
            <Tabs.Screen options={{ header: () => <Search /> }} />
            <SafeAreaView >
                <ScrollView contentContainerStyle={[styles.container]} showsVerticalScrollIndicator={false}>
                    <NewsList />
                    <Typography center variant="h2">Последние нарушения</Typography>
                    <LastViolenceList />
                </ScrollView>
            </SafeAreaView>
        </ScreenContainer >
    );
}

const LastViolenceList = () => {
    const { data: medias, isLoading, isError, error } = useQuery({
        queryKey: ['myVideos'], queryFn: async () => {
            const data = await rGetMediaList({ type: 'all', limit: 10 })
            return data
        }
    })


    return isLoading ? <View >
        <ActivityIndicator />
    </View> : isError && error?.cause !== 404 ?
        <Typography center variant="span" color="red">Ошибка</Typography> :
        medias && medias.length > 0 ?
            <View style={[styles.violenceContainer]}>
                {medias.map(item => <Card link={`/(tabs)/video/${item.id}`} style={[styles.violences]} subtitle={item.city} key={item.id} variant="base"
                    title={item.id.toString()} desc={item.description} img={item.videos[0].video_file}
                />)
                }
            </View>
            :
            <Typography center variant="span" color="green">Не найдено</Typography>
}


const styles = StyleSheet.create({
    container: {
        gap: rS(20),
    },
    violenceContainer: {
        width: rS(400),
        gap: rS(10)
    },
    violences: {
        width: Dimensions.get('window').width - 40,
        height: rV(300)
    },
});
