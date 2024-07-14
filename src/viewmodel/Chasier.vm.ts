import { useState } from "react";
import { HttpClient } from "@/services/httpClient";
import { DomainOrder } from "@/domain/Orders";
import { getCookie } from "@/utils/cookies";
const cockies = getCookie('accessToken');

const http = new HttpClient();
const ChasierViewModel = () => {
    const [selectedOrder, setSelectedOrder] = useState<DomainOrder | null>(null);

    const {data,isError,isLoading,mutate} = http.Send<DomainOrder[]>('/api/orders?status=pending',undefined,{
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cockies}`
        }
    },{
        revalidateOnMount: true,
        refreshInterval: 5000
    })
    const [orders, setOrders] = useState<DomainOrder[]>(data?.data ?? []);
    const data2 = http.Send<DomainOrder[]>('/api/orders?status=process',undefined,{
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cockies}`
        }
    },{
        revalidateOnMount: true
    })

    const handleProcess = async () => {
        try {
            const response = await http.Put<DomainOrder>(`/api/order`,{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cockies}`
                },
                body: JSON.stringify({uuid: selectedOrder?.uuid, status: 'process'})
            })
            setSelectedOrder(null)
            mutate()
            data2.mutate()
        } catch (error) {
            console.log(error)
        }
        mutate()
            data2.mutate()
    }

    const updateSeen = async (uuid:string) => {
        try {
            const response = await http.Put<DomainOrder>(`/api/order-seen`,{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cockies}`
                },
                body: JSON.stringify({uuid: uuid, seen: true})
            })
          
        } catch (error) {
            console.log(error)
        }
        mutate()
    }
    

    return{
        data,
        isError,
        isLoading,
        mutate,
        selectedOrder,
        setSelectedOrder,
        data2,
        handleProcess,
        orders,
        setOrders,
        updateSeen
    }
}


export default ChasierViewModel