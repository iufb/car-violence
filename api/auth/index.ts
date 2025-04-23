import { customFetch } from "../"

export const rConfirmCode = ({ tel }: { tel: string }) => {
    return customFetch({ method: "POST", path: 'send-code/', data: { phone_number: '+' + tel } })
}
export const rPasswordReset = (phone: string) => {
    return customFetch({ method: "POST", path: 'auth/request_password_reset/', data: { phone_number: phone } })
}
export const rConfirmPasswordReset = (data: { phone_number: string, code: string, new_password: string }) => {
    return customFetch({ method: "POST", path: 'auth/confirm_password_reset/', data })
}

export const rRegisterDevice = (data: {
    "registration_id": string, "type": string
}) => {
    return customFetch({ method: "POST", path: 'register-device/', data, withAuth: true })
}

export const rVerifyCode = (data: {
    phone_number: string,
    code: string,
    full_name: string,
    password: string
}) => {
    return customFetch({ method: "POST", path: 'verify-code/', data })
}

export const rLogin = (data: { phone_number: string, password: string }): Promise<{ access: string, refresh: string } | undefined> => {
    return customFetch({ method: "POST", path: 'login/', data })
}
export const rCheckToken = () => {
    return customFetch({ method: "GET", path: 'check-token', withAuth: true })
}
export const rRefreshToken = async (refresh: string): Promise<{ access: string } | undefined> => {
    console.log(refresh)
    const url = `${process.env.EXPO_PUBLIC_API_URL}/api/v1/token/refresh/`
    try {
        const response = await fetch(url, {
            method: "POST", body: JSON.stringify({ refresh }), headers: {
                'Content-type': 'application/json'
            }
        })
        if (!response.ok) {
            throw {
                message: "Error on refresh token!!!!",
                status: response.status,
                url: response.url,
            }
        }
        const data = await response.json()
        console.log(data)
        return data
    } catch (e) {
        console.log(e)
    }
}
