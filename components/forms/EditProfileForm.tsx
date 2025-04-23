import { Button, ImageInput, Input } from "@/components/ui"
import { Colors } from "@/constants/Colors"
import { useRouter } from "expo-router"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
interface FormProps {
    photo: string;
    name: string

}
export const EditProfileForm = () => {
    const router = useRouter()
    const { register, control, formState: { errors }, handleSubmit, reset } = useForm<FormProps>()
    const onSubmit: SubmitHandler<FormProps> = (data) => {
        console.log(data)
    }
    return <View style={[styles.container]}>
        <Controller
            name="photo"
            control={control}
            render={({ field: { onChange, value, onBlur } }) =>
                <ImageInput label="Фото" value={value} setImage={(img) => onChange(img[0])} />}
        />
        <Input name="name" control={control} input={{ placeholder: "Ваше ФИО" }} required={false} label="ФИО" />
        <Button onPress={handleSubmit(onSubmit)}>Сохранить</Button>
    </View>
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
