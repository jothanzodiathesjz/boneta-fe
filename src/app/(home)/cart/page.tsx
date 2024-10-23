"use client";
import React, { useEffect, useState } from "react";
import { QuantityInput } from "@/components/input/Quantity.input";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { useAnimationStore } from "@/store/AnimateStore";
import { useCountStore } from "@/store/TriggerStore";

export default function OrderPage() {
  const [contentTiger, setContentTiger] = useState(false);
  const store = useCountStore();
  const animationStore = useAnimationStore();
  const router = useRouter();
  function handleRouter() {
    router.push("/payment");
  }

  useEffect(() => {
    console.log(store.count);
  }, [store.count]);
  useEffect(() => {
    setContentTiger(true);
  }, []);

  return (
    <div className=" w-full flex flex-col gap-4 bg-[#FAFAFD] min-h-screen">
      <div className="p-5"></div>
      <div className="w-full p-5 flex justify-start items-center bg-white shadow-sm">
        <button
          onClick={() => router.back()}
          className=" left-3 flex items-center font-bold text-neutral-500"
        >
          <span className="material-icons text-3xl">navigate_before</span>
        </button>
        <div className="w-full flex justify-center pr-5 font-bold text-neutral-500">
          <span className="font-bold text-neutral-500">Order</span>
        </div>
      </div>
      {/* content start */}
      <span className="ms-5 font-bold">Ordered Items</span>
      <div className="w-full min-h-[60vh] pb-40 flex bg-white flex-col gap-3 px-5 pt-5">
        {/* items */}
        {Array(7)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="w-full flex flex-col border-b-[1px] border-neutral-600/35 pb-4"
            >
              <span className="font-bold">Mie Gacoan</span>
              <div className="flex flex-row justify-between items-center">
                <span className="text-sm font-semibold text-neutral-500">
                  RP 50000
                </span>
                <QuantityInput />
              </div>
            </div>
          ))}
      </div>
      {/* order summary */}
      <div className="md:w-[500px] w-full flex flex-col gap-2 bottom-0 fixed border-[1px] rounded-md bg-white p-5 shadow-lg">
        <span className="font-bold text-center">Order Summary</span>
        <div className="flex flex-row justify-between items-center">
          <span className="text-sm font-semibold text-neutral-500">Total</span>
          <span className="text-sm font-semibold text-neutral-500">
            RP 50000
          </span>
        </div>
        <Button
          severity="danger"
          onClick={() => router.push("/payment")}
          className="w-full"
        >
          <span>Lanjut Pembayaran</span>
        </Button>
      </div>
      {/* order summary end */}
    </div>
  );
}
