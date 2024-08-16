import { OrderItemResult,DomainOrderSummary,paymentMethods,PaymentMethodType} from "@/domain/OrderItem";
import { DomainCustomer } from "@/domain/Customer";
import { DomainOrder } from "@/domain/Orders";
import { HttpClient } from "@/services/httpClient";
import { useState } from "react";
import { generateRandomString } from "@/utils/randomstring";
import { useRouter } from "next/navigation";
import { getCookie } from "@/utils/cookies";
import { DomainUserWithProfile } from "@/domain/Users";
import {parseCookies} from 'nookies'


const http = new HttpClient()
export const PaymentViewModel = () => {
    const payemntData = paymentMethods
    const order = localStorage.getItem('order') ? JSON.parse(localStorage.getItem('order') || '') : undefined
    const guested = localStorage.getItem('guest') || '' 
    const cookies = parseCookies()

    const user:DomainUserWithProfile | null = cookies.user ? new DomainUserWithProfile(JSON.parse(cookies.user)) : null
    // const orderSummary = JSON.parse(localStorage.getItem('orderSummary') || '')
    const [guest, setGuest] = useState<string>(guested);
    const [orderItem, setOrderItem] = useState<OrderItemResult>(order); 
    const [fullName, setFullName] = useState(user?.profile?.firstName || '');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState(user?.phone || '');
    const [table, setTable] = useState(localStorage.getItem('table') ? JSON.parse(localStorage.getItem('table') || '') : undefined);
    const [address, setAddress] = useState(user?.profile?.address || '');
    const [mode, setMode] = useState('dine-in');
    const [disabled, setDisabled] = useState(false);
    const [paymentOption, setPaymentOption] = useState<PaymentMethodType[]>(payemntData);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>(paymentOption[0]);
    const [mapUrl, setMapUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const handleCreateOrder = async () => {
        setLoading(true)
        let uuid=""
        try {
            const data =  await http.Post<DomainOrder>('/api/create-order',{
                body: JSON.stringify(new DomainOrder({
                    uuid_user: user?.uuid ?? '',
                    order_id:'',
                    guest: guest,
                    items: orderItem?.items || [],
                    customer: new DomainCustomer({name:fullName,email,phone,address,uuid:generateRandomString(20)}),
                    status: 'waiting',
                    table: table ?? 'delivery',
                    total_price: orderItem?.total_price || 0,
                    quantity: orderItem?.quantity || 0,
                    payment: selectedPayment || paymentOption[0],
                    delivery:!table,
                    customer_location: mapUrl ?? undefined,
                    created_at: new Date().getTime()
                }))
            })
            const newData = new DomainOrder(data.data)
            uuid = newData.uuid!
            localStorage.removeItem('order')
            localStorage.removeItem('table')
            localStorage.removeItem('orderSummary')
            router.push(`/orders/${uuid}`)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
            setLoading(false)
        
    }

    return{
        orderItem,
        setOrderItem,
        fullName,
        setFullName,
        email,
        setEmail,
        phone,
        setPhone,
        table,
        setTable,
        address,
        setAddress,
        mode,
        setMode,
        disabled,
        setDisabled,
        paymentOption,
        setPaymentOption,
        selectedPayment,
        setSelectedPayment,
        handleCreateOrder,
        cookies,
        user,
        mapUrl,
        setMapUrl,
        loading,
        setLoading
    }
}