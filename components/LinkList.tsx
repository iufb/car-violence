import { Typography } from "@/components/ui"
import { Colors } from "@/constants/Colors"
import { Entypo } from "@expo/vector-icons"
import { Link, LinkProps } from "expo-router"
import { SafeAreaView, ScrollView, StyleSheet, View, ViewProps } from "react-native"
interface LinkListItemProps {
    href: LinkProps["href"],
    title: string
}
interface LinkListProps extends ViewProps {
    items: LinkListItemProps[],

}
export const LinkList = ({ items, style, ...props }: LinkListProps) => {
    return <SafeAreaView style={[style]} {...props}>
        <ScrollView contentContainerStyle={[styles.container]}>
            {items.map((item, idx) => <ListItem key={idx}  {...item} />)}
        </ScrollView>
    </SafeAreaView>
}


export const ListItem = ({ href, title }: LinkListItemProps) => {
    return <Link href={href}>
        <View style={[styles.link]}><Typography style={[{ fontWeight: 'normal' }]} variant="h3">{title}</Typography>
            <Entypo name="chevron-right" size={32} color={Colors.light.notSelected} />
        </View>
    </Link>
}

const styles = StyleSheet.create({
    container: {
    },
    link: {
        width: '100%',
        height: 80,
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: Colors.light.borderColor,
        borderBottomWidth: 1.3,

    },
})
