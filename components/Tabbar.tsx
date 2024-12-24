import { Colors } from "@/constants/Colors";
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from '@react-navigation/elements';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const tabs = {
    index: {
        label: 'Главная',
        icon: (color: string) => <MaterialCommunityIcons color={color} name="home" size={28} />,
        href: '/index',
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
    const { buildHref } = useLinkBuilder();
    const [selected, setSelected] = useState(0)
    const routes = [state.routes[0], state.routes[3], state.routes[1], state.routes[4], state.routes[2]]
    return (
        <View style={[TabbarStyles.container]}>
            {
                routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = tabs[route.name as keyof typeof tabs].label
                    const icon = tabs[route.name as keyof typeof tabs].icon

                    const isFocused = selected == index
                    console.log(index, state.index)

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                        setSelected(index)
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
                                    <Animated.Text style={[{ color: isFocused ? Colors.light.selected : Colors.light.notSelected }, animatedTextStyle]}>
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
        paddingHorizontal: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 20,
        height: 66,
        backgroundColor: Colors.light.background
    }
})
const TabbarItemStyles = StyleSheet.create({
    container: {
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