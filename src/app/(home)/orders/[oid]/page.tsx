'use client';
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { useEffect,useState,useRef } from "react";
import FileUpload from "@/components/input/FileUpload";
import { OrderDetailViewModel } from "@/viewmodel/OrderDetail.vm";
import OrderMenuModal from "@/components/orders/OrderMenuModal";
export default function Page() {
    const router = useRouter()
    const vm = OrderDetailViewModel()
    const contentRef = useRef(null);
    useEffect(() => {
        console.log(vm.data)
    },[vm.data])

    const receiptHtml = () => (
        <div></div>

        // <div
        //   ref={contentRef}
        //   className="w-full  flex-col justify-center items-center gap-4 pb-3 bg-white border-b border-neutral-80"
        // >
        //   {/* {vm.data?.data?.items.map((item, index) => (
        //     <div key={index} className="flex flex-row w-full ">
        //       <span className="w-44 flex-shrink-0">{item.name}</span>
        //       <span className="w-32 flex-shrink-0 text-danger-main">
        //         {item.stage > 1 ? 'Tambahan' : ''}
        //       </span>
        //       <div className="flex w-full ">
        //         {item.deleted_at ? (
        //           <span className="text-neutral-40 w-full text-end line-through">Habis</span>
        //         ) : (
        //           <>
        //             <span className="w-full text-neutral-40">{item.quantity} x</span>
        //             <span className="text-neutral-40">
        //               {item.price.toLocaleString('id-ID', {
        //                 style: 'currency',
        //                 currency: 'IDR',
        //               })}
        //             </span>
        //           </>
        //         )}
        //       </div>
        //     </div>
        //   ))} */}
        // </div>
      );

    if(vm.data?.data){
        return (
            <div className=" w-full flex flex-col gap-3 bg-[#FAFAFD] min-h-screen rounded-sm layout-border">
                <div className="p-5"></div>
                <div className="relative p-5 flex justify-center items-center bg-white shadow-sm">
                    <button
                        onClick={() => router.push(`/orders`)}
                        className="absolute left-3 flex items-center font-bold text-neutral-500"
                    >
                        <span className="material-icons text-3xl">navigate_before</span>
                    </button>
                    <span className="font-bold text-neutral-500">End Payment</span>  
                </div>
                <div className="w-full flex flex-row justify-between">
                <span className="font-semibold ml-3">Order Detail</span>
                {vm.data.data.status === 'ended' ? (
                    <button 
                    onClick={()=>vm.handleDownload(contentRef.current!)}
                    className="text-primary-hover"><i className="pi pi-download"></i> Receipt
                    </button>
                ) :(!vm.data.data.delivery ? <button 
                onClick={()=>router.push(`/adjustment/${vm.data?.data.uuid}`)}
                className="text-primary-hover">+ Tambah Pesanan
                </button> : null)}
                </div>
                <div className="w-full flex flex-col bg-white gap-3 p-5">
                    <div className="flex w-full justify-between">
                        <span>Order ID</span>
                        <span>{vm.data.data.order_id}</span>
                    </div>
                    <div className="flex w-full justify-between border-b border-neutral-80 pb-3">
                        <span>Order Status</span>
                        <span className="text-danger-pressed">{vm.data.data.status}</span>
                    </div>
                <div className="w-full flex flex-col justify-center items-center gap-4 pb-3 bg-white border-b border-neutral-80">
                    {vm.data?.data?.items.map((item,index)=>(
                        <div 
                        key={index}
                        className="flex flex-row w-full ">
                        <span className="w-32 flex-shrink-0">{item.name}</span>
                        <span className="w-32  flex-shrink-0 text-danger-main">{item.stage > 1 ? 'Tambahan' : ''} </span>
                        <div className="flex w-full ">
                            {item.deleted_at ? (
                                <span className="text-neutral-40 w-full text-end line-through">Habis</span>
                            ) : (
                                <>
                                    <span className="w-full text-neutral-40">{item.quantity} x</span>
                                    <span className="text-neutral-40">{item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                                </>
                            )}
                           
                        </div>
                    </div>
                    )) }
                </div>
                    <div className="flex w-full">
                        <span className="w-44 flex-shrink-0">Total</span>
                        <span className="w-full text-neutral-40">{vm.data.data.quantity}</span>
                        <span className="text-neutral-40">{vm.data.data.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                    </div>
                </div>
               {vm.data.data.payment.value === 'cash' && vm.data.data.status === 'pending' && 
                    <div className="w-full p-5 flex flex-col justify-center items-center gap-3">
                        <span className="text-center font-medium text-neutral-40">Menunggu Konfirmasi</span>
                    </div>
                }
                {(vm.data.data.payment.value === 'transfer' && 
                vm.data.data.status === 'ready' && 
                !vm.data.data.payment_image ) 
                
                ?

                <div className="w-full p-5 flex flex-col justify-center items-center gap-3">
                        <span className="text-center font-medium text-neutral-40">Silahkan Mengupload Bukti Pembayaran</span>
                       <FileUpload
                       allowedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
                       onFileSelect={vm.handleFileSelect}
                       />
                       <Button
                       disabled={vm.selectedFile === null}
                       onClick={vm.handleUploadImage}
                       label="Upload"
                       className="w-full"
                       />
                </div>

                :
                <div className="w-full p-5 flex flex-col justify-center items-center gap-3">
                    <span className="text-center font-medium text-neutral-40">
                        {
                            (vm.data.data.status === 'waiting' && vm.data.data.payment.value === 'transfer' ? "Menunggu konfirmasi dari kasir" : "")
                        }
                        {
                            (vm.data.data.status === 'ready' && vm.data.data.payment_image ? "Konfirmasi Kekasir Untuk  Menyelesaikan Pesanan" : "")
                        }
                        {
                            (vm.data.data.status === 'process' ? "Pesanan sedang diproses" : "")
                        }
                        {
                            (vm.data.data.status === 'ended' ? "Terimakasih telah melakukan pemesanan" : "")
                        }
                        {
                            (vm.data.data.status === 'rejected' ? "Pesanan ditolak, Silahakan pesan kembali" : "")
                        }
                        {
                            (vm.data.data.status === 'ready' && vm.data.data.delivery ? "Menunggu Konfirmasi Kurir" : "")
                        }
                        {
                            (vm.data.data.status === 'process' && vm.data.data.payment.value === 'cod' ? "Pesanan Telah Di Proses" : "")
                        }
                        {
                            (vm.data.data.status === 'in-delivery'  ? "Pesanan dalam perjalanan" : "")
                        }
                    </span>
                </div>


                }
                
                {
                    vm.data.data.status === 'waiting' && 
                    vm.data.data.delivery &&
                    !vm.data.data.payment_image &&
                    vm.data.data.payment.value === "transfer" &&
                    <div className="w-full p-5 flex flex-col justify-center items-center gap-3">
                        <span className="text-center font-medium text-neutral-40">Silahkan Mengupload Bukti Pembayaran</span>
                       <FileUpload
                       allowedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
                       onFileSelect={vm.handleFileSelect}
                       />
                       <Button
                       disabled={vm.selectedFile === null}
                       onClick={vm.handleUploadImage}
                       label="Upload"
                       className="w-full"
                       />
                </div>
                }

                {/* <OrderMenuModal
                visible={vm.showModal}
                closeModal={()=>vm.setShowModal(false)}
                data={vm.order}
                handleProcess={()=>console.log('hello')}
                /> */}

            {receiptHtml()}
            </div>
        );
    }else{
        return <div className="flex justify-center items-center h-screen bg-gray-200">
        <div className="text-center">
            <h1 className="text-4xl font-medium">404</h1>
            <p className="text-xl font-medium m-6">Sorry, the page you're looking for can't be found.</p>
            <a href="/" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Go Home</a>
        </div>
    </div>
    }

   
}