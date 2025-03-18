import { Colors } from "@/constants/Colors";
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from '@react-navigation/elements';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabs = {
    index: {
        label: 'Главная',
        icon: (color: string) => <MaterialCommunityIcons color={color} name="home" size={28} />,
        href: '/home',
    },
    myVideos: {
        label: 'Мои Видео',
        icon: (color: string) => <MaterialCommunityIcons color={color} name="video-image" size={28} />,
        href: '/myVideos',
    },
    add: {
        label: 'Добавить',
        icon: (color: string) => <MaterialCommunityIcons color={color} name="plus" size={27} />,
        href: '/add',
    },
    services: {
        label: 'Услуги',
        icon: (color: string) => <FontAwesome5 color={color} name="clipboard-list" size={28} />,
        href: '/services',
    },
    profile: {
        label: 'Профиль',
        icon: (color: string) => <FontAwesome color={color} name="user" size={28} />,
        href: '/profile',
    },
};

export function Tabbar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets()
    const { buildHref } = useLinkBuilder();
    const routes = [state.routes[0], state.routes[3], state.routes[1], state.routes[4], state.routes[2]]
    return (
        <View style={[TabbarStyles.container, { paddingTop: 8, paddingBottom: (insets.bottom) + 8, display: state.index == 1 ? 'none' : 'flex' }]}>
            {
                routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = tabs[route.name as keyof typeof tabs].label
                    const icon = tabs[route.name as keyof typeof tabs].icon
                    const isFocused = mapIndex(state.index) == index

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };
                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,

                        });
                    };
                    //animations
                    const scale = useSharedValue(0)
                    const addWidth = useSharedValue(42)
                    useEffect(() => {
                        scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 })
                        addWidth.value = withSpring(isFocused ? 50 : 42, { duration: 300 })
                    }, [scale, isFocused])
                    const animatedTextStyle = useAnimatedStyle(() => {
                        const opacity = interpolate(scale.value, [0, 1], [1, 0])
                        return { opacity }
                    })

                    const animatedIconStyle = useAnimatedStyle(() => {
                        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.3])
                        const top = interpolate(scale.value, [0, 1], [0, 9])
                        return {
                            transform: [{ scale: scaleValue }],
                            top
                        }
                    })
                    return (
                        <PlatformPressable
                            pressColor={Colors.light.background}
                            key={route.key}
                            href={buildHref(route.name, route.params)}
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarButtonTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={[TabbarItemStyles.container]}
                        >
                            {route.name == 'add' && <View style={[TabbarItemStyles.addIcon]} >
                                {tabs.add.icon(Colors.light.background)}
                            </View>}
                            {route.name !== 'add' &&
                                <View style={[TabbarItemStyles.container]}>
                                    <Animated.View style={[animatedIconStyle]}>
                                        {icon(isFocused ? Colors.light.selected : Colors.light.notSelected)}
                                    </Animated.View>
                                    <Animated.Text allowFontScaling={false} style={[{ color: isFocused ? Colors.light.selected : Colors.light.notSelected, }, animatedTextStyle]}>
                                        {label}
                                    </Animated.Text>
                                </View>
                            }
                        </PlatformPressable>
                    );
                })
            }
        </View >
    );
}




const TabbarStyles = StyleSheet.create({
    container: {
        borderTopColor: Colors.light.borderColor,
        borderTopWidth: 1,
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginHorizontal: 'auto',
        backgroundColor: Colors.light.background
    }
})
const TabbarItemStyles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 18, height: 18
    },
    addContainer: {
        width: 50,
        height: '100%',
        marginHorizontal: 'auto'
    },
    addIcon: {
        height: 42, width: 42, backgroundColor: Colors.light.primary,
        borderRadius: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'
    }


})
const mapIndex = (idx: number) => {
    switch (idx) {
        case 3: return 1;
        case 1: return 2;
        case 4: return 3;
        case 2: return 4;
        case 0: return 0;
        default: return idx
    }
}
