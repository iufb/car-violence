import { rPasswordReset } from "@/api/auth"
import { FormContainer } from "@/components/forms/FormContainer"
import { Button, Input } from "@/components/ui"
import { Colors } from "@/constants/Colors"
import { errorMsgs } from "@/consts"
import { ResetPasswordDTO } from "@/types"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import Toast from "react-native-toast-message"

export const RestoreForm = () => {
    const { mutateAsync: sendCode, isPending } = useMutation({
        mutationKey: ['restorePassword'], mutationFn: rPasswordReset,
        onError: (e) => {

            console.log(e)
            if (e.cause == 404) {
                Toast.show({ type: 'error', text1: "Ошибка", text2: "Пользователь с таким номером не существует." })
            } else {

                Toast.show({ type: 'error', text1: "Ошибка", text2: "Что-то пошло не так." })
            }
        }
    })
    const router = useRouter()
    const { handleSubmit, watch, formState: { errors }, control } = useForm<ResetPasswordDTO & { confirmPassword: string }>({
        mode: "onChange", defaultValues: {
            phone: '7773245285',
            new_password: '19931991iuN',
            confirmPassword: '19931991iuN',
        }
    })
    const [rulesConfirm, setRulesConfirm] = useState(false)
    const password = watch('new_password', '')
    const submit: SubmitHandler<ResetPasswordDTO & { confirmPassword: string }> = (data) => {
        console.log(data, "RESET DATA")
        sendCode('+' + data.phone).then(() => {
            router.push(`/(auth)/confirmation?info=${JSON.stringify(data)}&type=reset`)
        })
    }

    return <FormContainer><View style={[styles.container]}>
        <Input name="phone" control={control} input={{
            keyboardType: "number-pad", mask: "+7 (999) 999 99 99",
            placeholder: "+7 (777) 322 32 32"
        }} label="Номер телефона" rules={{ required: errorMsgs.required }} error={errors?.phone?.message} />
        <Input name="new_password" control={control} input={{ secureTextEntry: true, placeholder: "Новый пароль" }} label="Новый пароль"
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
            error={errors.new_password?.message}
        />
        <Input rules={{
            required: errorMsgs.required,
            validate: {
                isEqual: (value) => value == password || errorMsgs.register.passwordsDoNotMatch
            }

        }} error={errors.confirmPassword?.message} name="confirmPassword" control={control} input={{ secureTextEntry: true, placeholder: "Подтвердите ваш новый пароль" }} label="Подтвердите пароль" />
        <Button onPress={handleSubmit(submit)} loading={isPending} disabled={isPending}>Обновить пароль</Button>
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
