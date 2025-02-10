import { rConfirmCode } from "@/api/auth"
import { FormContainer } from "@/components/forms/FormContainer"
import { Button, Checkbox, Input, Typography } from "@/components/ui"
import { Colors } from "@/constants/Colors"
import { errorMsgs } from "@/consts"
import { RegisterDTO } from "@/types"
import { useMutation } from "@tanstack/react-query"
import { Link, useRouter } from "expo-router"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"

export const RegisterForm = () => {
    const { mutateAsync: sendCode, isPending } = useMutation({
        mutationKey: ['sendConfirmCode'], mutationFn: (tel: string) => rConfirmCode({ tel }),
        onError: (e) => {
            console.log(e)
        }
    })
    const router = useRouter()
    const { handleSubmit, watch, formState: { errors }, control } = useForm<RegisterDTO & { confirmPassword: string }>({ mode: "onChange" })
    const [rulesConfirm, setRulesConfirm] = useState(false)
    const password = watch('password', '')
    const submit: SubmitHandler<any> = (data) => {
        console.log(data)
        sendCode(data.tel).then(() => {
            router.push(`/(auth)/confirmation?info=${JSON.stringify(data)}&type=register`)
        })
    }
    const isDisabled = Object.keys(errors).length !== 0 || !rulesConfirm;
    return <FormContainer style={[styles.container]}>
        <Input control={control} name="name" required={false} label="ФИО" input={{ placeholder: "Ваше ФИО" }} />
        <Input name="tel" control={control} input={{
            keyboardType: "number-pad", mask: "+7 (999) 999 99 99",
            placeholder: "+7 (777) 322 32 32"
        }} label="Номер телефона" rules={{ required: errorMsgs.required }} error={errors?.tel?.message} />
        <Input name="password" control={control} input={{ secureTextEntry: true, placeholder: "Создайте пароль" }} label="Пароль"
            rules={{
                required: errorMsgs.required,
                validate: {
                    hasNumber: (value) =>
                        /\d/.test(value) || errorMsgs.register.hasNumber,
                    hasUpperCase: (value) =>
                        /[A-Z]/.test(value) ||
                        errorMsgs.register.hasUpperCase,
                    hasMinimumLength: (value) =>
                        value.length >= 8 ||
                        errorMsgs.register.hasMinimumLength
                },
            }}
            error={errors.password?.message}
        />
        <Input rules={{
            required: errorMsgs.required,
            validate: {
                isEqual: (value) => value == password || errorMsgs.register.passwordsDoNotMatch

            }
        }} error={errors.confirmPassword?.message} name="confirmPassword" control={control} input={{ secureTextEntry: true, placeholder: "Подтвердите пароль" }} label="Подтвердите пароль" />

        <View style={[styles.rulesContainer]}>
            <Checkbox checked={rulesConfirm} onCheck={() => setRulesConfirm(!rulesConfirm)} />
            <Typography variant="p2" style={[styles.rulesText]}>
                Я прочитал(а) и согласен(на) с <Link style={[styles.link]} href={'/'}>Условиями использования</Link> и <Link style={[styles.link]} href={'/'}>Политикой конфиденциальности</Link>.
            </Typography>
        </View>
        <Button loading={isPending} disabled={isDisabled || isPending} onPress={handleSubmit(submit)}>Создать аккаунт</Button>
        <Typography style={{ marginTop: 10, textAlign: 'center' }} variant="span">Есть аккаунт? <Link style={[styles.link]} href={'/(auth)/login'}>Войти</Link></Typography>
    </FormContainer >
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
    rulesText: {
        width: '90%'
    },
    link: {
        color: Colors.light.primary
    },
})
