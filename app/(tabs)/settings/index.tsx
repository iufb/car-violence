import { CustomHeader, ListItem, ScreenContainer } from "@/components";
import { rS } from "@/utils";
import { Tabs } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

export default function Settings() {
    return <ScreenContainer >
        <Tabs.Screen options={{ header: () => <CustomHeader showBack={true} title="Настройки" /> }} />
        <ScrollView contentContainerStyle={[styles.container]} showsVerticalScrollIndicator={false}>
            <ListItem href={'/settings/rules'} title="Правила размещения фото/видео" />
            <ListItem href={'/settings/terms'} title="Условия пользования" />
            <ListItem href={'/settings/policy'} title="Политика конфиденциальности" />
        </ScrollView>
    </ScreenContainer>


}

const styles = StyleSheet.create({
    container: {
        gap: rS(20)
    }
})
