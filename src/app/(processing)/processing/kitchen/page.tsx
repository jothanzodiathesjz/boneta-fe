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
  const bodyTambahanselesai = (rowData: DomainOrder) => {
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
    <main className="min-h-screen pt-20 flex flex-col">
      <span className="font-medium text-lg text-dark text-center w-full shadow-sm">
        DAPUR
      </span>
      <div className="w-full h-full flex">
        <div className="w-full flex flex-col">
          <div className="w-full flex flex-col  p-3 gap-3 border-r  border-neutral-60/30">
            <span>Menunggu Konfirmasi Kasir</span>
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
                header="ID Pesanan"
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
                header="Meja"
                headerClassName="bg-primary-surface"
                sortable
              ></Column>
              <Column
                field="total_price"
                body={bodyTambahan}
                header="Total Harga"
                headerClassName="bg-primary-surface"
                sortable
              ></Column>
            </DataTable>
          </div>
          <div className="w-full flex flex-col  p-3 gap-3 border-r  border-neutral-60/30">
            <span>diterima Oleh Kasir</span>
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
                header="ID Pesanan"
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
                header="Meja"
                headerClassName="bg-primary-surface"
                sortable
              ></Column>
              <Column
                field="total_price"
                body={bodyTambahan}
                header="Total Harga"
                headerClassName="bg-primary-surface"
                sortable
              ></Column>
            </DataTable>
          </div>
        </div>
        <div className="w-full flex flex-col h-[85vh] p-3 gap-3 border-r  border-neutral-60/30">
          <span>Sedang Diproses</span>
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
              header="ID Pesanan"
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
              header="Meja"
              headerClassName="bg-primary-surface"
              sortable
            ></Column>
            <Column
              field="total_price"
              body={bodyTambahan}
              header="Total Harga"
              headerClassName="bg-primary-surface"
              sortable
            ></Column>
          </DataTable>
        </div>
        <div className="w-full flex flex-col h-[85vh] p-3 gap-3 border-r  border-neutral-60/30">
          <span>Pesanan selesai</span>
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
              header="ID Pesanan"
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
              header="Meja"
              className="text-red-700"
              headerClassName="bg-primary-surface"
              sortable
            ></Column>
            <Column
              field="total_price"
              body={bodyTambahanselesai}
              header="Total Harga"
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
