import { useState,useRef } from "react";
import { DomainMenu } from "@/domain/Menu";
import { HttpClient } from "@/services/httpClient";
import { DomainFile } from "@/domain/Files";
import { Toast } from 'primereact/toast';
import { getCookie } from "@/utils/cookies";

const cockies = getCookie('accessToken');
const httpClient = new HttpClient(undefined, cockies);
const MenuViewModel = () => {
    const [menu, setMenu] = useState<DomainMenu[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [dataError, setDataError] = useState<string | null>();
    const [dataSuccess, setDataSuccess] = useState<string | null>();
    const [onLoading, setOnLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [menuForm, setMenuForm] = useState<DomainMenu>({
        uuid:"",
        name: "",
        price: 0,
        availability: true,
        image: "",
    });
    const [search, setSearch] = useState("");
    const [tbd, setTbd] = useState<DomainMenu | null>()
    const toast = useRef<Toast>(null);

    const showError = () => {
        toast.current?.show({severity:'error', summary: 'Error', detail:'Terjadi Kesalahan', life: 3000});
    }

    const handleSearch = () => {
        menu.filter((item) => item.name.includes(search));
    };

    const showSuccess = () => {
        toast.current?.show({severity:'success', summary: 'Success', detail:'Data Telah Tersimpan', life: 3000});
    }
    const getData = ()=>{
       const {data,isError} = httpClient.Send<DomainMenu[]>('/api/menu',undefined,undefined)
       return {data,isError}
    }
    const {data,isError,isLoading,mutate} = httpClient.Send<DomainMenu[]>('/api/menu',undefined,undefined,{
        revalidateOnMount: true,
    })
    const handleSendData = async () => {
        try {
            setOnLoading(true)
            const response = await httpClient.PostWithFile<DomainFile>('/api/menu/file',file! );
            const response2 = await httpClient.Post<DomainMenu>('/api/create-menu',{
                body: JSON.stringify({
                    ...menuForm,
                    image: response.data.url
                })
            });

            if(response2.data) {
            }
            setDataSuccess("Menu Created")
            showSuccess()
            mutate()

        } catch (error) {
            console.log(error)
            if(error instanceof Error){
            }
            setDataError('Something went wrong')
            showError()
        }

        setOnLoading(false)
    }

    const handleUpdate = async () => {
        try {
            setOnLoading(true)
            let imgurl = menuForm.image
            if(file) {
                const response1 = await httpClient.PostWithFile<DomainFile>('/api/menu/file',file! );
                imgurl = response1.data.url
                setMenuForm({...menuForm, image: response1.data.url})
            }
            const response = await httpClient.Put<DomainMenu>(`/api/menu/${menuForm.uuid}`, {
                body: JSON.stringify({
                    ...menuForm,
                    image: imgurl
                })
            });
            if(response.data) {
            }
            setDataSuccess("Menu Updated")
            showSuccess()
            mutate()

        } catch (error) {
            console.log(error)
            if(error instanceof Error){
            }
            setDataError('Something went wrong')
            showError()
        }
        setOnLoading(false)
    }

    const handleDelete = async () => {
        try {
            const response = await httpClient.Delete(`/api/menu/${tbd?.uuid}`);
            if(response.data) {
            }
            setDataSuccess("Menu Deleted")
            showSuccess()
            mutate()
            setTbd(null)

        } catch (error) {
            console.log(error)
            if(error instanceof Error){
            }
            setDataError('Something went wrong')
            showError()
        }
    }

    return {
        menu,
        setMenu,
        file,
        setFile,
        handleSendData,
        search,
        setSearch,
        data,
        isError,
        isLoading,
        menuForm,
        setMenuForm,
        dataError,
        setDataError,
        dataSuccess,
        setDataSuccess,
        mutate,
        onLoading,
        setOnLoading,
        getData,
        updating,
        setUpdating,
        toast,
        showError,
        showSuccess,
        handleUpdate,
        tbd,
        setTbd,
        handleDelete,
        handleSearch
    }
}
export default MenuViewModel