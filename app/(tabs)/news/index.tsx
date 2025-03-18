import { rGetNewsList } from "@/api/violence";
import { CustomHeader, LoaderView, ScreenContainer } from "@/components";
import { Card } from "@/components/ui";
import { Error } from "@/components/ui/Error";
import { NotFound } from "@/components/ui/NotFound";
import { rS } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

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
                        {news.map(item => <Card link={`/(tabs)/news/${item.id}`} variant="horizontal" title={item.title} desc={item.text} img={item.media[0]?.video_file} />
                        )}
                    </ScrollView>
                </SafeAreaView>
                :
                <NotFound />
        }
    </ScreenContainer>

}
const styles = StyleSheet.create({
    container: {
        gap: rS(20)
    }
})
