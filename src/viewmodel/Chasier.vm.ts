import { useState } from "react";
import { HttpClient } from "@/services/httpClient";
import { DomainOrder } from "@/domain/Orders";
import { getCookie } from "@/utils/cookies";
const coockies = getCookie('accessToken');

const http = new HttpClient();
const ChasierViewModel = () => {
    const [selectedOrder, setSelectedOrder] = useState<DomainOrder | null>(null);

    const {data,isError,isLoading,mutate} = http.Send<DomainOrder[]>('/api/orders?status=waiting',undefined,{
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${coockies}`
        }
    },{
        revalidateOnMount: true,
        refreshInterval: 5000
    })
    const [orders, setOrders] = useState<DomainOrder[]>(data?.data ?? []);
    const data2 = http.Send<DomainOrder[]>('/api/orders?status=process',undefined,{
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${coockies}`
        }
    },{
        revalidateOnMount: true
    })
    const data3 = http.Send<DomainOrder[]>('/api/orders?status=served',undefined,{
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${coockies}`
        }
    },{
        revalidateOnMount: true
    })
    const data4 = http.Send<DomainOrder[]>('/api/orders?status=in-delivery',undefined,{
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${coockies}`
        }
    },{
        revalidateOnMount: true
    })

    

    const handleProcess = async (e:string) => {
        try {
            const response = await http.Put<DomainOrder>(`/api/order`,{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${coockies}`
                },
                body: JSON.stringify({uuid: selectedOrder?.uuid, status: e})
            })
            setSelectedOrder(null)
            mutate()
            data2.mutate()
        } catch (error) {
            console.log(error)
        }
        mutate()
        data2.mutate()
        data3.mutate()
    }

    const handleReject = async () => {
        try {
            const response = await http.Put<DomainOrder>(`/api/order`,{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${coockies}`
                },
                body: JSON.stringify({uuid: selectedOrder?.uuid, status: 'reject'})
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
                    "Authorization": `Bearer ${coockies}`
                },
                body: JSON.stringify({uuid: uuid, seen: true})
            })
          
        } catch (error) {
            console.log(error)
        }
        mutate()
        data2.mutate()
        data3.mutate()
        
    }

    const handleDeleteItem = async (uuid:string,uuid_item:string) => {
        setSelectedOrder(null)
        try {
            const response = await http.Delete<DomainOrder>(`/api/order-item/${uuid}/${uuid_item}`,{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${coockies}`
                }
            })
          setSelectedOrder(response.data)
        } catch (error) {
            console.log(error)
        }
        mutate()
    }
    
    const rejectPayment = async () => {
        try {
            const response = await http.Put<DomainOrder>(`/api/order/paymentrejected/${selectedOrder?.uuid}`,{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${coockies}`
                },
                body: JSON.stringify({uuid: selectedOrder?.uuid,})
            })
        } catch (error) {
            console.log(error)
        }
        setSelectedOrder(null)
        mutate()
        data2.mutate()
        data3.mutate()
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
        updateSeen,
        handleReject,
        handleDeleteItem,
        data3,
        rejectPayment,
        data4
    }
}


export default ChasierViewModel