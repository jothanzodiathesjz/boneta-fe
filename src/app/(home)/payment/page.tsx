"use client";
import { Button } from "primereact/button";
import { SelectedButton } from "@/components/button/SelectedButton";
import React, { useEffect, useState ,useMemo,useCallback} from "react";
import dynamic from "next/dynamic";
// import MapComponent from "@/components/Map";
import TextInput from "@/components/input/TextInput.component";
import { InputText } from "primereact/inputtext";
import {useRouter} from "next/navigation";
import {useCountStore} from "@/store/TriggerStore";
import { PaymentViewModel } from "@/viewmodel/Payment.vm";
import { useRouteAnimation } from "@/utils/handleroute";
import { DomainPaymentMethod } from "@/domain/OrderItem";
import { LatLngExpression } from 'leaflet';
const MapComponent = dynamic(() => import('@/components/Map'), { ssr: true });
export default function Payment() {
  const store = useCountStore();

const router = useRouter()
const vm = PaymentViewModel()
const routeAnimation = useRouteAnimation()
const [coords, setCoords] = useState<LatLngExpression | null>(null);


const handleCoordsChange = useCallback((newCoords: LatLngExpression) => {
    setCoords(newCoords);
    const { lat, lng } = newCoords as { lat: number; lng: number };
    vm.setMapUrl(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
    console.log("New coordinates:", vm.mapUrl);
  }, []);


useEffect(() => {
  // if(localStorage.getItem('order')){
  //   const order = JSON.parse(localStorage.getItem('order') || '')
  //   vm.setOrderItem(order)
  // }
  if(localStorage.getItem('table')){
    vm.setTable(JSON.parse(localStorage.getItem('table') || ''))
  }

 
},[])
useEffect(() => {
  
},[vm.selectedPayment,vm.table])

  useEffect(() => {
    const isFormComplete =
      vm.fullName && vm.email && vm.phone && vm.selectedPayment;
    vm.setDisabled(!isFormComplete);
  }, [vm.fullName, vm.selectedPayment]);

  return (
    <div className=" w-full flex flex-col gap-4 bg-[#FAFAFD] min-h-screen rounded-sm layout-border">
      <div className="p-5"></div>
      <div className="relative p-5 flex justify-center items-center bg-white shadow-sm">
        <button
          onClick={() => router.back()}
          className="absolute left-3 flex items-center font-bold text-neutral-500"
        >
          <span className="material-icons text-3xl">navigate_before</span>
        </button>
        <span className="font-bold text-neutral-500">Payment</span>
      </div>
        <div className="w-full flex flex-row justify-between px-5">
          <span className="text-neutral-40">Mode</span>
          <span className="bg-orange-300 rounded-md text-dark px-2">{vm.table ? 'Dine In' : 'Delivery'}</span>
        </div>
      {/* content start */}
      <span className="ms-5 ">Payment Method</span>
      <div className="w-full pb-5 flex bg-white flex-col gap-3 px-5 pt-5">
        {/* items */}
        {   vm.paymentOption.filter((item) => {
          if(vm.table){
            return item.value !== 'cod'
          }else{
            return item.value !== 'cash'
          }
        }).map((item) => (
         
          <SelectedButton
            key={item.id}
            selected={vm.selectedPayment?.id === item.id}
            onEvent={() => vm.setSelectedPayment(item)}
          >
            {item.name}
          </SelectedButton>
        ))}
      </div>
      <span className="ms-5 ">Customer Information</span>
      <div className="w-full pb-44 flex bg-white flex-col gap-3 px-5 pt-5">
        {/* items */}
        <div className="w-full flex flex-col gap-2">
        <span>Nama Lengkap</span>
        <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-user"></i>
                </span>
                <InputText
        value={vm.fullName}
        onChange={(e) => vm.setFullName(e.target.value)}  
        placeholder="Masukkan Nama Lengkap"

        />
            </div>
        </div>
        
    
        {/* items */}
        {/* <TextInput
          id="email"
          value={vm.email}
          onChange={(e) => vm.setEmail(e.target.value)}
          icon="email"
          label="email"
          placeholder="Masukkan email"
        /> */}
       {!vm.table && 
       <div className="w-full flex flex-col gap-2">
       <span>No Telepon</span>
       <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-phone"></i>
                </span>
                <InputText
        value={vm.phone}
        max={14}
        type="number"
        onChange={(e) => (
          e.target.value.length <= 14 && vm.setPhone(e.target.value))}  
        placeholder="Masukkan Nomor Telepon"
        />
            </div>
       </div>
            
            }

       {!vm.table && 
       <div className="w-full flex flex-col gap-2">
       <span>Alamat</span>
       <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-map-marker"></i>
                </span>
                <InputText
        value={vm.address}
        onChange={(e) => vm.setAddress(e.target.value)}  
        placeholder="Masukkan Alamat Lengkap"

        />
            </div>
       </div>
            }
        {/* <InputText
        value={vm.table}
        disabled
        className="shadow-sm"
        /> */}
        {vm.table && 
        <div className="w-full flex flex-col gap-2">
        <span>Meja</span>
        <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                    <i className="pi pi-file"></i>
                </span>
                <InputText
        value={vm.table}
        disabled
        onChange={(e) => vm.setTable(e.target.value)}  
        placeholder="Masukkan Nama Lengkap"

        />
            </div>
        </div>
            }
        {vm.table === undefined && <div className="w-full flex flex-col gap-3">
        <span>Pilih Lokasi Anda</span>
        <MapComponent onCoordsChange={handleCoordsChange} />
        </div>}
      </div>
      {/* order summary */}
      <div className="md:w-[500px] w-full flex flex-col gap-2 bottom-0 fixed border-[1px] rounded-md bg-white p-5 shadow-lg z-30">
        <span className="font-bold text-center">Order Summary</span>
        <div className="flex flex-row justify-between items-center">
          <span className="text-sm font-semibold text-neutral-500">Total</span>
          <span className="text-sm font-semibold text-neutral-500">
            {vm.orderItem?.total_price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
        </div>
        <Button
          // disabled={vm.disabled}
          onClick={
            () => vm.handleCreateOrder()
            // () => console.log(mapUrl)
          }
          className="w-full"
        >
          <span>Lanjut Pembayaran</span>
        </Button>
      </div>
      {/* order summary end */}
      {/* content end */}
    </div>
  );
}
