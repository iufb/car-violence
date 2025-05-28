import { Typography } from "@/components/ui/Typography";

import { Colors } from "@/constants/Colors";
import { status } from "@/consts";
import { getFileType, rS, rV } from "@/utils";
import { Entypo } from "@expo/vector-icons";
import { Link, LinkProps } from "expo-router";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import FastImage from "react-native-fast-image";

interface CardProps extends ViewProps {
    variant: 'base' | 'horizontal'
    img?: string,
    title: string,
    subtitle?: string,
    desc: string,
    link: LinkProps['href'],
}

export const Card = ({ variant = 'base', link, title, img, subtitle, desc, style, ...props }: CardProps) => {

    const isHorizontal = variant == 'horizontal'
    const isVideo = img && getFileType(img) == 'video'
    return <Link href={link}><View style={[style, styles[variant], styles.container,]} {...props}>
        <View style={[isHorizontal ? styles.horizontalImg : styles.baseImg]}>
            {img ?
                <FastImage defaultSource={require('../../assets/fallback.png')} style={[{ width: '100%', height: '100%', borderRadius: 10 }]} source={isVideo ? require('../../assets/video.png') : { uri: img }} /> : <View style={[styles.skeleton]} />}</View>
        <View style={[styles.textContainer, isHorizontal && styles.horizontalText]}>
            <Typography variant="h3" numberOfLines={2}>{title}</Typography>
            <Typography numberOfLines={1} variant="span">{subtitle}</Typography>
            {isHorizontal ? <View style={[styles.statusWrapper]}>
                <Text>Статус:</Text>
                <View style={[styles.statusContainer, { backgroundColor: Colors.light.status['1'], }]}><Text style={[styles.statusText, { color: Colors.light.statusText['1'] }]}>
                    {status[1]}
                </Text></View>
            </View> : <Typography numberOfLines={isHorizontal ? 1 : 2} ellipsizeMode="tail" variant="p2">{desc}</Typography>}
        </View>
        {variant == 'horizontal' &&
            <Entypo name="chevron-right" size={32} color={Colors.light.notSelected} style={[styles.icon]} />}
    </View></Link>
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderRadius: 10,

        backgroundColor: Colors.light.cardBg,
    },
    base: {
        flexDirection: 'row',
        height: rV(110),
        gap: 10,
        padding: 10,
    },
    baseImg: {
        width: '40%',
        height: 'auto'
    },
    horizontal: {
        flexDirection: 'row',
        backgroundColor: Colors.light.slate200,
        paddingVertical: rS(4),
        paddingLeft: rS(5),
        paddingRight: rS(8),
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
    skeleton: {
        width: '100%', height: '100%', borderRadius: 10, backgroundColor: Colors.light.slate200
    },
    textContainer: {
        width: '100%',
        gap: rV(2),
        paddingLeft: rS(10),
        flex: 1,

    },
    statusWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3
    },
    statusContainer: {
        paddingHorizontal: rS(6),
        paddingVertical: rV(2),
        borderRadius: 10
    },
    statusText: {},
})
