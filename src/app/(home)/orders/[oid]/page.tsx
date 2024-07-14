'use client';
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { useEffect } from "react";
import { OrderDetailViewModel } from "@/viewmodel/OrderDetail.vm";

export default function Page() {
    const router = useRouter()
    const vm = OrderDetailViewModel()
    useEffect(() => {
        console.log(vm.data)
    },[vm.data])

    if(vm.data?.data){
        return (
            <div className=" w-full flex flex-col gap-3 bg-[#FAFAFD] min-h-screen rounded-sm layout-border">
                <div className="p-5"></div>
                <div className="relative p-5 flex justify-center items-center bg-white shadow-sm">
                    <button
                        onClick={() => router.back()}
                        className="absolute left-3 flex items-center font-bold text-neutral-500"
                    >
                        <span className="material-icons text-3xl">navigate_before</span>
                    </button>
                    <span className="font-bold text-neutral-500">End Payment</span>
                </div>
                <span className="font-semibold ml-3">Order Detail</span>
                <div className="w-full flex flex-col bg-white gap-3 p-5">
                    <div className="flex w-full justify-between">
                        <span>Order ID</span>
                        <span>{vm.data.data.order_id}</span>
                    </div>
                    <div className="flex w-full justify-between border-b border-neutral-80 pb-3">
                        <span>Order Status</span>
                        <span className="text-danger-pressed">{vm.data.data.status}</span>
                    </div>
                <div className="w-full flex flex-col justify-center items-center gap-4 pb-3 bg-white border-b border-neutral-80">
                    {vm.data?.data?.items.map((item)=>(
                        <div 
                        key={item.uuid}
                        className="flex flex-row w-full ">
                        <span className="w-44 flex-shrink-0">{item.name}</span>
                        <span className="w-full text-neutral-40">{item.quantity} x</span>
                        <span className="text-neutral-40">{item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                    </div>
                    )) }
                </div>
                    <div className="flex w-full">
                        <span className="w-44 flex-shrink-0">Total</span>
                        <span className="w-full text-neutral-40">{vm.data.data.quantity}</span>
                        <span className="text-neutral-40">{vm.data.data.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                    </div>
                </div>
                <div className="w-full p-5 flex flex-col justify-center items-center gap-3">
                    <span className="text-center font-medium text-neutral-40">Silahkan Menuju ke Kasir untuk melakukan proses pembayaran</span>
                </div>
            </div>
        );
    }else{
        return <div className="flex justify-center items-center h-screen bg-gray-200">
        <div className="text-center">
            <h1 className="text-4xl font-medium">404</h1>
            <p className="text-xl font-medium m-6">Sorry, the page you're looking for can't be found.</p>
            <a href="/" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Go Home</a>
        </div>
    </div>
    }

   
}