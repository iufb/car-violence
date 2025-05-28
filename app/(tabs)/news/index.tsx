import { rGetNewsList } from "@/api/violence";
import { CustomHeader, LoaderView, ScreenContainer } from "@/components";
import { Typography } from "@/components/ui";
import { Error } from "@/components/ui/Error";
import { NotFound } from "@/components/ui/NotFound";
import { Colors } from "@/constants/Colors";
import { rS, rV } from "@/utils";
import { Entypo } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, LinkProps, Tabs } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, View, ViewProps } from "react-native";
import FastImage from "react-native-fast-image";

export default function News() {
    const { data: news, isLoading, isError, error } = useQuery({
        queryKey: ['newsmain'], queryFn: async () => {
            const data = await rGetNewsList(100)
            return data
        }
    })
    return <ScreenContainer>
        <Tabs.Screen options={{ header: (props) => <CustomHeader showBack={true} title="Новости" /> }} />
        {isLoading ? <View>
            <LoaderView />
        </View> : isError && error?.cause !== 404 ?
            <Error /> :
            news && news.length > 0 ?
                <SafeAreaView>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.container]}>
                        {news.map(item => <NewsCard key={item.id} link={`/(tabs)/news/${item.id}`} title={item.title} img={item.media[0]?.video_file} style={styles.cardWrapper} />
                        )}
                    </ScrollView>
                </SafeAreaView>
                :
                <NotFound />
        }
    </ScreenContainer>

}
const NewsCard = ({ link, img, title, style }: { link: LinkProps['href'], img: string, title: string } & ViewProps) => {
    return <Link href={link}>
        <View style={[style]}>
            <FastImage source={{ uri: img }} style={[styles.cardImage]} />
            <View style={[styles.cardTextWrapper]}>
                <Typography variant="span" numberOfLines={4}>{title}</Typography>

            </View>

            <Entypo name="chevron-right" size={32} color={Colors.light.notSelected} style={[styles.icon]} />

        </View>
    </Link>
}
const styles = StyleSheet.create({
    container: {
        gap: rS(20)
    },
    cardWrapper: {
        flexDirection: 'row',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        overflow: 'hidden',

        backgroundColor: Colors.light.cardBg,
    },
    cardImage: {
        width: '40%',
        height: rV(80),
    },
    cardTextWrapper: {
        width: '50%',
        justifyContent: 'center',

        paddingHorizontal: 10, paddingVertical: 8,
    },
    icon: {
        marginVertical: 'auto'
    },

})
