import { HttpClient } from "@/services/httpClient";
import { DomainOrder } from "@/domain/Orders";
import { getCookie } from "@/utils/cookies";
import { useRouter,useParams } from "next/navigation";
const cockies = getCookie('accessToken');

const http = new HttpClient();

export const kurirDetailViewModel = () => {
    const { oid } = useParams()

const data1 = http.Send<DomainOrder>('/api/orderone/'+oid,undefined,{
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cockies}`
        }
    },{
        revalidateOnMount: true
    })

    const handleProcess = async (uuid:string,status:string) => {
        try {
            const response = await http.Put<DomainOrder>(`/api/order`,{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cockies}`
                },
                body: JSON.stringify({uuid: uuid, status: status})
            })
        } catch (error) {
            console.log(error)
        }
        data1.mutate()
    }


    return {
        data1,
        handleProcess
    }

}