import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import KeycloakService from './KeycloakService';


class ApiService {
    private api: AxiosInstance;
    private _kc: typeof KeycloakService;

    constructor() {
        this._kc = KeycloakService;
        this.api = axios.create({
            baseURL: 'http://localhost:8000/api',
            timeout: 10000,
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Intercepteur de requête pour ajouter le token
        this.api.interceptors.request.use(
            (config) => {
                const token = this._kc.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Intercepteur de réponse pour gérer l'expiration du token
        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    try {
                        const refreshed = await this._kc.refreshToken();
                        if (refreshed && error.config) {
                            // Retry la requête avec le nouveau token
                            const newToken = this._kc.getToken();
                            error.config.headers.Authorization = `Bearer ${newToken}`;
                            return this.api(error.config);
                        }
                    } catch (refreshError) {
                        console.error('Erreur lors du rafraîchissement du token:', refreshError);
                        this._kc.logout();
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.get<T>(url, config);
        return response.data;
    }

    public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.post<T>(url, data, config);
        return response.data;
    }

    public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.put<T>(url, data, config);
        return response.data;
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.delete<T>(url, config);
        return response.data;
    }
}

export default new ApiService();