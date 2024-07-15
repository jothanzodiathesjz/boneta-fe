import { useState } from "react";
import { DomainOrder } from "@/domain/Orders";
import { HttpClient } from "@/services/httpClient";

const http = new HttpClient();

const OrdersViewModel = () => {
    const [orders, setOrders] = useState<DomainOrder[]>([]);
    const guest = localStorage.getItem('guest') || ''

    const {data,error,isError,isLoading,mutate} = http.Send<DomainOrder[]>(`/api/orderswg/${guest}`)

    return{
        orders,
        setOrders,
        data,
        error,
        isError,
        isLoading,
        mutate
    }


}

export default OrdersViewModel