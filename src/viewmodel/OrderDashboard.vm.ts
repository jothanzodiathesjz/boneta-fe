import { useState } from "react";
import { HttpClient } from "@/services/httpClient";
import { DomainOrder, DomainOrderSummarry } from "@/domain/Orders";
import { getCookie } from "@/utils/cookies";
import { UnixToDateString, UnixToDateStringReverse } from "@/utils/date";
const coockies = getCookie('accessToken');
const http = new HttpClient();
export const OrderDashboardViewModel = () => {
    const [date, setDate] = useState(UnixToDateStringReverse(new Date().getTime(),'-'));
    const [selectedOrder,setSelectedOrder] = useState<DomainOrder | null>(null)


    const {data,isError,isLoading,mutate} = http.Send<DomainOrderSummarry>('/api/orders-summary/'+date,undefined,{
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${coockies}`
        }
    },{
        revalidateOnMount: true,
    })
    return {
        data,
        date,
        setDate,
        isError,
        isLoading,
        mutate,
        selectedOrder,
        setSelectedOrder
    }
}