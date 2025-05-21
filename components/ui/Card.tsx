import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/Colors";
import { getFileType, rS, rV } from "@/utils";
import { Entypo } from "@expo/vector-icons";
import { Link, LinkProps } from "expo-router";
import { Image, StyleSheet, View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
    variant: 'base' | 'horizontal',
    img?: string,
    title: string,
    subtitle?: string,
    color?: string,
    desc: string,
    link: LinkProps['href'],
}

export const Card = ({ variant = 'base', link, title, color, img, subtitle, desc, style, ...props }: CardProps) => {

    const isHorizontal = variant == 'horizontal'
    const isVideo = img && getFileType(img) == 'video'
    return <Link href={link}><View style={[style, styles[variant], { backgroundColor: color }, styles.container,]} {...props}>
        <Image fadeDuration={100} defaultSource={require('../../assets/fallback.png')} style={[{ width: "100%", height: '100%', borderRadius: 10, flex: 2 }, isHorizontal && styles.horizontalImg]} source={isVideo ? require('../../assets/video.png') : { uri: img }} />
        <View style={[styles.textContainer, isHorizontal && styles.horizontalText]}>
            <Typography variant="h3" numberOfLines={2}>{title}</Typography>
            <Typography variant="span">{subtitle}</Typography>
            <Typography numberOfLines={isHorizontal ? 1 : 2} ellipsizeMode="tail" variant="p2">{desc}</Typography>
        </View>
        {variant == 'horizontal' &&
            <Entypo name="chevron-right" size={32} color={Colors.light.notSelected} style={[styles.icon]} />}
    </View></Link>
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#cbd5e1",
    },
    base: {
        flexDirection: 'column',
        gap: 10,
        backgroundColor: Colors.light.slate200,
        padding: 10,
        paddingBottom: 0

    },
    horizontal: {
        flexDirection: 'row',
        backgroundColor: Colors.light.slate200,
        paddingVertical: rS(10),
        paddingHorizontal: rS(10),
        borderRadius: 10,
        height: rV(70)
    },
    horizontalImg: {
        flex: 4,
        marginRight: rS(5)
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
        paddingLeft: rS(10),
        flex: 1,

    },
})
