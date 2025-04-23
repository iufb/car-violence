import { rGetNewsList } from "@/api/violence"
import { LoaderView } from "@/components/LoaderView"
import { Card, Typography } from "@/components/ui"
import { Error } from "@/components/ui/Error"
import { NotFound } from "@/components/ui/NotFound"
import { rS, rV } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import React from 'react'
import { Dimensions, FlatList, StyleSheet, View } from "react-native"


export const NewsList = () => {
    const { data, isLoading, error } = useQuery({ queryKey: ["news"], queryFn: async () => rGetNewsList(5) })
    return <View>
        <Typography style={[styles.title]} variant="h2">Последние новости</Typography>
        {isLoading &&
            <LoaderView />
        }
        {error?.cause == 404 && <NotFound />}
        {error && <Error />}
        {data?.length == 0 && <NotFound />}
        {data && data.length !== 0 &&
            <FlatList showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.newsContainer]} horizontal data={data} renderItem={({ item }) => <Card link={`/(tabs)/news/${item.id}`} style={[styles.news]} variant="base" title={item.title} desc={item.text} img={item.media[0]?.video_file} />}
                keyExtractor={(item) => item.id.toString()}
            />}
    </View>
}

const styles = StyleSheet.create({
    container: {
        gap: rS(20),

    },
    title: {
        marginBottom: 20
    },
    newsContainer: {

        display: 'flex',
        minHeight: rV(230),
        gap: rS(20)
    },
    news: {
        width: Dimensions.get('window').width / 2,
        height: Dimensions.get('window').width / 2 - 30,
    },

})


