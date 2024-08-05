"use client";
import { MainButton } from "@/components/button/MainButton.component";
import { SelectedButton } from "@/components/button/SelectedButton";
import { ProductCard } from "@/components/product/Card.product";
import TextInput from "@/components/input/TextInput.component";
import React, {useEffect, useState } from "react";
import Image from "next/image";
import { CartPopup } from "@/components/CartPopup";
import {CartResult} from "@/components/CartResult";
import { CategoryViewModel } from "@/viewmodel/Category";
import { generateRandomString } from "@/utils/randomstring";
import { useRouteAnimation } from "@/utils/handleroute";
import { MainPageViewModel } from "@/viewmodel/MainPage.vm";
import { DomainOrderItem, OrderItemResult } from "@/domain/OrderItem";
import { CartPopFinal } from "@/components/CartPopFinal";
import Loader from "@/components/Loader";

export default function Home() {
  const vm_category = CategoryViewModel()
  const routeAnimation =useRouteAnimation()
  const [cartVisible, setCartVisible] = useState(false)

  const vm = MainPageViewModel()

  function handleProsesOrder(){
    localStorage.setItem('order',JSON.stringify(vm.cartResult))
    routeAnimation.handleRoute('/payment')
  }

  const order = localStorage.getItem('order')
  
  useEffect(() => {
  
    if(vm.isLoading) {
      vm.animationStore.setIsOpen(true)
    }
   
  }, []);

  useEffect(() => {
    vm.getOrder
    vm.setOrder(vm.getOrder?.data?.data ?? null)
    console.log(vm.order)
  },[vm.getOrder])

  useEffect(() => {
    vm.setOrderItemList(vm.data?.data.map((v) => new DomainOrderItem({
      ...v,
      quantity: 0,
      total_price: 0,
      stage:1,
      status:"proses",
      uuid_item: generateRandomString(40)
    })) || [])
    if(vm.orderToCart.length>0){
      vm.setCartResult({
        items: vm.orderToCart,
        quantity: vm.orderToCart.reduce((a, b) => a + b.quantity, 0),
        total_price: vm.orderToCart.reduce((a, b) => a + b.total_price, 0)
      })
    }else{
      vm.setCartResult(null)
    }
console.log(vm.cartResult)
    if(!vm.orderToCart)vm.setCartResult(null)
    
    if(vm.orderToCart.length>0){
      vm.orderToCart.forEach((v)=>{
        vm.setOrderItemList((prev)=>{
          const newCart = [...prev]
          const index = newCart.findIndex((v) => v.uuid === v.uuid)
          if(index !== -1){
            newCart[index].quantity = v.quantity
            newCart[index].total_price = v.total_price
          }
          return newCart
        })
      })
    }

  },[vm.data,vm.orderToCart]);

  useEffect(() => {
  },[vm.loading])
  return (
    <main className="flex min-h-screen flex-col gap-3 w-full py-20 ">
      <div className="w-full flex flex-col gap-3 px-5 pb-">
      <div className="w-full text-xl flex flex-col gap-1 font-bold text-black mb-3">
        <span>Choose</span>
        <span>
          Your Favorite
          <span className="text-red-800"> Food</span>
        </span>
      </div>
      <TextInput
        icon="search"
        id="search"
        label="Search"
        debounce={300}
        placeholder="Search"
        value={vm.search}
        onChange={(e) => (vm.setSearch(e.target.value))}
      />
      
      <span>Categories</span>
      {/* SELECTED BUTTON START */}
     
      <div className="w-full flex flex-row gap-2">
      <SelectedButton
            onEvent={() => [vm.setAllMenu(true), vm.setSelectedButton(null)]}
            selected={vm.AllMenu}
          >
            <span>All</span>
          </SelectedButton>
        {vm_category.data?.data.map((v) => (
          <SelectedButton
            key={v.uuid}
            onEvent={() => [vm.setSelectedButton(v), vm.setAllMenu(false) ]}
            selected={vm.selectedButton === v? true : false}
          >
            <span>{v.name}</span>
          </SelectedButton>
        ))}
      </div>
      {/* SELECTED BUTTON END */}

      {/* PRODUCT CARD START */}
      <div className="grid grid-cols-2 gap-3">
        {vm.orderItemList.map((v,k) => (
          <ProductCard
            key={k}
            className="w-full flex flex-col justify-center shadow-xl "
          >
            {/* <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${v.image!}`}
              alt="lalapan"
              width={200}
              height={300}
              className="rounded mx-auto"
             
            /> */}
            <div className="w-full h-44 overflow-hidden mx-auto p-2">
                <Image
                    src={process.env.NEXT_PUBLIC_EXTERNAL_URL + v.image}
                    alt={v.name}
                    width={150}
                    height={150}
                    className="object-cover object-center w-full h-full rounded-md"
                />
            </div>
            <div className="px-3 mt-2 flex flex-col py-3">
              <span className="font-semibold text-normal text-dark">
                {v.name}
              </span>
              <span className="font-semibold text-normal text-neutral-500 mt-5">
                {v.price.toLocaleString()}
              </span>
              <MainButton
                variant="secondary"
                className="mt-2 border border-dark"
                text="Add to cart"
                onEvent={() => vm.handleSelectProduct(v)}
              />
            </div>
          </ProductCard>
        ))}
        
      </div>
      {/* product card end */}
      </div>
      <CartPopup
      data={vm.orderItem!}
      onVisibleChange={()=>vm.setOrderItem(null)}
      visible={vm.orderItem && vm.orderItem?.quantity > 0  ? true : false}
      onUpdateData={(data) => vm.handleUpdateItem(data)}
      onSubmit={(e)=>[vm.hanldeItemTocart(e)]}
      />
      {(vm.cartResult?.items && vm.orderToCart) && <CartResult
      data={vm.cartResult}
      click={()=>setCartVisible(true)}
      />}
      <CartPopFinal
      data={vm.cartResult!}
      visible={cartVisible}
      onVisibleChange={()=>setCartVisible(false)}
      click={()=>vm.handleAdjustment()}
      onUpdateData={(e)=>(vm.setCartResult(e),vm.setOrderToCart(e.items))}
      />
      {vm.loading && <Loader/>}
    </main>
  );
}
