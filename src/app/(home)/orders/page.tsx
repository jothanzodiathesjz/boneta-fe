"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UnixToDateString } from "@/utils/date";

import OrdersViewModel from "@/viewmodel/Orders";

export default function Orders() {
  const vm = OrdersViewModel();
  const router = useRouter();


  useEffect(() => {}, [vm.data]);

  return (
    <div className=" w-full flex flex-col gap-3 bg-white min-h-screen rounded-sm layout-border">
      <div className="p-5"></div>
      <div className="relative p-5 flex justify-center items-center bg-white shadow-sm">
        <button
          onClick={() => router.push("/")}
          className="absolute left-3 flex items-center font-bold text-neutral-500"
        >
          <span className="material-icons text-3xl">navigate_before</span>
        </button>
        <span className="font-bold text-neutral-500">Orders</span>
      </div>
      <span className="font-medium ml-3">Order List</span>
      <div className="flex flex-col w-full bg-white p-3 gap-3">
        {vm.data?.data.map((item, index) => (
          <div
            key={index}
            onClick={() => router.push(`/orders/${item.uuid}`)}
            className="w-full flex flex-row justify-between rounded-xl p-3 items-center border cursor-pointer border-neutral-80 shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <span>{item.order_id}</span>
              <span className="text-neutral-40">
                {(item.total_price * 1.1).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}{" "}
                ({item.quantity} item)
              </span>
              <div className="flex flex-row gap-3 text-neutral-50">
                <span className="text-red-400">
                  {UnixToDateString(item.created_at!)}
                </span>{" "}
                -
                <span className="text-neutral-40">
                  {item.delivery ? "Delivery" : "Dine In"}
                </span>{" "}
                -<span className="text-neutral-40">{item.status}</span>
              </div>
            </div>
            <span style={{ fontSize: "1.8rem" }} className="material-icons ">
              chevron_right
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
