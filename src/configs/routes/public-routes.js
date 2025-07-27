import { lazy } from "react";

export const publicRoutes = [
    {
        path: "register",
        name: "Register",
        component: lazy(() => import('@/pages/auth/Register'))
    },
    {
        path: "sign-in",
        name: "Sign In",
        component: lazy(() => import('@/pages/auth/SignIn'))
    }
]