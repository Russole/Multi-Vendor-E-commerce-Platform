import { lazy } from "react";  
const Home = lazy(()=> import('../../views/Home'))   
const SellerDashboard = lazy(()=> import('../../views/seller/SellerDashboard')) 
const DiscountProducts = lazy(()=> import('../../views/seller/DiscountProducts'))
export const sellerRoutes = [
    {
        path: '/',
        element : <Home/>,
        ability : ['admin','seller']
    },
    {
        path: '/seller/dashboard',
        element : <SellerDashboard/>,
        ability : ['seller']
    },
    {
        path: '/seller/dashboard/discount-product',
        element : <DiscountProducts/>,
        ability : ['seller']
    }
]