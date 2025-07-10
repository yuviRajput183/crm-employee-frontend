import { lazy } from 'react';

export const advisorRoutes = [
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
        path: "drafts",
        name: "Drafts",
        component: lazy(() => import('@/pages/Dashboard'))
    },
    {
        path: "my_leads",
        name: "My Leads",
        component: lazy(() => import('@/components/shared/MyLead'))
    },
    {
        path: "my_payout",
        name: "My Payout",
        component: lazy(() => import('@/components/shared/MyPayout'))
    },
    {
        path: "loan_documents_list",
        name: "Loan Documents List",
        component: lazy(() => import('@/pages/Dashboard'))
    },
    {
        path: "payout_percentage",
        name: "Payout Percentage",
        component: lazy(() => import('@/pages/Dashboard'))
    },
    {
        path: "my_performance",
        name: "My Performance",
        component: lazy(() => import('@/components/shared/MyPerformance'))
    }
]