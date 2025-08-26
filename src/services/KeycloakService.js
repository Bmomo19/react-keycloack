import keycloak from "../config/keycloak";

export class KeycloakService {
    constructor() {
        this.keycloak = keycloak;
    }

    async init() {
        try {
            if (!this.keycloak._initialized) {
                this.keycloak._initialized = true;
                const authenticated = await this.keycloak.init({
                    onLoad: "login-required"
                });

                if (authenticated) {
                    this.setupTokenRefresh();
                }

                return authenticated;
            }
        } catch (error) {
            console.error('Erreur d\'initialisation Keycloak:', error);
            return false;
        }
    }

    setupTokenRefresh() {
        // Rafraîchir le token automatiquement
        setInterval(() => {
            this.keycloak.updateToken(30).catch(() => {
                console.log('Impossible de rafraîchir le token');
            });
        }, 30000);
    }

    login() {
        this.keycloak.login();
    }

    logout() {
        this.keycloak.logout({
            redirectUri: window.location.origin,
        });
    }

    getToken() {
        return this.keycloak.token;
    }

    getRefreshToken() {
        return this.keycloak.refreshToken;
    }

    isAuthenticated() {
        return !!this.keycloak.authenticated;
    }

    getUserInfo() {
        return this.keycloak.tokenParsed;
    }

    hasRole(role) {
        return this.keycloak.hasRealmRole(role);
    }

    async refreshToken() {
        try {
            return await this.keycloak.updateToken(5);
        } catch (error) {
            console.error('Erreur lors du rafraîchissement du token:', error);
            return false;
        }
    }
}

export default new KeycloakService();
