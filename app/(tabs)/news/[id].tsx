import { rGetNewsById } from "@/api/violence";
import { CustomHeader, LoaderView, ScreenContainer } from "@/components";
import { MediaViewer } from "@/components/MediaViewer";
import { Typography } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { useQuery } from "@tanstack/react-query";
import { Tabs, useLocalSearchParams } from "expo-router";
import React from 'react';
import { Dimensions, FlatList, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

const width = Dimensions.get('window').width
export default function NewsScreen() {
    const { id } = useLocalSearchParams()
    const { data, isLoading, error } = useQuery({
        queryKey: [`news ${id}`], queryFn: async () => {
            const data = await rGetNewsById(parseInt(id as string))
            return data
        }
    })
    return <ScreenContainer keyDismiss={false}>
        <Tabs.Screen options={{ header: () => <CustomHeader title="Новости" /> }} />
        <SafeAreaView>
            {isLoading && <LoaderView />}
            {error?.cause == 404 && <Typography variant="p2" color="green">Не найдено</Typography>}
            {error && <Typography variant="p2" color="red">Ошибка</Typography>}
            {data ?
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.container]}>
                    <FlatList removeClippedSubviews contentContainerStyle={[styles.medias]} showsHorizontalScrollIndicator={false} keyExtractor={item => `${item.id}`} horizontal data={data.media} renderItem={({ item }) =>
                        <MediaViewer media={item?.video_file} itemStyle={styles.media} style={[styles.mediaContainer]} />
                    } />
                    <View style={[styles.textContainer]}>
                        <Typography color={Colors.light.primary} variant="h2">{data.title}</Typography>
                        <Typography variant="h3">{data.text}</Typography>
                    </View>
                </ScrollView>
                : null}
        </SafeAreaView>
    </ScreenContainer>
}
const styles = StyleSheet.create({
    container: {
        gap: 20,
        flexGrow: 1
    },
    medias: {
        gap: 10,
    },
    mediaContainer: {
        width: Dimensions.get('window').width - 40,
        height: Dimensions.get('window').width - 40,
        borderRadius: 10,
        overflow: 'hidden'
    },
    media: {
        width: '100%',
        height: '100%'
    },
    textContainer: {
        gap: 10,
        paddingLeft: 10,
    }

})
