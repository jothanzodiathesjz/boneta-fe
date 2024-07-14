import { useState } from "react";
import { useParams } from "next/navigation";
import { DomainOrder } from "@/domain/Orders";
import { HttpClient } from "@/services/httpClient";
import {parseCookies} from 'nookies'


const http = new HttpClient()
export const OrderDetailViewModel = () => {
    const { oid } = useParams()
    const cookies = parseCookies()
    const guest = localStorage.getItem('guest') || ''
    const {data,isError,isLoading,error,mutate} = http.Send<DomainOrder>(`/api/order/${oid}`,undefined,{
        headers: {
            'Authorization': `Basic ${guest}`
        }
    },{
        // refreshInterval: 3000,
        revalidateOnMount: true
    })


    return {
        oid,
        data,
        isError,
        isLoading,
        error,
        mutate
    }
}