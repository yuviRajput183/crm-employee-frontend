import { lazy } from "react";

export const employeeRoutes = [
    {
        path: "dashboard",
        name: "Dashboard",
        component: lazy(() => import('@/pages/Dashboard'))
    },
    {
        path: "add_lead",
        name: "Add Lead",
        component: lazy(() => import('@/components/shared/AddLead'))
    },
    {
        path: "new_leads",
        name: "New Lead",
        component: lazy(() => import('@/components/shared/NewLead'))
    },
    {
        path: "my_leads",
        name: "My Leads",
        component: lazy(() => import('@/components/shared/MyLead'))
    },
    {
        path: "advisor_payout",
        name: "Advisor Payout",
        component: lazy(() => import('@/components/shared/AdvisorPayout'))
    },
    {
        path: "my_performance",
        name: "My Performance",
        component: lazy(() => import('@/components/shared/MyPerformance'))
    }
]