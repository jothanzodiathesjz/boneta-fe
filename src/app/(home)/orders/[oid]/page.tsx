"use client";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { useEffect, useRef } from "react";
import Loader from "@/components/Loader";
import FileUpload from "@/components/input/FileUpload";
import { OrderDetailViewModel } from "@/viewmodel/OrderDetail.vm";
import { UnixToDateString } from "@/utils/date";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
export default function Page() {
  const router = useRouter();
  const vm = OrderDetailViewModel();
  useEffect(() => {
    console.log(vm.data);
  }, [vm.data]);
  const receiptRef = useRef<HTMLDivElement>(null);
  const handleDownloadPdf = async () => {
    if (receiptRef.current) {
      receiptRef.current.style.display = "block";
      const element = receiptRef.current;
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(vm.data?.data.order_id + ".pdf");
      receiptRef.current.style.display = "none";
    }
  };

  useEffect(() => {}, [vm.loading]);

  const receiptHtml = () => (
    <div
      ref={receiptRef}
      style={{ display: "none", position: "absolute", zIndex: "-999" }}
      className="h-min-[100vh]"
    >
      <div className="w-full h-full flex flex-col bg-white gap-3 p-5">
        <div className="flex w-full justify-center py-2">
          <span className="font-bold">{vm.data?.data.order_id}</span>
        </div>
        <span className="w-full text-center">
          ---------------------------------------------------------
        </span>
        <div className="flex flex-col w-full justify-center  gap-2   py-2">
          <span>RM Boneta</span>
          <span>Alamat: Jl Perintis Kemerdekaan</span>
          <span>
            Date:{" "}
            {UnixToDateString(
              vm.data?.data.created_at ? vm.data?.data.created_at : 0
            )}
          </span>
          <span className="text-danger-pressed">
            Mode: {vm.data?.data.delivery ? "Delivery" : "Dine In"}
          </span>
        </div>
        <span className="w-full text-center">
          ---------------------------------------------------------
        </span>
        <div className="w-full h-full flex flex-col justify-center items-center gap-4 pb-3 bg-white">
          <span className=" w-full">Items</span>
          {vm.data?.data?.items
            .filter((v) => !v.deleted_at)
            .map((item, index) => (
              <div key={index} className="flex flex-row w-full ">
                <span className="w-40 flex-shrink-0">{item.name}</span>
                <span className="w-16  flex-shrink-0 text-danger-main">
                  {item.stage > 1 ? "new" : ""}{" "}
                </span>
                <div className="flex w-full ">
                  {item.deleted_at ? (
                    <span className="text-neutral-40 w-full text-end line-through">
                      Habis
                    </span>
                  ) : (
                    <>
                      <span className="w-full text-neutral-40">
                        {item.quantity} x
                      </span>
                      <span className="text-neutral-40">
                        {item.price.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
        <span className="w-full text-center">
          ---------------------------------------------------------
        </span>
        <div className="flex w-full  border-neutral-80 border-dotted py-3">
          <span className="w-full">Total</span>
          <span className="text-neutral-40">
            {vm.data?.data.total_price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
        </div>
        <span className="w-full text-center">
          ---------------------------------------------------------
        </span>
        <div className="flex w-full justify-center py-8">
          <span>Thank You For Choosing Us</span>
        </div>
      </div>
    </div>
  );

  if (vm.data?.data) {
    return (
      <div className=" w-full flex flex-col gap-3 bg-[#FAFAFD] min-h-screen rounded-sm layout-border">
        {vm.loading && <Loader />}
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
          {vm.data.data.status === "selesai" ? (
            <button
              onClick={() => handleDownloadPdf()}
              className="text-primary-hover"
            >
              <i className="pi pi-download"></i> Receipt
            </button>
          ) : !vm.data.data.delivery ? (
            <button
              onClick={() => router.push(`/adjustment/${vm.data?.data.uuid}`)}
              className="text-primary-hover"
            >
              + Tambah Pesanan
            </button>
          ) : null}
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
            {vm.data?.data?.items.map((item, index) => (
              <div key={index} className="flex flex-row w-full ">
                <span className="w-40 flex-shrink-0">{item.name}</span>
                <span className="w-16  flex-shrink-0 text-danger-main">
                  {item.stage > 1 ? "new" : ""}{" "}
                </span>
                <div className="flex w-full ">
                  {item.deleted_at ? (
                    <span className="text-neutral-40 w-full text-end line-through">
                      Habis
                    </span>
                  ) : (
                    <>
                      <span className="w-full text-neutral-40">
                        {item.quantity} x
                      </span>
                      <span className="text-neutral-40">
                        {item.price.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex w-full">
            <span className="w-44 flex-shrink-0">PPN</span>
            <span className="w-full text-neutral-40">10%</span>
            <span className="text-neutral-40">
              {(vm.data.data.total_price * (10 / 100)).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </span>
          </div>
          <div className="flex w-full">
            <span className="w-44 flex-shrink-0">Total</span>
            <span className="w-full text-neutral-40">
              {vm.data.data.quantity}
            </span>
            <span className="text-neutral-40">
              {(vm.data.data.total_price * 1.1).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </span>
          </div>
        </div>
        {((vm.data.data.payment.value === "transfer" &&
          vm.data.data.status === "disajikan" &&
          (!vm.data.data.payment_image ||
            vm.data.data.payment_image === "ditolak")) ||
          (vm.data.data.status === "menunggu" &&
            vm.data.data.delivery &&
            !vm.data.data.payment_image &&
            vm.data.data.payment.value === "transfer")) && (
          <div className="w-full flex flex-col justify-center items-center gap-3">
            <Image src="/mandiri.png" alt="mandiri" width={200} height={60} />
            <span>Bank Mandiri</span>
            <span>1700004355503</span>
          </div>
        )}
        {vm.data.data.payment.value === "cash" &&
          vm.data.data.status === "menunggu" && (
            <div className="w-full p-5 flex flex-col justify-center items-center gap-3">
              <span className="text-center font-medium text-neutral-40">
                Menunggu Konfirmasi
              </span>
            </div>
          )}
        {vm.data.data.payment.value === "transfer" &&
        vm.data.data.status === "disajikan" &&
        !vm.data.data.payment_image ? (
          <div className="w-full p-5 flex flex-col justify-center items-center gap-3">
            <span className="text-center font-medium text-neutral-40">
              Pesanan Telah Siap, Silahkan Mengupload Bukti Pembayaran
            </span>
            <FileUpload
              allowedFileTypes={["image/png", "image/jpeg", "image/jpg"]}
              onFileSelect={vm.handleFileSelect}
            />
            <Button
              disabled={vm.selectedFile === null}
              onClick={vm.handleUploadImage}
              label="Upload"
              className="w-full"
            />
          </div>
        ) : (
          <div className="w-full p-5 flex flex-col justify-center items-center gap-3">
            <span className="text-center font-medium text-neutral-40">
              {vm.data.data.status === "menunggu" &&
              vm.data.data.payment.value === "transfer" &&
              !vm.data.data.delivery
                ? "Menunggu konfirmasi dari kasir"
                : ""}
              {vm.data.data.status === "disajikan" &&
              vm.data.data.payment_image !== "ditolak"
                ? "Selamat Menikmati, Konfirmasi Ke kasir Untuk menyelesaikan pembayaran"
                : ""}
              {vm.data.data.status === "menunggu" &&
              vm.data.data.payment.value === "transfer" &&
              vm.data.data.delivery &&
              vm.data.data.payment_image !== "ditolak"
                ? "Menunggu konfirmasi dari kasir"
                : ""}
              {vm.data.data.status === "menunggu" &&
              vm.data.data.payment.value === "cod" &&
              vm.data.data.delivery
                ? "Menunggu konfirmasi dari kasir"
                : ""}
              {vm.data.data.status === "diterima"
                ? "Menunggu Konfirmasi Dapur"
                : ""}
              {vm.data.data.status === "proses"
                ? "Pesanan sedang diproses"
                : ""}
              {vm.data.data.status === "selesai"
                ? "Terimakasih telah melakukan pemesanan"
                : ""}
              {vm.data.data.status === "ditolak"
                ? "Pesanan ditolak, Silahakan pesan kembali"
                : ""}
              {vm.data.data.status === "siap" && vm.data.data.delivery
                ? "Menunggu Konfirmasi Kurir"
                : ""}
              {vm.data.data.status === "siap" &&
              !vm.data.data.delivery &&
              vm.data.data.payment_image !== "ditolak"
                ? "Pesanan Telah Siap, menunggu konfirmasi pelayan"
                : ""}
              {(vm.data.data.status === "menunggu" ||
                vm.data.data.status === "disajikan") &&
              vm.data.data.payment_image === "ditolak"
                ? "Bukti Transfer Tidak Valid, Mohon untuk upload ulang"
                : ""}
              {/* {
                            (vm.data.data.status === 'diproses' && vm.data.data.payment.value === 'cod' ? "Pesanan Telah Di Proses" : "")
                        } */}
              {vm.data.data.status === "diantarkan"
                ? "Pesanan dalam perjalanan"
                : ""}
            </span>
          </div>
        )}

        {vm.data.data.status === "menunggu" &&
          vm.data.data.delivery &&
          !vm.data.data.payment_image &&
          vm.data.data.payment.value === "transfer" && (
            <div className="w-full p-5 flex flex-col justify-center items-center gap-3">
              <span className="text-center font-medium text-neutral-40">
                Silahkan Mengupload Bukti Pembayaran
              </span>
              <FileUpload
                allowedFileTypes={["image/png", "image/jpeg", "image/jpg"]}
                onFileSelect={vm.handleFileSelect}
              />
              <Button
                disabled={vm.selectedFile === null}
                onClick={vm.handleUploadImage}
                label="Upload"
                className="w-full"
              />
            </div>
          )}
        {(vm.data.data.status === "disajikan" ||
          vm.data.data.status === "menunggu") &&
          vm.data.data.payment_image === "ditolak" &&
          vm.data.data.payment.value === "transfer" && (
            <div className="w-full p-5 flex flex-col justify-center items-center gap-3">
              <span className="text-center font-medium text-neutral-40">
                Silahkan Mengupload Bukti Pembayaran
              </span>
              <FileUpload
                allowedFileTypes={["image/png", "image/jpeg", "image/jpg"]}
                onFileSelect={vm.handleFileSelect}
              />
              <Button
                disabled={vm.selectedFile === null}
                onClick={vm.handleUploadImage}
                label="Upload"
                className="w-full"
              />
            </div>
          )}

        {/* <OrderMenuModal
                visible={vm.showModal}
                closeModal={()=>vm.setShowModal(false)}
                data={vm.order}
                handleProcess={()=>console.log('hello')}
                /> */}

        {receiptHtml()}
      </div>
    );
  } else {
    return <Loader />;
  }
}
