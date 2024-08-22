"use client";
import { DataTable, DataTableSelectEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { orders, Order } from "@/data/order";
import { useEffect } from "react";
KitchenModal;
import { useAnimationStore } from "@/store/AnimateStore";
import kitchenViewModel from "@/viewmodel/Kitchen.vm";
import { DomainOrder } from "@/domain/Orders";
import KitchenModal from "@/components/kitchen/KitchenModal";
export default function page() {
  const animationStore = useAnimationStore();
  const vm = kitchenViewModel();
  const onRowSelect = async (event: DataTableSelectEvent) => {
    console.log(event.data);
    if (!event.data.seen) {
      await vm.updateSeen(event.data.uuid);
    }
    vm.setSelectedOrder(event.data);
  };

  const bodyTambahan = (rowData: DomainOrder) => {
    return (
      <div className="flex flex-row gap-3">
        <span className="w-full">
          {(rowData.total_price * 1.1).toLocaleString("id-ID")}
        </span>
        {rowData.seen ? "" : <span>🔴</span>}
      </div>
    );
  };
  const bodyTambahanEnded = (rowData: DomainOrder) => {
    return (
      <div className="flex flex-row gap-3">
        <span className="w-full">
        {(rowData.total_price * 1.1).toLocaleString("id-ID")}
        </span>
      </div>
    );
  };


  useEffect(() => {
    return animationStore.setIsOpen(true);
  }, [animationStore.isOpen]);
  useEffect(() => {
    vm.setOrders(vm.data?.data ?? []);
  }, [vm.data]);

  useEffect(() => {}, [vm.selectedOrder]);

  return (
    <main className="min-h-screen pt-20">
      <div className="w-full h-full flex">
        <div className="w-full flex flex-col">
          <div className="w-full flex flex-col  p-3 gap-3 border-r  border-neutral-60/30">
            <span>Order On Waiting</span>
            <DataTable
              value={vm.orders}
              scrollable
              pt={{
                column: { bodyCell: { className: "scroller" } },
                wrapper: {
                  className: "h-[30vh] overflow-y-scroll scroller",
                },
              }}
              selection={vm.selectedOrder}
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
          </div>
          <div className="w-full flex flex-col  p-3 gap-3 border-r  border-neutral-60/30">
            <span>Accepted By Chasier</span>
            <DataTable
              value={vm.data3.data?.data}
              scrollable
              pt={{
                column: { bodyCell: { className: "scroller" } },
                wrapper: {
                  className: "h-[40vh] overflow-y-scroll scroller",
                },
              }}
              selection={vm.selectedOrder}
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
          </div>
        </div>
        <div className="w-full flex flex-col h-[85vh] p-3 gap-3 border-r  border-neutral-60/30">
          <span>Order List</span>
          <DataTable
            value={vm.data2.data?.data}
            scrollable
            pt={{
              column: { bodyCell: { className: "scroller" } },
              wrapper: {
                className: "h-[75vh] overflow-y-scroll scroller",
              },
            }}
            selection={vm.selectedOrder}
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
        </div>
        <div className="w-full flex flex-col h-[85vh] p-3 gap-3 border-r  border-neutral-60/30">
          <span>Order Ended</span>
          <DataTable
            value={vm.data4.data?.data?.orders}
            scrollable
            pt={{
              column: { bodyCell: { className: "scroller" } },
              wrapper: {
                className: "h-[75vh] overflow-y-scroll scroller",
              },
            }}
            selection={vm.selectedOrder}
            onRowSelect={onRowSelect}
            selectionMode={"single"}
          >
            <Column
              field="order_id"
              header="Order Id"
              className="text-red-700"
              headerClassName="bg-primary-surface"
              sortable
            ></Column>
            <Column
              field="status"
              header="Status"
              className="text-red-700"
              headerClassName="bg-primary-surface"
              sortable
            ></Column>
            <Column
              field="table"
              header="Table"
              className="text-red-700"
              headerClassName="bg-primary-surface"
              sortable
            ></Column>
            <Column
              field="total_price"
              body={bodyTambahanEnded}
              header="Total Price"
              className="text-red-700"
              headerClassName="bg-primary-surface"
              sortable
            ></Column>
          </DataTable>
        </div>
      </div>
      <KitchenModal
        handleDeleteItem={(u, i) => vm.handleDeleteItem(u, i)}
        data={vm.selectedOrder}
        handleProcess={(e) => vm.handleProcess(e)}
        closeModal={() => vm.setSelectedOrder(null)}
      />
    </main>
  );
}
