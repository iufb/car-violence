import { rGetMediaById } from "@/api/violence";
import { CustomHeader, LoaderView, ScreenContainer } from "@/components";
import { MediaViewer } from "@/components/MediaViewer";
import { Alert, Typography } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { useQuery } from "@tanstack/react-query";
import { Tabs, useLocalSearchParams } from "expo-router";
import React from 'react';
import { Dimensions, FlatList, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

const width = Dimensions.get('window').width
export default function VideoScreen() {
    const { id } = useLocalSearchParams()
    const { data, isLoading, error } = useQuery({
        queryKey: [`violence ${id}`], queryFn: async () => {
            const data = await rGetMediaById(parseInt(id as string))
            return data
        }
    })
    console.log(data?.videos)
    return <ScreenContainer keyDismiss={false}>
        <Tabs.Screen options={{ header: () => <CustomHeader title="Видео" /> }} />
        <SafeAreaView>
            {isLoading && <LoaderView />
            }
            {error?.cause == 404 && <Typography variant="p2" color="green">Не найдено</Typography>}
            {error && <Typography variant="p2" color="red">Ошибка</Typography>}
            {data ?
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.container]}>
                    <Alert title="Ожидается оплата" subtitle="Выплата будет отправлена на ваш счет" variant="rejected" />
                    <FlatList removeClippedSubviews contentContainerStyle={[styles.medias]} showsHorizontalScrollIndicator={false} keyExtractor={item => `${item.id}`} horizontal data={data.videos} renderItem={({ item }) =>
                        <MediaViewer media={item.video_file} itemStyle={styles.media} style={[styles.mediaContainer]} />
                    } />
                    <View style={[styles.textContainer]}>
                        <Typography color={Colors.light.primary} variant="h2">№ {data.id}</Typography>
                        <Typography variant="h3">Город: {data.city}</Typography>
                        <Typography variant="span">Дата: {data.was_at_date} {data.was_at_time}</Typography>
                        <Typography variant="p2">Описание: {data.description}</Typography>
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
