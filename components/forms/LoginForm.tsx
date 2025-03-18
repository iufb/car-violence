import { rLogin } from "@/api/auth"
import { FormContainer } from "@/components/forms/FormContainer"
import { Button, Input, Typography } from "@/components/ui"
import { Colors } from "@/constants/Colors"
import { errorMsgs } from "@/consts"
import { LoginDTO } from "@/types"
import { useMutation } from "@tanstack/react-query"
import { Link, useRouter } from "expo-router"
import * as SecureStorage from 'expo-secure-store'
import { SubmitHandler, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import Toast from "react-native-toast-message"

export const LoginForm = () => {
    const router = useRouter()
    const { mutate: login, isPending } = useMutation({
        mutationKey: ['login'], mutationFn: rLogin,
        onSuccess: async (data?: { access: string, refresh: string }) => {
            if (data) {
                console.log(data)
                await SecureStorage.setItemAsync('access', data.access)
                await SecureStorage.setItemAsync('refresh', data.refresh)
                router.push('/')
            }
            console.log(data)
        },
        onError: (e) => {
            Toast.show({ type: 'error', text1: "Ошибка", text2: "Произошла ошибка при входе" })
            console.log(e)
        }
    })
    const { handleSubmit, watch, formState: { errors }, control } = useForm<LoginDTO>()
    const submit: SubmitHandler<any> = (data) => {
        login({ phone_number: "+" + data.tel, password: data.password })

        console.log({ phone_number: "+" + data.tel, password: data.password })
    }

    return <FormContainer>
        <View style={[styles.container]}>
            <Input name="tel" control={control} input={{
                keyboardType: "number-pad", mask: "+7 (999) 999 99 99",
                placeholder: "+7 (777) 322 32 32"
            }} label="Номер телефона" rules={{ required: errorMsgs.required }} error={errors?.tel?.message} />
            <Input rules={{
                required: errorMsgs.required,
            }} error={errors.password?.message} name="password" control={control} input={{ secureTextEntry: true, placeholder: "Пароль" }} label="Пароль" />
            <Link style={[styles.link]} href={'/(auth)/restore'}>Забыли пароль?</Link>
            <Button disabled={isPending} loading={isPending} onPress={handleSubmit(submit)}>Войти</Button>
            <Typography style={{ marginTop: 10, textAlign: 'center' }} variant="span"> Нет аккаунта?  <Link style={[styles.link]} href={'/(auth)/register'}>Зарегистрируйтесь</Link></Typography>
        </View></FormContainer>
}
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        gap: 10,
    },
    rulesContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12
    },
    link: {
        color: Colors.light.primary
    }
})
