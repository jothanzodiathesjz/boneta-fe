import { useState } from "react";
import  { useAnimationStore } from '@/store/AnimateStore';
import  { useRouter,useSearchParams } from "next/navigation";
import { DomainMenu } from '@/domain/Menu';
import { DomainCategory } from '@/domain/Category';
import { DomainOrderItem,OrderItemResult } from '@/domain/OrderItem';
import { HttpClient } from "@/services/httpClient";
import { DomainOrder } from "@/domain/Orders";
import {parseCookies} from 'nookies'
import { DomainUserWithProfile } from "@/domain/Users";
import { useParams } from "next/navigation";
const http = new HttpClient();

export const MainPageViewModel = () => {
    const [search, setSearch] = useState("");
    const animationStore = useAnimationStore()
    const router = useRouter();
    const query = useSearchParams()
    const { oid } = useParams();
    const [AllMenu, setAllMenu] = useState(false);
    const [selectedButton, setSelectedButton] = useState<DomainCategory| null>(null);
    const [popUpCart, setPopUpCart] = useState(false);
    const [orderItem, setOrderItem] = useState<DomainOrderItem | null>(null);
    const [orderItemList, setOrderItemList] = useState<DomainOrderItem[]>([]);
    const [orderToCart, setOrderToCart] = useState<DomainOrderItem[]>([]);
    const [cartResult, setCartResult] = useState<OrderItemResult | null>(null);
    const {data,isError,isLoading} = http.Send<DomainMenu[]>('/api/menu?search='+search);
    const [order, setOrder] = useState<DomainOrder | null>(null);
    const [filtered, setFiltered] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const cookies = parseCookies()
    const guest = localStorage.getItem('guest') || ''
    const user:DomainUserWithProfile | null = cookies.user ? new DomainUserWithProfile(JSON.parse(cookies.user)) : null
    const handleSelectProduct = (item:DomainOrderItem) => {
        const index = orderToCart?.findIndex((v) => v.uuid === item.uuid)
        if(index !== -1){
            setOrderItem(orderToCart[index])
        }else{
            setOrderItem({...item,quantity:1,total_price:item.price})
            if(orderToCart.length>0){
                setOrderToCart([...orderToCart,{...item,quantity:1,total_price:item.price}])
            }else{
                setOrderToCart([{...item,quantity:1,total_price:item.price}])
            }
        }
        // setOrderItem(item)
    }

    const handleUpdateItem = (item:DomainOrderItem) => {
        console.log(item)
        if(item.quantity===0){
            setOrderToCart(prev=>{
                const index = prev?.findIndex((v) => v.uuid === item.uuid)
                if(index !== -1){
                    const newCart = [...prev]
                    newCart.splice(index,1)
                    return newCart
                }
                return prev
            })
            setOrderItem(null)
        }else{
            setOrderItem(item)
            const index = orderToCart?.findIndex((v) => v.uuid === item.uuid)
            if(index !== -1){
                setOrderToCart(prev=>{
                    const newCart = [...prev]
                    newCart[index]=item
                    return newCart
                })
            }
        }

    }
    const handleSearch = ()=>{
        const filtered = data?.data.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
        setOrderItemList(filtered?.map((v) => new DomainOrderItem({
            ...v,
            quantity: 0,
            total_price: 0,
            stage:1,
            status:'proses'
        })) || [])
    }

    const hanldeItemTocart = (item:DomainOrderItem) => {
        if(!orderToCart)setOrderToCart([new DomainOrderItem({...item,stage:1})])
        else {
            const index = orderToCart?.findIndex((v) => v.uuid === item.uuid)
            if(index !== -1){
                setOrderToCart(prev=>{
                    const newValToCart = [...prev] 
                    newValToCart[index]=item
                    return newValToCart
                })
            }else{
                setOrderToCart([...orderToCart,item])
            }
        } 
        setOrderItem(null)       
    }

    const getOrder = oid && http.Send<DomainOrder>(`/api/order/${oid}`,undefined,{
        headers: {
            'Authorization': `Basic ${user ? `user:${user?.uuid}` : `guest:${guest}`  }`
        }
    },{
        revalidateOnMount: true,
    })


    const handleAdjustment =async ()=>{
        setLoading(true)
        try {
            if(!oid) return
            if(!order) return
            const dataCart:DomainOrderItem[] = cartResult?.items.map((v)=>{
            return{
                ...v,
                stage:order.items.at(-1)!.stage+1
            }
            }) ?? []
            console.log(dataCart)
            const data =await http.Put<DomainOrder>(`/api/order-with-adjustment/${oid}`,{
                body: JSON.stringify({
                    items:[
                    ...order?.items!,
                    ...dataCart
                    ],
                    total_price: order?.total_price! + cartResult?.total_price!,
                    quantity: order?.quantity! + cartResult?.quantity!,
                    adjustment:true
            })
            })

        } catch (error) {
            console.log(error)
        }
        setLoading(false)
        router.push(`/orders/${oid}`)
    }

    return {
        search,
        setSearch,
        AllMenu,
        setAllMenu,
        selectedButton,
        setSelectedButton,
        popUpCart,
        setPopUpCart,
        data,
        isError,
        isLoading,
        query,
        router,
        animationStore,
        orderItem,
        setOrderItem,
        orderItemList,
        setOrderItemList,
        orderToCart,
        setOrderToCart,
        hanldeItemTocart,
        handleSelectProduct,
        cartResult,
        setCartResult,
        handleUpdateItem,
        handleSearch,
        order,
        setOrder,
        getOrder,
        handleAdjustment,
        filtered,
        setFiltered,
        setLoading,
        loading
    }
}