import { lazy } from "react";    
const AdminDashboard = lazy(()=> import('../../views/admin/AdminDashboard'))  
const Category = lazy(()=> import('../../views/admin/Category'))
const Sellers = lazy(()=> import('../../views/admin/Sellers'))  
const Orders = lazy(()=> import('../../views/admin/Orders')) 
const PaymentRequest = lazy(()=> import('../../views/admin/PaymentRequest'))
const OrderDetails = lazy(()=> import('../../views/admin/OrderDetails'))
export const adminRoutes = [
    {
        path: 'admin/dashboard',
        element : <AdminDashboard/>,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/category',
        element : <Category/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/orders',
        element : <Orders/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/sellers',
        element : <Sellers/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/payment-request',
        element : <PaymentRequest/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/order/details/:orderId',
        element : <OrderDetails/> ,
        role : 'admin'
    },
]