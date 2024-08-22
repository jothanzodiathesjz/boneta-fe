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
            <span>{(rowData.total_price * 1.1).toLocaleString('id-ID')}</span>
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

useEffect(()=>{
   
},[vm.selectedOrder])


    return (
        <main className="min-h-screen pt-20">
            <div className="w-full h-full grid grid-cols-3">
                <div className="w-full flex flex-col h-[85vh] p-3 gap-3 border-r  border-neutral-60/30">
                    <span>Order List</span>
                    <DataTable 
                    value={vm.orders} 
                    scrollable
                    pt={
                        {
                            column:{bodyCell:{className:'scroller'}},
                            wrapper:{
                                className:'h-[75vh] overflow-y-scroll scroller'
                            }
                        }
                    }
                    className='border border-neutral-60/30 scroller'
                    selection={vm.selectedOrder}
                    onRowSelect={onRowSelect}
                    selectionMode={"single"}
                    >
                        <Column field="order_id" header="Order Id" headerClassName='bg-primary-surface' sortable></Column>
                        <Column field="status" header="Status" headerClassName='bg-primary-surface' sortable></Column>
                        <Column field="table" header="Table" headerClassName='bg-primary-surface' sortable></Column>
                        <Column field="total_price" body={bodyTambahan} header="Total Price" headerClassName='bg-primary-surface' sortable></Column>
                        
                    </DataTable>
                </div>
                <div className="w-full h-full p-3  border-r border-neutral-60/30">
                <span>On Process</span>
                    <DataTable 
                    value={vm.data2.data?.data} 
                    scrollable
                    pt={
                        {
                            column:{bodyCell:{className:'scroller'}},
                            wrapper:{
                                className:'h-[75vh] overflow-y-scroll scroller'
                            }
                        }
                    }
                    className='border border-neutral-60/30'
                    selection={vm.selectedOrder}
                    onRowSelect={onRowSelect}
                    selectionMode={"single"}
                    >
                        <Column field="order_id" header="Order Id" headerClassName='bg-primary-surface' sortable></Column>
                        <Column field="status" header="Status" headerClassName='bg-primary-surface' sortable></Column>
                        <Column field="table" header="Table"  headerClassName='bg-primary-surface'sortable></Column>
                        <Column body={bodyTambahan} header="Total Price" headerClassName='bg-primary-surface' sortable></Column>
                       
                    </DataTable>
                </div>
                <div className='w-full flex flex-col'>
                <div className="w-full h-full p-3  border-r border-neutral-60/30">
                <span>On Ended</span>
                    <DataTable 
                    value={vm.data3.data?.data} 
                    scrollable
                    pt={
                        {
                            column:{bodyCell:{className:'scroller'}},
                            wrapper:{
                                className:'h-[40vh] overflow-y-scroll scroller'
                            }
                        }
                    }
                    className='border border-neutral-60/30'
                    selection={vm.selectedOrder}
                    onRowSelect={onRowSelect}
                    selectionMode={"single"}
                    
                    >
                        <Column field="order_id" header="Order Id" headerClassName='bg-primary-surface' sortable></Column>
                        <Column field="status" header="Status" headerClassName='bg-primary-surface' sortable></Column>
                        <Column field="table" header="Table" headerClassName='bg-primary-surface' sortable></Column>
                        <Column body={bodyTambahan} header="Total Price" headerClassName='bg-primary-surface' sortable></Column>
                       
                    </DataTable>
                </div>
                <div className="w-full h-full p-3  border-r border-neutral-60/30">
                <span>In Delivery</span>
                    <DataTable 
                    value={vm.data4.data?.data} 
                    scrollable
                    pt={
                        {
                            column:{bodyCell:{className:'scroller'}},
                            wrapper:{
                                className:'h-[30vh] overflow-y-scroll scroller'
                            }
                        }
                    }
                    className='border border-neutral-60/30'
                    selection={vm.selectedOrder}
                    onRowSelect={onRowSelect}
                    selectionMode={"single"}
                    >
                        <Column field="order_id" header="Order Id" headerClassName='bg-primary-surface' sortable></Column>
                        <Column field="status" header="Status" headerClassName='bg-primary-surface' sortable></Column>
                        <Column field="table" header="Table" headerClassName='bg-primary-surface' sortable></Column>
                        <Column body={bodyTambahan} header="Total Price" headerClassName='bg-primary-surface' sortable></Column>
                       
                    </DataTable>
                </div>
                </div>
            </div>
            <ChasierModal 
            data={vm.selectedOrder}
            handleProcess={(e)=>vm.handleProcess(e)}
            closeModal={() => vm.setSelectedOrder(null)}
            hanldeReject={vm.handleReject}
            handleDeleteItem={(uuid,uuid_item) => vm.handleDeleteItem(uuid,uuid_item)}
            handleRejectPayment={()=>vm.rejectPayment()}
            />
        </main>
    );
}