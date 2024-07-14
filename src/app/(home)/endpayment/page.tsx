'use client';
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";

export default function EndPayment() {
    const router = useRouter()
    return (
        <div className=" w-full flex flex-col gap-4 bg-[#FAFAFD] min-h-screen rounded-sm layout-border">
            <div className="p-5"></div>
            <div className="relative p-5 flex justify-center items-center bg-white shadow-sm">
                <button
                    onClick={() => router.back()}
                    className="absolute left-3 flex items-center font-bold text-neutral-500"
                >
                    <span className="material-icons text-3xl">navigate_before</span>
                </button>
                <span className="font-bold text-neutral-500">End Payment</span>
            </div>
            <div className="w-full p-5 flex flex-col justify-center items-center ">
                <span>Silahkan Menuju ke Kasir</span>
                <Button
                label="Sudah Bayar"
                />
            </div>
        </div>
    );
}