import { FormContainer } from "@/components/forms/FormContainer"
import { Button, Input } from "@/components/ui"
import { Colors } from "@/constants/Colors"
import { useState } from "react"
import { StyleSheet, View } from "react-native"

export const RestoreForm = () => {
    const [formData, setFormData] = useState({
        tel: "",
        password: "",
        confirmPassword: "",
    })
    return <FormContainer><View style={[styles.container]}>
        <Input keyboardType="number-pad" value={formData.tel} onChangeText={value => setFormData({ ...formData, tel: value })} mask="+7 (999) 999 99 99" label="Номер телефона" placeholder="+7 (777) 322 32 32" />
        <Input secureTextEntry value={formData.password} onChangeText={value => setFormData({ ...formData, password: value })} label="Пароль" placeholder="Введите пароль" />
        <Input secureTextEntry value={formData.confirmPassword} onChangeText={value => setFormData({ ...formData, confirmPassword: value })} label="Подтвердите пароль" placeholder="Подтвердите пароль" />
        <Button>Обновить пароль</Button>
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
