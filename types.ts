export type ConfirmationType = 'register' | 'reset'
export interface ResetPasswordDTO {
    phone: string, code: string, new_password: string
}
export interface RegisterDTO {
    name: string,
    tel: string,
    password: string
}
export interface LoginDTO {
    tel: string,
    password: string
}
export type MediaList = {
    id: number,
    video_file: string
}[]

export interface MediaDTO {
    city: string
    description: string
    id: number
    street: string
    uploaded_at: string
    user: number
    videos: MediaList, was_at_date: string
    was_at_time: string

}

export interface News {
    id: number;
    title: string;
    text: string;
    createdAt: string;
    media: MediaList
}
