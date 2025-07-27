import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoutes from '@/components/layouts/ProtectedRoutes'
import { adminRoutes } from '@/configs/routes/admin-routes'
import AppRoute from '@/components/layouts/AppRoute'
import PageLoader from '@/components/loaders/PageLoader'
import { employeeRoutes } from '@/configs/routes/employee-routes'
import { advisorRoutes } from '@/configs/routes/advisor-routes'
import { publicRoutes } from '@/configs/routes/public-routes'


const AllRoutes = () => {
    return (
        <Routes>
            {/* All admin routes */}
            <Route path="/admin" element={<ProtectedRoutes />}>
                {
                    adminRoutes?.map((route) => (
                        <Route
                            key={route.name}
                            path={route.path}
                            element={<AppRoute {...route} />}
                        />
                    ))
                }
            </Route>

            {/* All employee routes */}
            <Route path="/employee" element={<ProtectedRoutes />}>
                {
                    employeeRoutes?.map((route) => (
                        <Route
                            key={route.name}
                            path={route.path}
                            element={<AppRoute {...route} />}
                        />
                    ))
                }
            </Route>

            {/* All Advisor Routes */}
            <Route path="/advisor" element={<ProtectedRoutes />}>
                {
                    advisorRoutes?.map((route) => (
                        <Route
                            key={route.name}
                            path={route.path}
                            element={<AppRoute {...route} />}
                        />
                    ))
                }
            </Route>

            {/* Public routes */}
            <Route path="/">
                {
                    publicRoutes?.map((route) => (
                        <Route
                            key={route.name}
                            path={route.path}
                            element={<AppRoute {...route} />}
                        />
                    ))
                }
            </Route>
        </Routes>
    )
}


const Pages = () => {
    return (
        <>
            <Suspense fallback={<PageLoader />}>
                <AllRoutes></AllRoutes>
            </Suspense>
        </>
    )
}

export default Pages
