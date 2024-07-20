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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const handleFileSelect = (file: File) => {
        console.log('Selected file:', file);
        setSelectedFile(file);
      };
    const {data,isError,isLoading,error,mutate} = http.Send<DomainOrder>(`/api/order/${oid}`,undefined,{
        headers: {
            'Authorization': `Basic ${guest}`
        }
    },{
        revalidateOnMount: true,
        refreshInterval: 5000
    })

    const handleUploadImage = async () => {
        try {
            const data = await http.PostWithFile<DomainOrder>(`/api/payment-wimg/${guest}/${oid}`,selectedFile!)
            
        } catch (error) {
            console.log(error)
        }
    } 
   
    

    return {
        oid,
        data,
        isError,
        isLoading,
        error,
        mutate,
        handleFileSelect,
        selectedFile,
        handleUploadImage

    }
}