import { getFromStorage, saveToStorage } from "../utils";
import { rRefreshToken } from "./auth";

export const methods = {
    post: "POST",
    patch: "PATCH",
    get: "GET",
    delete: "DELETE",
    put: "PUT",
}
type dataType = Record<string, any> | FormData
interface customFetchProps {
    path: string;
    method: "POST" | "PATCH" | "GET" | "DELETE" | "PUT",
    withAuth?: boolean,
    query?: Record<string, any>
    data?: dataType

}
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
export const customFetch = async <T>({
    path,
    method,
    query,
    data,
    withAuth = false,
}: customFetchProps): Promise<T | undefined> => {
    try {
        // Construct URL with query parameters
        const url = new URL(`/api/v1/${path}`, BASE_URL);
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        // Initialize headers
        const headers = new Headers();
        let fetchBody: BodyInit | null = null;

        // Set Content-Type and body based on data type
        if (data) {
            if (data instanceof FormData) {
                fetchBody = data;
            } else {
                headers.append('Content-Type', 'application/json');
                fetchBody = JSON.stringify(data);
            }
        }

        // Append Authorization header if required
        if (withAuth) {
            const token = await getFromStorage('access');
            if (token) {
                headers.append('Authorization', `Bearer ${token}`);
            }
        }

        // Define a function to execute the fetch request
        const executeFetch = async (): Promise<Response> => {
            console.log(url)
            const controller = new AbortController();
            const timeout = 10000;

            // Wrap the abort call in an arrow function
            let timeoutId: NodeJS.Timeout | null = null
            if (method == 'GET') {
                timeoutId = setTimeout(() => controller.abort(), timeout);
            }

            try {
                const response = await fetch(url.toString(), {
                    method,
                    headers,
                    body: fetchBody,
                    signal: controller.signal,
                });
                return response;
            } finally {
                if (timeoutId) {
                    clearTimeout(timeoutId); // Ensure timeout is cleared regardless of success or error
                }
            }
        };

        // Execute the initial fetch request
        let response = await executeFetch();

        // Handle 401 Unauthorized by attempting token refresh
        if (response.status === 401 && withAuth) {
            const newAccessToken = await revalidateToken();
            if (newAccessToken) {
                headers.set('Authorization', `Bearer ${newAccessToken}`);
                response = await executeFetch();
            } else {
                throw new Error('Token refresh failed');
            }
        }

        // Check for other non-success status codes
        if (!response.ok) {
            throw {
                cause: response.status
            };
        }

        // Parse and return the response data
        const responseData: T = await response.json();
        return responseData;
    } catch (error) {
        console.log('customFetch error:', error);
        throw error;
    }
};

// Token refresh function
const revalidateToken = async (): Promise<string | null> => {
    try {
        const refresh = await getFromStorage('refresh');
        if (!refresh) {
            console.warn('No refresh token available');
            return null;
        }
        const response = await rRefreshToken(refresh);
        if (response && response.access) {
            // Optionally, store the new access token
            await saveToStorage('access', response.access);
            return response.access;
        }
        return null;
    } catch (error) {
        console.log('Token revalidation error:', error);
        return null;
    }
};
