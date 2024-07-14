"use client";
import { Button } from "primereact/button";
import { SelectedButton } from "@/components/button/SelectedButton";
import React, { useEffect, useState } from "react";
import TextInput from "@/components/input/TextInput.component";
import {useRouter} from "next/navigation";
import {useCountStore} from "@/store/TriggerStore";
import { PaymentViewModel } from "@/viewmodel/Payment.vm";
import { useRouteAnimation } from "@/utils/handleroute";
import { DomainPaymentMethod } from "@/domain/OrderItem";
import { InputText } from "primereact/inputtext";

export default function Payment() {
  const store = useCountStore();

const router = useRouter()
const vm = PaymentViewModel()
const routeAnimation = useRouteAnimation()

console.log(localStorage.getItem('order'))
useEffect(() => {
  // if(localStorage.getItem('order')){
  //   const order = JSON.parse(localStorage.getItem('order') || '')
  //   vm.setOrderItem(order)
  // }
  if(localStorage.getItem('table')){
    vm.setTable(JSON.parse(localStorage.getItem('table') || ''))
  }
  if(localStorage.getItem('orderSummary')){
    const orderSummary = JSON.parse(localStorage.getItem('orderSummary') || '');
    vm.setSelectedPayment(new DomainPaymentMethod(orderSummary.orderSummary.payment))
    vm.setAddress(orderSummary.customer.address)
    vm.setFullName(orderSummary.customer.name)
    vm.setPhone(orderSummary.customer.phone)
    vm.setEmail(orderSummary.customer.email)
    vm.setMode(orderSummary.mode)
    console.log(orderSummary.orderSummary.payment)
  }
  // console.log(vm.table)
  console.log(vm.user)
},[])
useEffect(() => {
  
},[vm.selectedPayment,vm.table])

  useEffect(() => {
    const isFormComplete =
      vm.fullName && vm.email && vm.phone && vm.selectedPayment;
    vm.setDisabled(!isFormComplete);
  }, [vm.fullName, vm.email, vm.phone, vm.selectedPayment]);

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
        <span className="font-bold text-neutral-500">Order Summary</span>
      </div>
      {/* content start */}
      <span className="ms-5 font-bold">Payment Method</span>
      <div className="w-full pb-5 flex bg-white flex-col gap-3 px-5 pt-5">
        {/* items */}
        {   vm.paymentOption.map((item) => (
         
          <SelectedButton
            key={item.id}
            selected={vm.selectedPayment?.id === item.id}
            onEvent={() => vm.setSelectedPayment(item)}
          >
            {item.name}
          </SelectedButton>
        ))}
      </div>
      <span className="ms-5 font-bold">Customer Information</span>
      <div className="w-full pb-44 flex bg-white flex-col gap-3 px-5 pt-5">
        {/* items */}
        <TextInput
          onChange={(e) => vm.setFullName(e.target.value)}
          id="name"
          icon="person"
          label="Name"
          value={vm.fullName}
          placeholder="Masukkan nama lengkap"
        />
        {/* items */}
        <TextInput
          id="email"
          value={vm.email}
          onChange={(e) => vm.setEmail(e.target.value)}
          icon="email"
          label="email"
          placeholder="Masukkan email"
        />
        <TextInput
          id="telepon"
          icon="phone"
          value={vm.phone}
          label="telepon"
          placeholder="Masukkan Telepon"
          onChange={(e) => vm.setPhone(e.target.value)}
        />

        {/* <TextInput
          id="address"
          icon="location_on"
          value={vm.address}
          label="address"
          placeholder="Masukkan alamat"
          onChange={(e) => vm.setAddress(e.target.value)}
        /> */}
        {/* <InputText
        value={vm.table}
        disabled
        className="shadow-sm"
        /> */}
        <TextInput
          id="table"
          icon="table_restaurant"
          label="table"
          disabled
          value={vm.table}
          placeholder="Masukkan table"
          onChange={(e) => vm.setTable(e.target.value)}
        />
      </div>
      {/* order summary */}
      <div className="md:w-[500px] w-full flex flex-col gap-2 bottom-0 fixed border-[1px] rounded-md bg-white p-5 shadow-lg">
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
          disabled={vm.disabled}
          onClick={() => vm.handleCreateOrder()}
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
