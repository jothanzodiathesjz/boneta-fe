import { Sidebar } from "primereact/sidebar";
import { useState, useRef } from "react";
import { DomainOrder } from "@/domain/Orders";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Toast } from "primereact/toast";
import { ConfirmPopup } from "primereact/confirmpopup";

type ChasierModalProps = {
  data: DomainOrder | null;
  closeModal: () => void;
  handleProcess: (e: string) => void;
  hanldeReject: () => void;
  handleDeleteItem: (uuid: string, uuid_item: string) => void;
  handleRejectPayment: () => void;
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

export default function ChasierModal({
  data,
  closeModal,
  handleProcess,
  hanldeReject,
  handleDeleteItem,
  handleRejectPayment,
}: ChasierModalProps) {
  const [totalBayar, setTotalBayar] = useState(0);
  const [kembalian, setKembalian] = useState(0);
  const toast = useRef<Toast>(null);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const buttonEl = useRef(null);
  const accept = () => {
    toast?.current?.show({
      severity: "info",
      summary: "telah dikonfirmasi",
      detail: "diterima",
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

  const getMaxNumber = Math.max(
    ...(data?.items.map((item) => item.stage) ?? [0])
  );

  return (
    <Sidebar
      pt={stylePt}
      className="h-screen bg-[#FAFAFD]"
      visible={data ? true : false}
      header="Detail pesanan"
      position="bottom"
      onHide={closeModal}
    >
      <div className="w-full flex row">
        <Toast ref={toast} />
        <div className="w-full flex flex-col ">
          <div className="w-full flex flex-col gap-4 bg-white p-4 rounded-md shadow-md">
            <span className="font-semibold">Informasi Pesanan</span>
            <div className="flex flex-row w-full">
              <span className="w-32 flex-shrink-0 ">ID Pesanan</span>
              <span className="w-full  text-black">: {data?.order_id}</span>
            </div>
            <div className="flex flex-row w-full">
              <span className="w-32 flex-shrink-0 ">Nama</span>
              <span className="w-full  text-black">
                : {data?.customer.name}
              </span>
            </div>
            <div className="flex flex-row w-full">
              <span className="w-32 flex-shrink-0 ">Email</span>
              <span className="w-full  text-black">
                : {data?.customer.email}
              </span>
            </div>
            <div className="flex flex-row w-full">
              <span className="w-32 flex-shrink-0 ">Telepon</span>
              <span className="w-full  text-black">
                : {data?.customer.phone}
              </span>
            </div>
            <div className="flex flex-row w-full">
              <span className="w-32 flex-shrink-0 ">Status</span>
              <span
                className={`w-full  text-black ${
                  data?.status === "pending"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                : {data?.status}
              </span>
            </div>
            <div className="flex flex-row w-full">
              <span className="w-32 flex-shrink-0 ">Mode</span>
              <span className="text-info-main">
                : {data?.delivery ? "Delivery" : "Dine In"}
              </span>
            </div>
            <div className="flex flex-row w-full">
              <span className="w-32 flex-shrink-0 ">meja</span>
              <span className="w-full  text-black">: {data?.table}</span>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 mt-5 bg-white p-4 rounded-md shadow-md">
            <span className="font-semibold">Informasi Pembayaran</span>
            <div className="flex flex-row w-full">
              <span className="w-32 shrink-0 ">ID Pesanan</span>
              <span className="w-full  text-black">: {data?.order_id}</span>
            </div>
            <div className="flex flex-row w-full">
              <span className="w-32 shrink-0 ">Metode Pembayaran</span>
              <span className="w-full  text-black">: {data?.payment.name}</span>
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
            <div className="w-full flex flex-col gap-3 overflow-auto h-[60vh]">
              {data?.items
                .filter((v) => !v.deleted_at)
                .map((item, index) => (
                  <div
                    key={index}
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
          </div>
        </div>
        <div className="w-full flex flex-col px-4">
          <div className="w-full flex flex-col gap-3  border-neutral-80 bg-white p-2 rounded-md shadow-md">
            <span className="font-semibold">Ringkasan Pesanan</span>
            <div className="w-full flex flex-row justify-between">
              <span>Kuantitas</span>
              <span>{data?.quantity}</span>
            </div>
            <div className="w-full flex flex-row justify-between">
              <span>PPN</span>
              <span>10%</span>
              <span>
                {((data?.total_price ?? 0) * (10 / 100)).toLocaleString(
                  "id-ID",
                  { style: "currency", currency: "IDR" }
                )}
              </span>
            </div>
            <div className="w-full flex flex-row justify-between border-b border-neutral-80 pb-4">
              <span>Total Harga</span>
              <span>
                {((data?.total_price ?? 0) * 1.1).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </span>
            </div>
            {data?.status === "disajikan" && data?.payment.value === "cash" && (
              <>
                <div className="w-full flex flex-col mt-3 gap-2">
                  <span>Masukkan Nominal Diterima</span>
                  <InputNumber
                    value={totalBayar}
                    onChange={(e) => (
                      setTotalBayar(e.value!),
                      setKembalian(e.value! - (data?.total_price * 1.1)!)
                    )}
                  />
                </div>
                <div className="w-full flex flex-col mt-2 gap-2">
                  <span>Kembalian</span>
                  <InputNumber disabled value={kembalian} />
                </div>
              </>
            )}
            {(data?.status === "disajikan" || data?.status === "menunggu") &&
              data.payment_image &&
              data.payment_image !== "ditolak" && (
                <>
                  <div className="w-full flex flex-row justify-between border-b border-neutral-80 pb-4">
                    <span>Bukti Pembayaran</span>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/${data?.payment_image}`}
                      alt="Image"
                      width="250"
                      preview
                    />
                  </div>
                  <div>
                    <Button
                      label="Tolak Bukti Pembayaran"
                      severity="secondary"
                      onClick={handleRejectPayment}
                      className="w-full"
                    />
                  </div>
                </>
              )}

            {/* {data?.status === "menunggu" &&
                data.payment_image &&
                data.delivery && (
                  <div className="w-full flex flex-row justify-between border-b border-neutral-80 pb-4">
                    <span>Bukti Pembayaran</span>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/${data?.payment_image}`}
                      alt="Image"
                      width="250"
                      preview
                    />
                  </div>
                )} */}
            {/* { <Button
                    label="Konfirmasi"
                    severity="success"
                    onClick={(e)=>(handleProcess(),setTotalBayar(0),setKembalian(0))}
                    className="w-full"
                    />} */}
            {data?.status === "menunggu" && (
              <Button
                label="Konfirmasi"
                severity="success"
                onClick={() => (
                  handleProcess("diterima"), setTotalBayar(0), setKembalian(0)
                )}
                className="w-full"
              />
            )}
            {data?.status === "disajikan" && (
              <Button
                label="Selesai"
                severity="success"
                onClick={() => (
                  handleProcess("selesai"), setTotalBayar(0), setKembalian(0)
                )}
                className="w-full"
              />
            )}
            {data?.status === "menunggu" && (
              <Button
                label="Tolak"
                severity="warning"
                onClick={hanldeReject}
                className="w-full"
              />
            )}
            {/* <Button
                label="selesaikan"
                severity="success"
                onClick={(e) => (
                  handleProcess("selesai"), setTotalBayar(0), setKembalian(0)
                )}
                className="w-full"
              /> */}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
