import { customFetch } from "../"
import { MediaDTO, News } from "../../types"
export const rGetMediaList = (query: { type: string, limit: number }): Promise<MediaDTO[] | undefined> => {
    return customFetch({
        path: 'mediafiles/list/', method: "GET", withAuth: true, query
    })
}
export const rGetPresignedUrl = (body: { media_id: string, file_name: string, content_type: string }): Promise<{ file_key: string, upload_url: string } | undefined> => {
    return customFetch({ path: `mediafiles/generate-upload/`, method: "POST", withAuth: true, data: body })
}
export const rConfirmUpload = (body: { media_id: string, file_key: string }) => {
    return customFetch({ path: 'mediafiles/confirm-upload/', method: 'POST', withAuth: true, data: body })
}
export const rGetMediaById = (id: number): Promise<MediaDTO | undefined> => {
    return customFetch({ path: `mediafiles/detail/`, method: "GET", withAuth: true, query: { id } })
}
export const rSendViolence = (body: FormData): Promise<{ id: number } | undefined> => {
    return customFetch({ path: 'mediafiles/upload/', method: "POST", data: body, withAuth: true })
}

export const rGetNewsList = (limit: number): Promise<News[] | undefined> => {
    return customFetch({ path: 'news/list/', method: "GET", withAuth: true, query: { limit } })
}
export const rGetNewsById = (id: number): Promise<News | undefined> => {
    return customFetch({ path: `news/detail/`, method: "GET", withAuth: true, query: { id } })
}
