import { lazy } from 'react';

export const adminRoutes = [
    {
        path: 'dashboard',
        name: 'Dashboard',
        component: lazy(() => import('@/pages/Dashboard'))
    },
    {
        path: "add_employee",
        name: "Add Employee",
        component: lazy(() => import('@/pages/admin/employees/AddEmployee'))
    },
    {
        path: "list_employee",
        name: "List Employee",
        component: lazy(() => import('@/pages/admin/employees/ListEmployee'))
    },
    {
        path: "add_login",
        name: "Add Employee Login",
        component: lazy(() => import('@/pages/admin/employeesLogin/AddEmployeeLogin'))
    },
    {
        path: "list_login",
        name: "List Employee Login",
        component: lazy(() => import('@/pages/admin/employeesLogin/ListEmployeeLogin'))
    },
    {
        path: "add_loan_advisor",
        name: "Add Loan Advisor",
        component: lazy(() => import('@/pages/admin/advisor/AddAdvisor'))
    },
    {
        path: "edit_loan_advisor/:id",
        name: "Edit Loan Advisor",
        component: lazy(() => import('@/pages/admin/advisor/AddAdvisor'))
    },
    {
        path: "list_loan_advisor",
        name: "List Loan Advisor",
        component: lazy(() => import('@/pages/admin/advisor/ListAdvisor'))
    },
    {
        path: "add_advisor_login",
        name: "Add Advisor Login",
        component: lazy(() => import('@/pages/admin/advisorLogin/AddAdvisorLogin'))
    },
    {
        path: "list_advisor_login",
        name: "List Advisor Login",
        component: lazy(() => import('@/pages/admin/advisorLogin/ListAdvisorLogin'))
    },
    {
        path: "add_department",
        name: "Add Department",
        component: lazy(() => import('@/pages/admin/department/AddDepartment'))
    },
    {
        path: "list_department",
        name: "List Department",
        component: lazy(() => import('@/pages/admin/department/ListDepartment'))
    },
    {
        path: "add_designation",
        name: "Add Designation",
        component: lazy(() => import('@/pages/admin/designation/AddDesignation'))
    },
    {
        path: "list_designation",
        name: "List Designation",
        component: lazy(() => import('@/pages/admin/designation/ListDesignation'))
    },
    {
        path: "add_city",
        name: "Add City",
        component: lazy(() => import('@/pages/admin/city/AddCity'))
    },
    {
        path: "list_city",
        name: "List City",
        component: lazy(() => import('@/pages/admin/city/ListCity'))
    },
    {
        path: "add_bank",
        name: "Add Bank",
        component: lazy(() => import('@/pages/admin/bank/AddBank'))
    },
    {
        path: "list_bank",
        name: "List Bank",
        component: lazy(() => import('@/pages/admin/bank/ListBank'))
    },
    {
        path: "add_banker_details",
        name: "Add Banker Details",
        component: lazy(() => import('@/pages/admin/bankerDetails/AddBankerDetails'))
    },
    {
        path: "list_banker_details",
        name: "List Banker Details",
        component: lazy(() => import('@/pages/admin/bankerDetails/ListBankerDetails'))
    },
    {
        path: "add_processed_by",
        name: "Add Processed By",
        component: lazy(() => import('@/pages/admin/processed/AddProcessed'))
    },
    {
        path: "list_processed_by",
        name: "List Processed By",
        component: lazy(() => import('@/pages/admin/processed/ListProcessed'))
    },
    {
        path: "add_payout_document",
        name: "Payout",
        component: lazy(() => import('@/pages/admin/payout/Payout'))
    },
    {
        path: "add_slider_images",
        name: "Add Slider Images",
        component: lazy(() => import('@/pages/admin/sliderImages/SliderImages'))
    },
    {
        path: "company_profile",
        name: "Company Profile",
        component: lazy(() => import('@/pages/admin/companyProfile/CompanyProfile'))
    },
    {
        path: "licenses",
        name: "User Licenses",
        component: lazy(() => import('@/pages/admin/licenses/Licenses'))
    },
    {
        path: "backup",
        name: "Backup",
        component: lazy(() => import('@/pages/admin/backup/Backup'))
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
        path: "invoices",
        name: "Invoices",
        component: lazy(() => import('@/components/shared/Invoices'))
    },
    {
        path: "receivables_payout",
        name: "Receivables Payout",
        component: lazy(() => import('@/components/shared/Receivables'))
    },
    {
        path: "payable_payout",
        name: "Payable Payout",
        component: lazy(() => import('@/components/shared/Payables'))
    },
    {
        path: "delete_attachments",
        name: "Delete Attachments",
        component: lazy(() => import('@/components/shared/DeleteAttachments'))
    },
    {
        path: "reports",
        name: "Reports",
        component: lazy(() => import('@/components/shared/Reports'))
    },
    {
        path: "personal_loan",
        name: "Personal Loan",
        component: lazy(() => import('@/pages/AddLead/PersonalLoan/PersonalLoan'))
    }
]