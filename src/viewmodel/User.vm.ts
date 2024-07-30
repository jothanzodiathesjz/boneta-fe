import { useState,useRef } from "react";
import { HttpClient } from "@/services/httpClient";
import { DomainStocks } from "@/domain/Stocks";
import { getCookie } from "@/utils/cookies";
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { DomainProfile, DomainUser, DomainUserWithProfile } from "@/domain/Users";
import { DomainAuth } from "@/domain/Auth";
const coockies = getCookie('accessToken');

const http = new HttpClient();
export const UsersViewModel = () => {
    const toast = useRef<Toast>(null);
    const [user,setUser] = useState<DomainUser>();
    const [auth,setAuth] = useState<DomainAuth>();
    const [profile,setProfile] = useState<DomainProfile>();
    const [isOpen,setIsOpen] = useState(false);

    const data = http.Send<DomainUserWithProfile[]>('/api/userlist',undefined,{
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${coockies}`
        }
    },{
        revalidateOnMount: true
    })

    const createStock = async (d:DomainStocks) => {
        // try {
        //     if(updating){
        //         const response = await http.Put<DomainStocks>(`/api/stock/${d.uuid}`, {
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 "Authorization": `Bearer ${coockies}`
        //             },
        //             body: JSON.stringify(new DomainStocks({
        //                 ...d
        //             }))
        //         })
        //     }else{
        //         const response = await http.Post<DomainStocks>('/api/stock', {
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 "Authorization": `Bearer ${coockies}`
        //             },
        //             body: JSON.stringify(new DomainStocks({
        //                 ...d,
        //                 created_at: new Date().getTime()
        //             }))
        //         })
        //     }
        // } catch (error) {
        //     console.log(error)
        // }
        // data.mutate()
        // setUpdating(false)
        
    }

    const deleteUser = async (d:DomainUserWithProfile) => {
        const accept =async () => {
            try {
                const response = await http.Delete<DomainUserWithProfile>(`/api/user/${d.uuid}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${coockies}`
                    }
                })
            toast.current?.show({ severity: 'info', summary: 'Success', detail: 'SuccessFully Deleted', life: 3000 });
        } catch (error) {
            console.log(error)
            toast.current?.show({ severity: 'error', summary: 'Gagal', detail: 'Failed', life: 3000 });
            }
            data.mutate()
        }
    
        const reject = () => {
            toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });

        
    }

    const confirm2 = () => {
        
    };
    return{
        data,
        auth,
        profile,
        toast,
        setAuth,
        setProfile,
        user,
        setUser,
        isOpen,
        setIsOpen,
        deleteUser,
    }



}