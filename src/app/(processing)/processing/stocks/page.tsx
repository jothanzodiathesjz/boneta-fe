"use client";
import { DataTable, DataTableSelectEvent } from "primereact/datatable";
import { useRef } from "react";
import { Column } from "primereact/column";
import { useEffect } from "react";
import { useAnimationStore } from "@/store/AnimateStore";
import { DomainStocks } from "@/domain/Stocks";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { StocksViewModel } from "@/viewmodel/Stocks.vm";
import StockModal from "@/components/stocks/StockModal";
export default function page() {
  const animationStore = useAnimationStore();
  const vm = StocksViewModel();
  const toast = useRef<Toast>(null);
  const onRowSelect = async (event: DataTableSelectEvent) => {
    console.log(event.data);
    vm.setStock(event.data);
    vm.setIsOpen(true);
    vm.setUpdating(true);
  };
  function convertToISOWithoutOffset(dateString: string) {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  }
  const bodyTambahan = (rowData: DomainStocks) => {
    return (
      <div className="flex flex-row gap-3">
        <Button
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() => vm.deleteStock(rowData)}
        />
      </div>
    );
  };

  useEffect(() => {
    console.log(convertToISOWithoutOffset("2024/07/29"));
    return animationStore.setIsOpen(true);
  }, [animationStore.isOpen]);

  useEffect(() => {}, [vm.updating]);

  return (
    <main className="min-h-screen pt-20">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="w-full h-full flex gap-4 px-5">
        <div className="w-full flex flex-col gap-3 bg-white rounded-sm ">
          <div className="w-full flex justify-between items-center">
            <span>Stocks</span>
            <Button
              size="small"
              label="Add Stock"
              onClick={() => vm.setIsOpen(true)}
            />
          </div>
          <div className="w-full flex flex-row  gap-3 border-r  border-neutral-60/30">
            <DataTable
              key={"uuid"}
              className="w-full"
              value={vm.data.data?.data ?? []}
              emptyMessage="No Orders found."
              scrollable
              pt={{
                column: { bodyCell: { className: "scroller" } },
                wrapper: {
                  className: "h-[75vh] overflow-y-scroll scroller",
                },
              }}
              // selection={vm.selectedOrder}
              onRowSelect={onRowSelect}
              selectionMode={"single"}
            >
              <Column
                field="name"
                header="Name"
                headerClassName="bg-primary-surface p-2 font-normal "
                sortable
              ></Column>
              <Column
                field="quantity"
                header="Quantity"
                headerClassName="bg-primary-surface p-2 font-normal"
                sortable
              ></Column>
              <Column
                field="category"
                header="Category"
                headerClassName="bg-primary-surface p-2 font-normal"
                sortable
              ></Column>
              <Column
                field="unit"
                header="Unit"
                headerClassName="bg-primary-surface p-2 font-normal"
                sortable
              ></Column>
              <Column
                field="price"
                header="Price"
                headerClassName="bg-primary-surface p-2 font-normal"
                sortable
              ></Column>
              <Column
                field=""
                body={bodyTambahan}
                header="Total Price"
                headerClassName="bg-primary-surface p-2 font-normal"
                sortable
              ></Column>
            </DataTable>
          </div>
        </div>
      </div>
      <StockModal
        visible={vm.isOpen}
        udpating={vm.updating}
        submit={(e) => vm.createStock(e)}
        closeModal={() => (vm.setIsOpen(false), vm.setUpdating(false))}
        data={vm.stock}
      />
    </main>
  );
}
