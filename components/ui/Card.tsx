import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/Colors";
import { rV } from "@/utils";
import { Entypo } from "@expo/vector-icons";
import { Link, LinkProps } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, View, ViewProps } from "react-native";
interface CardProps extends ViewProps {
    variant: 'base' | 'horizontal',
    img: string,
    title: string,
    subtitle?: string,
    color?: string,
    desc: string,
    link: LinkProps['href'],
}
export const Card = ({ variant = 'base', link, title, color, img, subtitle, desc, style, ...props }: CardProps) => {
    const [uri, setUri] = useState(img)
    const handleImgError = () => {
        setUri(
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiJ5rAqr1pIi6pHOdFGGijRXcE4HLHqWJNSw&s'
        )
    }
    const isHorizontal = variant == 'horizontal'
    return <Link href={link}><View style={[style, styles[variant], { backgroundColor: color }, styles.container,]} {...props}>
        <Image style={[{ width: "100%", height: '100%', borderRadius: 10, flex: 2 }, isHorizontal && styles.horizontalImg]} source={{ uri }} onError={handleImgError} />
        <View style={[styles.textContainer, isHorizontal && styles.horizontalText]}>
            <Typography center={!isHorizontal} variant="h3">{title}</Typography>
            <Typography center={!isHorizontal} variant="span">{subtitle}</Typography>
            <Typography variant="p2">{desc.length > 18 ? desc.slice(0, 18) + "..." : desc}</Typography>
        </View>
        {variant == 'horizontal' &&
            <Entypo name="chevron-right" size={32} color={Colors.light.notSelected} style={[styles.icon]} />}
    </View></Link>
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    base: {
        flexDirection: 'column',
        gap: 10,
        backgroundColor: Colors.light.slate200,

    },
    horizontal: {
        flexDirection: 'row',
        backgroundColor: Colors.light.slate200,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        gap: 2,
        height: rV(90)
    },
    horizontalImg: {
        flex: 4,
        marginRight: 20
    },
    horizontalText: {
        flex: 9
    },
    icon: {
        flex: 1
    },
    textContainer: {
        width: '100%',
        gap: 5,
        paddingLeft: 5,
        flex: 1,
    },
})
