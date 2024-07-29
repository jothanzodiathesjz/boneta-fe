import { useState } from "react";
import { HttpClient } from "@/services/httpClient";
import { DomainStocks } from "@/domain/Stocks";
import { getCookie } from "@/utils/cookies";
const coockies = getCookie('accessToken');

const http = new HttpClient();
export const StocksViewModel = () => {
    const [stock, setStock] = useState<DomainStocks>(new DomainStocks({
        name: '',
        quantity: 0,
        unit: '',
        price: 0,
        supplier: '',
        description: '',
        category: '',
        created_at: 0,
        deleted_at: 0
    }));

    


    const createStock = async (data:DomainStocks) => {
        try {
            const response = await http.Post<DomainStocks>('/api/stock', {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${coockies}`
                },
                body: JSON.stringify(data)
            })
            return response
        } catch (error) {
            console.log(error)
        }
    }




}