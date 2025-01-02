import { FormContainer } from "@/components/forms/FormContainer"
import { Button, Input, Typography } from "@/components/ui"
import { Colors } from "@/constants/Colors"
import { Link } from "expo-router"
import { useState } from "react"
import { StyleSheet, View } from "react-native"

export const LoginForm = () => {
    const [formData, setFormData] = useState({
        tel: "",
        password: "",
    })
    return <FormContainer><View style={[styles.container]}>
        <Input keyboardType="number-pad" value={formData.tel} onChangeText={value => setFormData({ ...formData, tel: value })} mask="+7(999) 999 99 99" label="Номер телефона" placeholder="+7 (777) 322 32 32" />
        <Input secureTextEntry value={formData.password} onChangeText={(_, text) => setFormData({ ...formData, password: text })} label="Пароль" placeholder="Введите пароль" />
        <Link style={[styles.link]} href={'/(auth)/restore'}>Забыли пароль?</Link>
        <Button>Войти</Button>
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
