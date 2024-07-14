import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import { DomainOrder } from "@/domain/Orders";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

type ChasierModalProps = {
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

export default function ChasierModal({ data, closeModal, handleProcess }: ChasierModalProps) {
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
            <div className="w-full flex row">
                <div className="w-full flex flex-col ">
                    <div className="w-full flex flex-col gap-4 bg-white p-4 rounded-md shadow-md">
                        <span className="font-semibold">Order Information</span>
                        <div className="flex flex-row w-full">
                            <span className="w-32 flex-shrink-0 ">OrderID</span>
                            <span className="w-full  text-black">: {data?.order_id}</span>
                        </div>
                        <div className="flex flex-row w-full">
                            <span className="w-32 flex-shrink-0 ">Name</span>
                            <span className="w-full  text-black">: {data?.customer.name}</span>
                        </div>
                        <div className="flex flex-row w-full">
                            <span className="w-32 flex-shrink-0 ">Email</span>
                            <span className="w-full  text-black">: {data?.customer.email}</span>
                        </div>
                        <div className="flex flex-row w-full">
                            <span className="w-32 flex-shrink-0 ">Phone</span>
                            <span className="w-full  text-black">: {data?.customer.phone}</span>
                        </div>
                        <div className="flex flex-row w-full">
                            <span className="w-32 flex-shrink-0 ">Status</span>
                            <span className={`w-full  text-black ${data?.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>: {data?.status}</span>
                        </div>
                        <div className="flex flex-row w-full">
                            <span className="w-32 flex-shrink-0 ">Table</span>
                            <span className="w-full  text-black">: {data?.table}</span>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-4 mt-5 bg-white p-4 rounded-md shadow-md">
                        <span className="font-semibold">Payment Information</span>
                        <div className="flex flex-row w-full">
                            <span className="w-32 shrink-0 ">OrderID</span>
                            <span className="w-full  text-black">: {data?.order_id}</span>
                        </div>
                        <div className="flex flex-row w-full">
                            <span className="w-32 shrink-0 ">Payment Method</span>
                            <span className="w-full  text-black">: {data?.payment.name}</span>
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
                        <div className="w-full flex flex-col gap-3 overflow-auto h-[60vh]">
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
                    </div>
                </div>
                <div className="w-full flex flex-col px-4">
                    <div className="w-full flex flex-col gap-3  border-neutral-80 bg-white p-2 rounded-md shadow-md">
                    <span className="font-semibold">Order Summary</span>
                    <div className="w-full flex flex-row justify-between">
                        <span>Quantity</span>
                        <span>{data?.quantity}</span>
                    </div>
                    <div className="w-full flex flex-row justify-between border-b border-neutral-80 pb-4">
                        <span>Total Price</span>
                        <span>{data?.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                    </div>
                    {data?.status === 'pending' && data?.payment.value === 'cash' && <><div className="w-full flex flex-col mt-3 gap-2">
                        <span>Masukkan Nominal Diterima</span>
                        <InputNumber
                        value={totalBayar}
                        onChange={(e) => (setTotalBayar(e.value!), setKembalian(e.value! - data?.total_price!))}
                        />
                    </div>
                    <div className="w-full flex flex-col mt-2 gap-2">
                        <span>Kembalian</span>
                        <InputNumber
                        disabled
                        value={kembalian}
                        />
                    </div>
                    <Button
                    label="Proses"
                    severity="success"
                    onClick={handleProcess}
                    className="w-full"
                    /> </>}
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
