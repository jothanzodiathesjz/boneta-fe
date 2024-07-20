import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import { DomainOrder } from "@/domain/Orders";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Image } from 'primereact/image';

type KitchenModalProps = {
    data: DomainOrder | null;
    closeModal: () => void;
    handleProcess: () => void;
};

const stylePt = {
    header: {
        style: {
            fontWeight: 'bold',
            border: '1px solid #dee2e6',
            backgroundColor: '#ffff',
        }
    },
    content: {
        style: {
            padding: '1rem',
            boxShadow: 'none',
            border: 'none'
        }
    },
    root: {
        style: {
            boxShadow: 'none',
        }
    }
}

export default function KitchenModal({ data, closeModal, handleProcess }: KitchenModalProps) {
    const [visibleBottom, setVisibleBottom] = useState(true);
    const [totalBayar, setTotalBayar] = useState(0);
    const [kembalian, setKembalian] = useState(0);
    return (
        <Sidebar
            pt={stylePt}
            className="h-screen bg-[#FAFAFD]"
            visible={data ? true : false}
            header="Order Detail"
            position="bottom"
            onHide={closeModal}
        >
            <div className="w-full flex  flex-row">
                <div className="w-[40vw] shrink-0 flex flex-col ">
                    <div className="w-full flex flex-col gap-4  bg-white p-4 rounded-md shadow-md">
                        <span className="font-semibold">Payment Information</span>
                        <div className="flex flex-row w-full">
                            <span className="w-32 shrink-0 ">OrderID</span>
                            <span className="w-full  text-black">: {data?.order_id}</span>
                        </div>
                        <div className="flex flex-row w-full">
                            <span className="w-32 shrink-0 ">Payment Method</span>
                            <span className="w-full  text-black">: {data?.payment.name}</span>
                        </div>
                        <div className="flex flex-row w-full">
                            <span className="w-32 shrink-0 ">Status</span>
                            <span className="w-full  text-black">: {data?.status}</span>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col px-4">
                    <div className="w-full flex flex-col gap-3  border-neutral-80 bg-white p-2 rounded-md shadow-md">
                        <span className="font-semibold">Order Item</span>
                        <div className="w-full flex flex-row items-center  border-b border-neutral-80 rounded-md p-3">
                            <span className="w-44 flex-shrink-0 font-semibold">Name</span>
                            <span className="w-32 flex-shrink-0 font-semibold">Price</span>
                            <span className="w-28 flex-shrink-0 font-semibold text-center">Quantity</span>
                        </div>
                        <div className="w-full flex flex-col gap-3 overflow-auto h-[50vh]">
                        {data?.items.map((item) => 
                        <div 
                        key={item.uuid}
                        className="w-full flex flex-row items-center  border-b border-neutral-80 rounded-md p-3">
                            <span className="w-44 flex-shrink-0">{item.name}</span>
                            <span className="w-32 flex-shrink-0">{item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                            <span className="w-28 flex-shrink-0 text-center">{item.quantity}</span>
                        </div>
                        )}
                        </div>
                        <div className="w-full flex flex-col  gap-3 border border-neutral-80 p-3 rounded-lg">
                         <div className="w-full flex justify-between flex-row">
                            <span>Total Item</span>
                            <span>{data?.quantity}</span>
                         </div>
                         <div className="w-full flex justify-between flex-row">
                            <span>Total Price</span>
                            <span>{data?.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                         </div>
                        <Button
                        label="End Process"
                        onClick={handleProcess}
                        />
                        </div>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
