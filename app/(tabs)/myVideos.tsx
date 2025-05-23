import { rGetMediaList } from "@/api/violence";
import { CustomHeader, LoaderView, ScreenContainer } from "@/components";
import { Card } from "@/components/ui";
import { Error } from "@/components/ui/Error";
import { NotFound } from "@/components/ui/NotFound";
import { formatDate } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import { useCallback } from "react";
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";


export default function MyVideos() {
    const { data: medias, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['myVideos'], queryFn: async () => {
            const data = await rGetMediaList({ type: 'user', limit: 100 })
            return data
        }
    })

    const onRefresh = useCallback(() => {
        refetch()

    }, []);
    return <ScreenContainer>
        <Tabs.Screen options={{ header: (props) => <CustomHeader showBack={false} title="Мои видео" /> }} />
        {isLoading ? <View>
            <LoaderView />
        </View> : isError && error?.cause !== 404 ?
            <Error /> :
            medias && medias.length > 0 ?
                <SafeAreaView>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.container]}
                        refreshControl={
                            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
                        }
                    >
                        {medias.map(item => <Card link={`/(tabs)/video/${item.id}`} subtitle={formatDate(item.uploaded_at)} key={item.id} variant="horizontal"
                            title={'№' + item.id.toString()} desc={item.description} img={item.videos.length > 0 ? item.videos[0].video_file : ''}
                        />)}
                    </ScrollView>
                </SafeAreaView>
                :
                <NotFound />
        }
    </ScreenContainer>

}

const styles = StyleSheet.create({
    container: {
        gap: 10
    }
});
