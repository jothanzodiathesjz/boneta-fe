"use client";
import { MainButton } from "@/components/button/MainButton.component";
import { SelectedButton } from "@/components/button/SelectedButton";
import { ProductCard } from "@/components/product/Card.product";
import TextInput from "@/components/input/TextInput.component";
import React, {useEffect, useState,useRef } from "react";
import { CartPopup } from "@/components/CartPopup";
import {CartResult} from "@/components/CartResult";
import { CategoryViewModel } from "@/viewmodel/Category";
import { generateRandomString} from "@/utils/randomstring";
import { useRouteAnimation } from "@/utils/handleroute";
import { MainPageViewModel } from "@/viewmodel/MainPage.vm";
import { DomainOrderItem} from "@/domain/OrderItem";
import { CartPopFinal } from "@/components/CartPopFinal";
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { getCookie } from "@/utils/cookies";
import Image from "next/image";

export default function Home() {
  const vm_category = CategoryViewModel()
  const routeAnimation =useRouteAnimation()
  const [cartVisible, setCartVisible] = useState(false)
  const vm = MainPageViewModel();
  const token = getCookie('accessToken');
  const toast = useRef<Toast>(null);

  const accept = () => {
    if(!token){
      routeAnimation.handleRoute('/login')
      return
    }
    localStorage.setItem('order',JSON.stringify(vm.cartResult))
    localStorage.setItem('delivery','yes')
    routeAnimation.handleRoute('/payment')
  }

  const reject = () => {
      toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  }

  const confirm = () => {
    confirmDialog({
        message: 'Apakah anda ingin melakukan pemesanan delivery?',
        header: 'Delivery Confirmation',
        icon: 'pi pi-info-circle',
        draggable: false,
        position:"bottom",
        className:'md:w-[500px] w-full flex-shrink-0',
        accept,
        reject
    });
};

  function handleProsesOrder(){
    if(vm.query.get('mode')==='dine-in' && vm.query.get('table')!==null){
      localStorage.setItem('order',JSON.stringify(vm.cartResult))
      routeAnimation.handleRoute('/payment')
      return
    }
    if(localStorage.getItem('delivery')){
      if(!token){
        routeAnimation.handleRoute('/login')
        return
      }
      localStorage.setItem('order',JSON.stringify(vm.cartResult))
      localStorage.setItem('delivery','yes')
      routeAnimation.handleRoute('/payment')
      return
    }
    confirm()
  }

 
  const order = localStorage.getItem('order')
  
  useEffect(() => {
  
    if(vm.isLoading) {
      vm.animationStore.setIsOpen(true)
    }
    if(
      vm.query.get('mode')==='dine-in' && 
      vm.query.get('table') 
    ){
      if(!localStorage.getItem('guest'))localStorage.setItem('guest',generateRandomString(50))
      localStorage.setItem('table',vm.query.get('table')!)
      localStorage.removeItem('delivery')
    }else{
      localStorage.removeItem('table')
    }
    if(localStorage.getItem('order')){
      const order = JSON.parse(localStorage.getItem('order') || '')
      vm.setOrderToCart(order.items)
    }
  }, []);

  useEffect(() => {
    vm.setOrderItemList(vm.data?.data.map((v) => new DomainOrderItem({
      ...v,
      quantity: 0,
      total_price: 0,
      stage:1,
      status:'proses',
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
      <ConfirmDialog 
      
      />
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
     
      <div className="w-full flex flex-row gap-2 overflow-x-auto scrollbar-hide p-2">
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
        {vm.orderItemList.filter((v)=>v.category?.name.toLowerCase().includes(vm.selectedButton?.name.toLowerCase() ?? '')).map((v,k) => (
          <ProductCard
            key={k}
            className="w-full flex flex-col justify-center shadow-xl "
          >
            <div className="w-full h-44 overflow-hidden mx-auto p-2">
                <Image
                    src={process.env.NEXT_PUBLIC_EXTERNAL_URL + v.image}
                    alt={v.name}
                    priority={k === 0 || k === 1 ? true : false}
                    loading={k === 0 || k === 1 ? 'eager' : 'lazy'}
                    width={150}
                    quality={50}
                    height={150}
                    className="object-cover object-center w-full h-full rounded-md"
                />
            </div>
            <div className="px-3 mt-2 flex flex-col py-3">
              <span className=" text-normal text-dark">
                {v.name}
              </span>
              <span className="text-normal text-neutral-500 mt-2">
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
      click={()=>handleProsesOrder()}
      onUpdateData={(e)=>(vm.setCartResult(e),vm.setOrderToCart(e.items))}
      />
    </main>
  );
}
