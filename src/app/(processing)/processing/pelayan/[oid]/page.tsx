"use client";
import React, { useEffect } from "react";
import { PelayanDetailViewModel } from "@/viewmodel/PelayanDetail.vm";
import { useBackRouteStore } from "@/store/BackRouteStore";
import { UnixToDateString } from "@/utils/date";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
export default function page() {
  const vm = PelayanDetailViewModel();
  const { route, setBackRoute } = useBackRouteStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    vm.data1;
  }, [vm.data1]);

  useEffect(() => {}, [vm.submiting]);

  return (
    <div className="pt-20 flex flex-col  bg-off-white h-screen">
      <div className="relative p-5 flex justify-center items-center bg-white shadow-sm">
        <span className="font-bold text-neutral-500">Dine In</span>
      </div>

      <div className="w-full flex flex-col gap-3 p-4">
        <span className="font-medium text-dark">Customer Information</span>
        <div className="w-full flex flex-row">
          <span className="w-44 flex-shrink-0">Nama Konsumen</span>
          <span className="text-neutral-50">
            : {vm.data1.data?.data.customer.name}
          </span>
        </div>
        <div className="w-full flex flex-row">
          <span className="w-44 flex-shrink-0">Meja</span>
          <span className="text-neutral-50">: {vm.data1.data?.data.table}</span>
        </div>
        <span className="font-medium text-dark">Order Information</span>
      </div>
      <div className="w-full flex flex-col bg-white gap-3 p-5">
        <div className="flex w-full justify-between">
          <span>Order ID</span>
          <span>{vm.data1.data?.data.order_id}</span>
        </div>
        <div className="flex w-full justify-between">
          <span>Order ID</span>
          <span>{vm.data1.data?.data.payment.name}</span>
        </div>
        <div className="flex w-full justify-between border-b border-neutral-80 pb-3">
          <span>Order Status</span>
          <span className="text-danger-pressed">
            {vm.data1.data?.data.status}
          </span>
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-4 pb-3 bg-white border-b border-neutral-80">
          {vm.data1?.data?.data?.items.map((item, index) => (
            <div key={index} className="flex flex-row w-full ">
              <span className="w-44 ">{item.name}</span>
              <div className="flex w-full ">
                {item.deleted_at ? (
                  <span className="text-neutral-40 w-full text-end line-through">
                    Habis
                  </span>
                ) : (
                  <>
                    <span className="w-full text-neutral-40">
                      {item.quantity} x
                    </span>
                    <span className="text-neutral-40">
                      {item.price.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex w-full">
          <span className="w-44 flex-shrink-0">PPN</span>
          <span className="w-full text-neutral-40">10%</span>
          <span className="text-neutral-40">
            {(
              (vm.data1?.data?.data.total_price || 0) *
              (10 / 100)
            ).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
          </span>
        </div>
        <div className="flex w-full">
          <span className="w-44 flex-shrink-0">Total</span>
          <span className="w-full text-neutral-40">
            {vm.data1?.data?.data.quantity}
          </span>
          <span className="text-neutral-40">
            {((vm.data1?.data?.data.total_price || 0) * 1.1).toLocaleString(
              "id-ID",
              { style: "currency", currency: "IDR" },
            )}
          </span>
        </div>

        {vm.data1.data?.data.status === "siap" && (
          <Button
            loading={vm.submiting}
            disabled={vm.submiting}
            label="Antar Pesanan"
            onClick={() =>
              vm.handleProcess(vm.data1.data?.data.uuid!, "diantarkan")
            }
          />
        )}
        {vm.data1.data?.data.status === "diantarkan" && (
          <Button
            loading={vm.submiting}
            disabled={vm.submiting}
            severity="success"
            label="Akhiri Pesanan"
            onClick={() =>
              vm.handleProcess(vm.data1.data?.data.uuid!, "disajikan")
            }
          />
        )}
      </div>
    </div>
  );
}
