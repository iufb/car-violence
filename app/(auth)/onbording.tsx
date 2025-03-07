
import { ScreenContainer } from "@/components";
import { Button, Typography } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { rS, rV } from "@/utils";
import { Link, Tabs, useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { Image, LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInRight, FadeInUp, FadeOutLeft, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const steps = [
    {
        img: require('../../assets/onbording/1.png'),
        title: "Обеспечиваем порядок на дорогах вместе!",
        desc: "Станьте частью сообщества, которое заботится о безопасности на дорогах общего пользования.",
    },
    {
        img: require('../../assets/onbording/2.png'),
        title: "Фиксируйте нарушения на дорогах",
        desc: "Снимайте фото или видео нарушений и помогайте улучшить безопасность.",
    },
    {
        img: require('../../assets/onbording/3.png'),
        title: "Отправляйте данные в органы правопорядка",
        desc: "В пару кликов ваше обращение будет передано для рассмотрения и действий.",
    },
    {
        img: require('../../assets/onbording/4.png'),
        title: "Получайте вознаграждения за ответственность",
        desc: "Ваша активная гражданская позиция может быть не только полезной, но и вознаграждаемой.",
    },
    {
        img: require('../../assets/onbording/5.png'),
        title: "Начнем?",
        desc: "Присоединяйтесь и сделайте дороги безопаснее!",
    },
];


export default function Onbording() {
    const [step, setStep] = useState(0)
    const router = useRouter()
    const handleNext = async () => {
        if (step == 4) {
            router.push('/register')
            return;
        }
        if (step == 3) {
            await SecureStore.setItemAsync('isFirstBoot', 'false')
        }
        setStep(step + 1)
    }
    return <ScreenContainer style={[style.container]}>
        <Tabs.Screen options={{ headerShown: false }} />
        <Animated.View key={'i' + step} entering={FadeInUp} >
            <Image source={steps[step].img} style={[style.image]} />
        </Animated.View>
        {step !== 4 && <Stepper current={step} handlePress={(step: number) => {
            setStep(step)
        }} />}
        <Animated.View key={step} style={[style.textContainer]} entering={FadeInRight} exiting={FadeOutLeft}>
            <Typography variant="h1" style={{ textAlign: 'center' }}>{steps[step].title}</Typography>
            <Typography color={Colors.light.notSelected} variant="p1" style={{ textAlign: 'center' }}>{steps[step].desc}</Typography>
        </Animated.View>

        <View style={[style.btnContainer]}>
            <Button variant="primary" onPress={handleNext} >{step == 4 ? "Создать аккаунт" : "Дальше"}</Button>
            {step == 4 && <Typography style={{ marginTop: 10, textAlign: 'center' }} variant="span">Есть аккаунт? <Link style={[style.signin]} href={'/login'}>Войти</Link></Typography>}
        </View>

    </ScreenContainer>
}
const Stepper = ({ current, handlePress }: { current: number, handlePress: (step: number) => void }) => {
    const [dim, setDim] = useState({ width: 100, height: 20 })
    const stepWidth = (dim.width - 30) / 4
    const onStepperLayout = (e: LayoutChangeEvent) => {
        setDim({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })
    }
    const stepPositionX = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: stepPositionX.value }]
        }
    })

    useEffect(() => {
        stepPositionX.value = withSpring((stepWidth + 10) * current, { duration: 1000, stiffness: 10, dampingRatio: 1 })
    }, [current])
    return <View onLayout={onStepperLayout} style={[style.stepper]}>
        <Animated.View style={[{
            position: 'absolute',
            backgroundColor: Colors.light.primary,
            borderRadius: 10,
            height: dim.height,
            width: stepWidth,
            zIndex: 10,
        }, animatedStyle]} />

        {new Array(4).fill('.').map((step, idx) => <Pressable key={idx} onPress={() => handlePress(idx)} style={{ flex: 1 }}><View style={[{
            borderRadius: 10,
            height: rV(8),
            backgroundColor: Colors.light.gray,
        }]} /></Pressable>)}
    </View>

}

const style = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: "space-evenly"
    },
    image: {
        width: rS(300), height: rV(300)
    },
    signin: {
        color: Colors.light.primary,
        textAlign: 'center',
    },
    btnContainer: {
        width: '100%',
    },
    textContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: rS(20),
        marginBottom: rV(30),
    },
    stepper: {
        width: '80%',
        gap: rS(10),
        marginHorizontal: 'auto',
        height: rV(8),
        display: 'flex',
        flexDirection: 'row'
    },
    step: {
        backgroundColor: Colors.light.notSelected,
        height: rV(8),
    },
})

