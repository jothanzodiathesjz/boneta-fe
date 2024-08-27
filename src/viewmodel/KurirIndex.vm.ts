import { HttpClient } from "@/services/httpClient";
import { DomainOrder } from "@/domain/Orders";
import { getCookie } from "@/utils/cookies";
const cockies = getCookie('accessToken');

const http = new HttpClient();

export const KurirIndexViewModel = () => {


    const data1 = http.Send<DomainOrder[]>('/api/orders?status=ditolak', undefined, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cockies}`
        }
    },{
        revalidateOnMount: true
    })
    const data2 = http.Send<DomainOrder[]>('/api/orders?status=diantarkan', undefined, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cockies}`
        }
    },{
        revalidateOnMount: true
    })


    return {
        data1,
        data2
    }

}