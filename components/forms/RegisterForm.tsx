import { FormContainer } from "@/components/forms/FormContainer"
import { Button, Checkbox, Input, Typography } from "@/components/ui"
import { Colors } from "@/constants/Colors"
import { Link, useRouter } from "expo-router"
import { useState } from "react"
import { StyleSheet, View } from "react-native"

export const RegisterForm = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        tel: "",
        password: "",
        confirmPassword: "",
        rulesConfirm: false
    })
    return <FormContainer><View style={[styles.container]}>
        <Input value={formData.name} onChangeText={value => setFormData({ ...formData, name: value })} label="ФИО" placeholder="Ваше ФИО" />
        <Input keyboardType="number-pad" value={formData.tel} onChangeText={value => setFormData({ ...formData, tel: value })} mask="+7 (999) 999 99 99" label="Номер телефона" placeholder="+7 (777) 322 32 32" />
        <Input secureTextEntry value={formData.password} onChangeText={value => setFormData({ ...formData, password: value })} label="Пароль" placeholder="Создайте пароль" />
        <Input secureTextEntry value={formData.confirmPassword} onChangeText={value => setFormData({ ...formData, confirmPassword: value })} label="Подтвердите пароль" placeholder="Подтвердите пароль" />
        <View style={[styles.rulesContainer]}>
            <Checkbox checked={formData.rulesConfirm} onCheck={() => setFormData({ ...formData, rulesConfirm: !formData.rulesConfirm })} />
            <Typography variant="p2">
                Я прочитал(а) и согласен(на) с <Link style={[styles.link]} href={'/'}>Условиями использования</Link> и <Link style={[styles.link]} href={'/'}>Политикой конфиденциальности</Link>.
            </Typography>
        </View>
        <Button onPress={() => {
            router.push(`/(auth)/confirmation?info=${formData.tel}`)
        }}  >Создать аккаунт</Button>
        <Typography style={{ marginTop: 10, textAlign: 'center' }} variant="span">Есть аккаунт? <Link style={[styles.link]} href={'/(auth)/login'}>Войти</Link></Typography>
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
