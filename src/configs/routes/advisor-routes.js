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
        component: lazy(() => import('@/components/shared/Draft'))
    },
    {
        path: "my_leads",
        name: "My Leads",
        component: lazy(() => import('@/components/shared/AdvisorMyLead'))
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
    },
    // Loan Type Routes
    {
        path: "instant_loan",
        name: "Instant Loan",
        component: lazy(() => import('@/pages/AddLead/InstantLoan/InstantLoan'))
    },
    {
        path: "personal_loan",
        name: "Personal Loan",
        component: lazy(() => import('@/pages/AddLead/PersonalLoan/PersonalLoan'))
    },
    {
        path: "edit_personal_loan/:id",
        name: "Edit Personal Loan",
        component: lazy(() => import('@/pages/AddLead/PersonalLoan/EditPersonalLoanForm'))
    },
    {
        path: "business_loan",
        name: "Business Loan",
        component: lazy(() => import('@/pages/AddLead/BusinessLoan/BusinessLoan'))
    },
    {
        path: "edit_business_loan/:id",
        name: "Edit Business Loan",
        component: lazy(() => import('@/pages/AddLead/BusinessLoan/EditBusinessLoanForm'))
    },
    {
        path: "home_loan",
        name: "Home Loan",
        component: lazy(() => import('@/pages/AddLead/HomeLoan/HomeLoan'))
    },
    {
        path: "edit_home_loan/:id",
        name: "Edit Home Loan",
        component: lazy(() => import('@/pages/AddLead/HomeLoan/EditHomeLoanForm'))
    },
    {
        path: "loan_against_property",
        name: "Loan Against Property",
        component: lazy(() => import('@/pages/AddLead/LoanAgainstProperty/LoanAgainstProperty'))
    },
    {
        path: "edit_loan_against_property/:id",
        name: "Edit Loan Against Property",
        component: lazy(() => import('@/pages/AddLead/LoanAgainstProperty/EditLoanAgainstProperty'))
    },
    {
        path: "car_loan",
        name: "Car Loan",
        component: lazy(() => import('@/pages/AddLead/CarLoan/CarLoan'))
    },
    {
        path: "edit_car_loan/:id",
        name: "Edit Car Loan",
        component: lazy(() => import('@/pages/AddLead/CarLoan/EditCarLoanForm'))
    },
    {
        path: "used_car_loan",
        name: "Used Car Loan",
        component: lazy(() => import('@/pages/AddLead/UsedCarLoan/UsedCarLoan'))
    },
    {
        path: "edit_used_car_loan/:id",
        name: "Edit Used Car Loan",
        component: lazy(() => import('@/pages/AddLead/UsedCarLoan/EditUsedCarLoanForm'))
    },
    {
        path: "insurance",
        name: "Insurance",
        component: lazy(() => import('@/pages/AddLead/Insurance/Insurance'))
    },
    {
        path: "edit_insurance/:id",
        name: "Edit Insurance",
        component: lazy(() => import('@/pages/AddLead/Insurance/EditInsuranceForm'))
    },
    {
        path: "services",
        name: "Services",
        component: lazy(() => import('@/pages/AddLead/Services/Services'))
    },
    {
        path: "edit_services/:id",
        name: "Edit Services",
        component: lazy(() => import('@/pages/AddLead/Services/EditServicesForm'))
    },
    {
        path: "credit_card",
        name: "Credit Card",
        component: lazy(() => import('@/pages/AddLead/CreditCard/CreditCard'))
    },
    {
        path: "others",
        name: "Others",
        component: lazy(() => import('@/pages/AddLead/Others/Others'))
    },
    {
        path: "edit_others/:id",
        name: "Edit Others",
        component: lazy(() => import('@/pages/AddLead/Others/EditOthersForm'))
    }
]