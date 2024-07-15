'use client'
import { DataTable,DataTableSelectEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { orders,Order } from '@/data/order';
import { useEffect } from 'react';
import ChasierModal from '@/components/chasier/Chasier.Modal';
import { useAnimationStore } from '@/store/AnimateStore';
import ChasierViewModel from '@/viewmodel/Chasier.vm';
import { DomainOrder } from '@/domain/Orders';
export default function Chasier() {
const animationStore = useAnimationStore();
const vm = ChasierViewModel()
const onRowSelect = async (event: DataTableSelectEvent) => {
   console.log(event.data)
   if(!event.data.seen){
       await vm.updateSeen(event.data.uuid)
   }
   vm.setSelectedOrder(event.data)

};

const bodyTambahan = (rowData: DomainOrder) => {
    return(
        <div className='flex flex-row gap-3'>
            <span>{rowData.total_price}</span>
            {rowData.seen ? '' : <span>🔴</span>}
        </div>
    )
}
useEffect(() => {
    return animationStore.setIsOpen(true)
},[animationStore.isOpen])
useEffect(()=>{
    vm.setOrders(vm.data?.data ?? [])
},[vm.data])


    return (
        <main className="min-h-screen pt-24">
            <div className="w-full h-full grid grid-cols-3">
                <div className="w-full flex flex-col h-[85vh] p-3 gap-3 border-r bg-white shadow-lg rounded-md border-neutral-60/30">
                    <span>Order List</span>
                    <DataTable 
                    value={vm.orders} 
                    scrollable
                    selection={vm.selectedOrder}
                    onRowSelect={onRowSelect}
                    selectionMode={"single"}
                    scrollHeight='70vh'>
                        <Column field="order_id" header="Order Id" sortable></Column>
                        <Column field="status" header="Status" sortable></Column>
                        <Column field="table" header="Table" sortable></Column>
                        <Column field="total_price" body={bodyTambahan} header="Total Price" sortable></Column>
                        
                    </DataTable>
                </div>
                <div className="w-full h-full p-3 bg-white shadow-lg rounded-md border-r border-neutral-60/30">
                <span>On Process</span>
                    <DataTable 
                    value={vm.data2.data?.data} 
                    scrollable
                    selection={vm.selectedOrder}
                    onRowSelect={onRowSelect}
                    selectionMode={"single"}
                    scrollHeight='70vh'>
                        <Column field="order_id" header="Order Id" sortable></Column>
                        <Column field="status" header="Status" sortable></Column>
                        <Column field="table" header="Table" sortable></Column>
                        <Column field="total_price" header="Total Price" sortable></Column>
                       
                    </DataTable>
                </div>
                <div className='w-full flex flex-col'>
                <div className="w-full h-full p-3 bg-white shadow-lg rounded-md border-r border-neutral-60/30">
                <span>On </span>
                    <DataTable 
                    value={vm.data2.data?.data} 
                    scrollable
                    selection={vm.selectedOrder}
                    onRowSelect={onRowSelect}
                    selectionMode={"single"}
                    scrollHeight='30vh'>
                        <Column field="order_id" header="Order Id" sortable></Column>
                        <Column field="status" header="Status" sortable></Column>
                        <Column field="table" header="Table" sortable></Column>
                        <Column field="total_price" header="Total Price" sortable></Column>
                       
                    </DataTable>
                </div>
                <div className="w-full h-full p-3 bg-white shadow-lg rounded-md border-r border-neutral-60/30">
                <span>On Delivery</span>
                    <DataTable 
                    value={vm.data2.data?.data} 
                    scrollable
                    selection={vm.selectedOrder}
                    onRowSelect={onRowSelect}
                    selectionMode={"single"}
                    scrollHeight='30vh'>
                        <Column field="order_id" header="Order Id" sortable></Column>
                        <Column field="status" header="Status" sortable></Column>
                        <Column field="table" header="Table" sortable></Column>
                        <Column field="total_price" header="Total Price" sortable></Column>
                       
                    </DataTable>
                </div>
                </div>
            </div>
            <ChasierModal 
            data={vm.selectedOrder}
            handleProcess={vm.handleProcess}
            closeModal={() => vm.setSelectedOrder(null)}
            />
        </main>
    );
}