import { ScreenContainer, Search } from "@/components";
import { Card, Typography } from "@/components/ui";
import { mockCardData } from "@/constants/Colors";
import { rS, rV } from "@/utils";
import { Tabs } from "expo-router";
import { Dimensions, FlatList, SafeAreaView, ScrollView, StyleSheet } from "react-native";


export default function HomeScreen() {
    return (
        <ScreenContainer style={[styles.container]} >

            <Tabs.Screen options={{ header: () => <Search /> }} />
            <SafeAreaView >
                <ScrollView contentContainerStyle={[styles.container]} showsVerticalScrollIndicator={false}>
                    <Typography variant="h2">Последние новости</Typography>
                    <FlatList showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.newsContainer]} horizontal data={mockCardData} renderItem={({ item }) => <Card style={[styles.news]} variant="base" {...item} />}
                        keyExtractor={(item) => item.title}
                    />
                    <Typography center variant="h2">Последние нарушения</Typography>
                    {mockCardData.map((item) => <Card variant="base" key={item.title} style={[styles.violences]} {...item} />)}
                </ScrollView>
            </SafeAreaView>
        </ScreenContainer >
    );
}

const styles = StyleSheet.create({
    container: {
        gap: rS(20),
    },
    violenceContainer: {
        width: rS(400),
        gap: rS(10)
    },
    newsContainer: {
        display: 'flex',
        minHeight: rV(230),
        gap: rS(20)
    },
    violences: {
        width: Dimensions.get('window').width - 40,
        height: rV(300)
    },
    news: {
        width: Dimensions.get('window').width / 2,
        height: Dimensions.get('window').width / 2 - 30,
    },
});
