"use client"

import React, { useEffect ,useState} from 'react';
import { useBackRouteStore } from '@/store/BackRouteStore';
import { UnixToDateString } from '@/utils/date';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { PelayanIndexViewModel } from '@/viewmodel/Pelayan.vm';
export default function page() {
  const vm = PelayanIndexViewModel()
  const {route,setBackRoute} = useBackRouteStore((state) => state)
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    { label: "ditolak", icon: "pi pi-bars" },
    { label: "In Delivery", icon: "pi pi-send" },
  ];

  useEffect(() => {
    vm.data1
  }, [vm.data1])

  return (
    <div className='pt-20 flex flex-col  bg-off-white h-screen'>
      <TabMenu 
      pt={{
        menu:{
          className:"w-full flex justify-center"
        }
      }}
      model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
     {activeIndex === 0 &&  <div className="flex flex-col w-full  p-3 gap-3">
                {
                    vm.data1?.data?.data.filter((v)=>!v.delivery).map((item, index) => (
                        <div
                        onClick={() => router.push(`/processing/pelayan/${item.uuid}`)}
                            key={index}
                            className="w-full flex flex-row justify-between rounded-xl p-3 items-center border cursor-pointer border-neutral-80 shadow-lg">
                            <div className="flex flex-col gap-1">
                                <span>{item.order_id}</span>
                                <span className="text-neutral-40">
                                    {
                                        (item.total_price * 1.1)
                                            .toLocaleString('id-ID',
                                                {
                                                    style: 'currency',
                                                    currency: 'IDR'
                                                })} ({
                                        item.quantity
                                    } item)
                                </span>
                                <div className="flex flex-row gap-3 text-neutral-50">
                                <span className="text-red-400">{UnixToDateString(item.created_at!)}</span> -
                                <span className="text-neutral-40">{item.delivery ? 'Delivery' : 'Dine In'}</span>
                                </div>
                            </div>
                            <span style={{ fontSize: '1.8rem' }} className="material-icons ">chevron_right</span>
                        </div>
                    ))
                }
      </div>}
      {activeIndex === 1 && <div className="flex flex-col w-full  p-3 gap-3">

                {
                    vm.data2?.data?.data.map((item, index) => (
                        <div
                        onClick={() => router.push(`/processing/pelayan/${item.uuid}`)}
                            key={index}
                            className="w-full flex flex-row justify-between rounded-xl p-3 items-center border cursor-pointer border-neutral-80 shadow-lg">
                            <div className="flex flex-col gap-1">
                                <span>{item.order_id}</span>
                                <span className="text-neutral-40">
                                    {
                                        (item.total_price * 1.1)
                                            .toLocaleString('id-ID',
                                                {
                                                    style: 'currency',
                                                    currency: 'IDR'
                                                })} ({
                                        item.quantity
                                    } item)
                                </span>
                                <div className="flex flex-row gap-3 text-neutral-50">
                                <span className="text-red-400">{UnixToDateString(item.created_at!)}</span> -
                                <span className="text-neutral-40">{item.delivery ? 'Delivery' : 'Dine In'}</span>
                                </div>
                            </div>
                            <span style={{ fontSize: '1.8rem' }} className="material-icons ">chevron_right</span>
                        </div>
                    ))
                }
      </div>}
    </div>
  )
}
