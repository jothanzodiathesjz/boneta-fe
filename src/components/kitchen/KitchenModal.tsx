import { Sidebar } from "primereact/sidebar";
import { useState, useRef } from "react";
import { DomainOrder } from "@/domain/Orders";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmPopup } from "primereact/confirmpopup";

type KitchenModalProps = {
  data: DomainOrder | null;
  closeModal: () => void;
  handleProcess: (e: string) => void;
  handleDeleteItem: (uuid: string, uuid_item: string) => void;
};

const stylePt = {
  header: {
    style: {
      fontWeight: "bold",
      border: "1px solid #dee2e6",
      backgroundColor: "#ffff",
    },
  },
  content: {
    style: {
      padding: "1rem",
      boxShadow: "none",
      border: "none",
    },
  },
  root: {
    style: {
      boxShadow: "none",
    },
  },
};

export default function KitchenModal({
  data,
  closeModal,
  handleProcess,
  handleDeleteItem,
}: KitchenModalProps) {
  const toast = useRef<Toast>(null);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const buttonEl = useRef(null);
  const getMaxNumber = Math.max(
    ...(data?.items.map((item) => item.stage) ?? [0])
  );

  const accept = () => {
    toast?.current?.show({
      severity: "info",
      summary: "Confirmed",
      detail: "You have diterima",
      life: 3000,
    });
    handleDeleteItem(data?.uuid!, selectedUuid!);
  };

  const reject = () => {
    toast?.current?.show({
      severity: "warn",
      summary: "ditolak",
      detail: "ditolak",
      life: 3000,
    });
  };
  return (
    <Sidebar
      pt={stylePt}
      className="h-screen bg-[#FAFAFD]"
      visible={data ? true : false}
      header="Detail Pesanan"
      position="bottom"
      onHide={closeModal}
    >
      <Toast ref={toast} />
      <div className="w-full flex  flex-row">
        <div className="w-[40vw] shrink-0 flex flex-col ">
          <div className="w-full flex flex-col gap-4  bg-white p-4 rounded-md shadow-md">
            <span className="font-semibold">Informasi Pembayaran</span>
            <div className="flex flex-row w-full">
              <span className="w-32 shrink-0 ">ID Pesanan</span>
              <span className="w-full  text-black">: {data?.order_id}</span>
            </div>
            <div className="flex flex-row w-full">
              <span className="w-32 shrink-0 ">Metode Pembayaran</span>
              <span className="w-full  text-black">: {data?.payment.name}</span>
            </div>
            <div className="flex flex-row w-full">
              <span className="w-32 shrink-0 ">Status</span>
              <span className="w-full  text-black">: {data?.status}</span>
            </div>
            <div className="flex flex-row w-full">
              <span className="w-32 shrink-0 ">Meja</span>
              <span className="w-full  text-black">: {data?.table}</span>
            </div>
            <div className="flex flex-row w-full">
              <span className="w-32 shrink-0 ">Mode</span>
              <span className="w-full  text-black">
                : {data?.delivery ? "Delivery" : "Dine in"}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col px-4">
          <div className="w-full flex flex-col gap-3  border-neutral-80 bg-white p-2 rounded-md shadow-md">
            <span className="font-semibold">Item Pesanan</span>
            <div className="w-full flex flex-row items-center  border-b border-neutral-80 rounded-md p-3">
              <span className="w-44 flex-shrink-0 font-semibold">Nama</span>
              <span className="w-32 flex-shrink-0 font-semibold">Harga</span>
              <span className="w-28 flex-shrink-0 font-semibold text-center">
                Jumlah
              </span>
            </div>
            <div className="w-full flex flex-col gap-3 overflow-auto h-[45vh]">
              {data?.items
                .filter((item) => !item.deleted_at)
                .map((item) => (
                  <div
                    key={item.uuid}
                    className="w-full flex flex-row items-center  border-b border-neutral-80 rounded-md p-3"
                  >
                    <span className="w-44 flex-shrink-0">{item.name}</span>
                    <span className="w-32 flex-shrink-0">
                      {item.price.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </span>
                    <span className="w-28 flex-shrink-0 text-center">
                      {item.quantity}
                    </span>
                    <span className="w-28 flex-shrink-0 text-center text-danger-main animate-pulse">
                      {item.stage === getMaxNumber ? "Baru" : ""}
                    </span>
                    <div className="card flex justify-content-center">
                      <button
                        ref={buttonEl}
                        onClick={() => setSelectedUuid(item.uuid_item!)}
                      >
                        <span>
                          <i className="pi pi-trash"></i>
                        </span>
                      </button>
                      <ConfirmPopup
                        visible={selectedUuid ? true : false}
                        onHide={() => setSelectedUuid(null)}
                        message="Are you sure you want to proceed?"
                        icon="pi pi-exclamation-triangle"
                        accept={accept}
                        reject={reject}
                      />
                    </div>
                  </div>
                ))}
            </div>
            <div className="w-full flex flex-col  gap-3 border border-neutral-80 p-3 rounded-lg">
              <div className="w-full flex justify-between flex-row">
                <span>Total Item</span>
                <span>{data?.quantity}</span>
              </div>
              <div className="w-full flex justify-between flex-row">
                <span>PPN</span>
                <span>10%</span>
                <span>
                  {((data?.total_price || 0) * (10 / 100)).toLocaleString(
                    "id-ID",
                    { style: "currency", currency: "IDR" }
                  )}
                </span>
              </div>
              <div className="w-full flex justify-between flex-row">
                <span>Total Harga</span>
                <span>
                  {((data?.total_price || 0) * 1.1).toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </span>
              </div>
              {(data?.status === "diterima" || data?.status === "menunggu") && (
                <Button
                  label="Konfirmasi"
                  onClick={() => handleProcess("proses")}
                />
              )}
              {data?.status === "proses" && (
                <Button label="Selesai" onClick={() => handleProcess("siap")} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
