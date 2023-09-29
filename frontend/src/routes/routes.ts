const BASE_ROUTES = {
    MARKETING: '/',
    AUTH: '/auth',
    DASHBOARD: '/dashboard',
}

export const routes = {
    home: BASE_ROUTES.MARKETING,
    auth: {
        login: `${BASE_ROUTES.AUTH}/login`,
        activate: `${BASE_ROUTES.AUTH}/activate`,
        forgotPassword: `${BASE_ROUTES.AUTH}/forgot-password`,
        resetPassword: `${BASE_ROUTES.AUTH}/reset-password`,
    },
    dashboard: {
        root: BASE_ROUTES.DASHBOARD,
        apps: `${BASE_ROUTES.DASHBOARD}/apps`,
        data: {
            root: `${BASE_ROUTES.DASHBOARD}/data`,
            trash: `${BASE_ROUTES.DASHBOARD}/data/trash`,
        },
        user: {
            root: `${BASE_ROUTES.DASHBOARD}/user`,
            account: `${BASE_ROUTES.DASHBOARD}/user/account`,
        },
    },
}
