import { CustomHeader, ListItem, LogoutButton, ProfileSection, ScreenContainer } from "@/components";
import { UserBalance } from "@/components/UserBalance";
import { rS } from "@/utils";
import { Tabs } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

export default function Profile() {
    return <ScreenContainer >
        <Tabs.Screen options={{ header: () => <CustomHeader showBack={false} title="Профиль" /> }} />
        <ScrollView contentContainerStyle={[styles.container]} showsVerticalScrollIndicator={false}>
            <ProfileSection />
            <UserBalance />
            <ListItem href={'/settings'} title="Настройки" />
            <LogoutButton />
        </ScrollView>
    </ScreenContainer>
}

const styles = StyleSheet.create({
    container: {
        gap: rS(20)
    }
})
