import { AxiosRequestConfig } from 'axios';

export default function makeConfig(
    method: string,
    route: string,
    token?: string,
    data?: object
): AxiosRequestConfig {
    return {
        method: method,
        url: import.meta.env.VITE_API_ORIGIN + route,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        data: data
    };
}