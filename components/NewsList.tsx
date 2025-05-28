import { rGetNewsList } from "@/api/violence"
import { LoaderView } from "@/components/LoaderView"
import { Typography } from "@/components/ui"
import { Error } from "@/components/ui/Error"
import { NotFound } from "@/components/ui/NotFound"
import { Colors } from "@/constants/Colors"
import { rS, rV } from "@/utils"
import { useQuery } from "@tanstack/react-query"
import { Link, LinkProps } from "expo-router"
import React from 'react'
import { Dimensions, FlatList, StyleSheet, View, ViewProps } from "react-native"
import FastImage from "react-native-fast-image"


export const NewsList = () => {
    const { data, isLoading, error } = useQuery({ queryKey: ["news"], queryFn: async () => rGetNewsList(5) })
    console.log(data, "NEWS")
    return <View>
        <View style={[{ flexDirection: 'row', alignItems: 'flex-start' }]}>
            <Typography style={[styles.title]} variant="h2">Последние новости</Typography>
            <Link style={[{ marginLeft: 'auto', color: Colors.light.primary, marginTop: 6 }]} href={'/news'}>Все новости</Link>
        </View>
        {isLoading &&
            <LoaderView />
        }
        {error?.cause == 404 && <NotFound />}
        {error && <Error />}
        {data?.length == 0 && <NotFound />}
        {data && data.length !== 0 &&
            <FlatList showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.newsContainer]} horizontal data={data} renderItem={({ item }) => <NewsCard link={`/(tabs)/news/${item.id}`} style={[styles.news]} variant="base" title={item.title} desc={''} img={item.media[0].video_file} />}
                keyExtractor={(item) => item.id.toString()}
            />}
    </View>
}

const NewsCard = ({ link, img, title, style }: { link: LinkProps['href'], img: string, title: string } & ViewProps) => {
    return <Link href={link}>
        <View style={[style]}>
            <FastImage source={{ uri: img }} style={[styles.cardImage]} />
            <View style={[styles.cardTextWrapper]}>
                <Typography variant="span" numberOfLines={3}>{title}</Typography>
            </View>
        </View>
    </Link>
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
        gap: rS(20)
    },
    news: {
        width: Dimensions.get('window').width / 2,
    },
    cardImage: {
        width: '100%',
        height: rV(100),
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    cardTextWrapper: {
        backgroundColor: Colors.light.cardBg,
        paddingHorizontal: 20, paddingVertical: 8,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    }

})


