import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoutes from '@/components/layouts/ProtectedRoutes'
import { adminRoutes } from '@/configs/routes/admin-routes'
import AppRoute from '@/components/layouts/AppRoute'
import PageLoader from '@/components/loaders/PageLoader'


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
