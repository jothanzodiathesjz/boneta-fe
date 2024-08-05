"use client";
import { DataTable, DataTableSelectEvent } from "primereact/datatable";
import { useState } from "react";
import { Column } from "primereact/column";
import { useEffect } from "react";
import { useAnimationStore } from "@/store/AnimateStore";
import { OrderDashboardViewModel } from "@/viewmodel/OrderDashboard.vm";
import { DomainOrder } from "@/domain/Orders";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { UnixToDateStringReverse } from "@/utils/date";
import OrderDetailModal from "@/components/orders/OrderDetailModal";
export default function page() {
  const animationStore = useAnimationStore();
  const vm = OrderDashboardViewModel();
  const [date, setDate] = useState<Nullable<Date>>();
  const onRowSelect = async (event: DataTableSelectEvent) => {
       console.log(event.data)
      //  if(!event.data.seen){
      //      await vm.updateSeen(event.data.uuid)
      //  }
       vm.setSelectedOrder(event.data)
  };
  function convertToISOWithoutOffset(dateString: string) {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  }
  const bodyTambahan = (rowData: DomainOrder) => {
    return (
      <div className="flex flex-row gap-3">
        <span className="w-full">
          {rowData.total_price.toLocaleString("id-ID")}
        </span>
      </div>
    );
  };
  useEffect(() => {
    console.log(convertToISOWithoutOffset("2024/07/29"));
    return animationStore.setIsOpen(true);
  }, [animationStore.isOpen]);
  // useEffect(()=>{
  //     vm.setOrders(vm.data?.data ?? [])
  // },[vm.data])

  useEffect(()=>{

  },[vm.selectedOrder])

  return (
    <main className="min-h-screen pt-20">
      <div className="w-full h-full flex gap-4 px-5">
        <div className="w-full flex flex-col gap-3">
            {/* <span>Order List</span> */}
          <div className="card flex justify-content-center">
            <Calendar 
            placeholder="Select Date"
            dateFormat="dd/mm/yy"
            variant="filled"
            selectionMode="single"
            showIcon value={date} 
            onChange={(e) => (setDate(e.value),vm.setDate(UnixToDateStringReverse(e.value?.getTime()!,"-")))} />
          </div>
          <div className="w-full flex flex-row  gap-3 border-r  border-neutral-60/30">
            <DataTable
            key={"uuid"}
            className="w-full"
              value={vm.data?.data?.orders}
              emptyMessage="No Orders found."
              scrollable
              pt={{
                column: { bodyCell: { className: "scroller" } },
                wrapper: {
                  className: "h-[80vh] overflow-y-scroll scroller",
                },
              }}
              // selection={vm.selectedOrder}
              onRowSelect={onRowSelect}
              selectionMode={"single"}
            >
              <Column
                field="order_id"
                header="Order Id"
                headerClassName="bg-primary-surface"
                sortable
              ></Column>
              <Column
                field="status"
                header="Status"
                headerClassName="bg-primary-surface"
                sortable
              ></Column>
              <Column
                field="table"
                header="Table"
                headerClassName="bg-primary-surface"
                sortable
              ></Column>
              <Column
                field="total_price"
                body={bodyTambahan}
                header="Total Price"
                headerClassName="bg-primary-surface"
                sortable
              ></Column>
            </DataTable>
            <div className="w-[40vw] flex flex-col p-5 bg-white shadow-md">
              <div className="w-full flex flex-col gap-4">
              <span className="font-medium">Order Summary</span>
                    <div className="w-full flex ">
                        <span className="w-44 flex-shrink-0">Total Order</span>
                        <span className="text-neutral-50">{vm.data?.data?.total_orders}</span>
                    </div>
                    <div className="w-full flex ">
                        <span className="w-44 flex-shrink-0">Total Quantity</span>
                        <span className="text-neutral-50">{vm.data?.data?.total_quantity}</span>
                    </div>
                    <div className="w-full flex ">
                        <span className="w-44 flex-shrink-0">Total </span>
                        <span className="text-neutral-50">{vm.data?.data?.total_price.toLocaleString("id-ID",{style:"currency",currency:"IDR"})}</span>
                    </div>
              </div>
        </div>
          </div>
        </div>
        
      </div>
      <OrderDetailModal
      closeModal={() => vm.setSelectedOrder(null)}
      data={vm.selectedOrder}
      />
    </main>
  );
}
