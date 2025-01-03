import { CustomHeader, ScreenContainer } from "@/components";
import { Card } from "@/components/ui";
import { Colors, mockCardData } from "@/constants/Colors";
import { Tabs } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";


export default function MyVideos() {
    return <ScreenContainer>
        <Tabs.Screen options={{ header: (props) => <CustomHeader showBack={false} title="Мои видео" /> }} />
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.container]}>
                {mockCardData.map(item => <Card key={item.title} color={Colors.light.status['2']} variant="horizontal" {...item} />)}
            </ScrollView>
        </SafeAreaView>
    </ScreenContainer>

}

const styles = StyleSheet.create({
    container: {
        gap: 10
    }
});
