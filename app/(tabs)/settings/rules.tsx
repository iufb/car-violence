import { CustomHeader, ScreenContainer } from "@/components";
import { Typography } from "@/components/ui";
import { rS } from "@/utils";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function Rules() {
    return <ScreenContainer >
        <Tabs.Screen options={{ header: () => <CustomHeader showBack={true} title="Правила размещения фото/видео" /> }} />
        <Typography variant="h2">123</Typography>
    </ScreenContainer>


}

const styles = StyleSheet.create({
    container: {
        gap: rS(20)
    }
})
