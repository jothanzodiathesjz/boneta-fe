import { useState } from "react";
import { useParams } from "next/navigation";
import { DomainOrder } from "@/domain/Orders";
import { HttpClient } from "@/services/httpClient";
import { parseCookies } from "nookies";
import { DomainUserWithProfile } from "@/domain/Users";

const http = new HttpClient();
export const OrderDetailViewModel = () => {
  const { oid } = useParams();
  const cookies = parseCookies();
  const user: DomainUserWithProfile | null = cookies.user
    ? new DomainUserWithProfile(JSON.parse(cookies.user))
    : null;
  const guest = localStorage.getItem("guest") || "";
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [order, setOrder] = useState<DomainOrder | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (file: File) => {
    console.log("Selected file:", file);
    setSelectedFile(file);
  };
  const { data, isError, isLoading, error, mutate } = http.Send<DomainOrder>(
    `/api/order/${oid}`,
    undefined,
    {
      headers: {
        Authorization: `Basic ${user ? `user:${user?.uuid}` : `guest:${guest}`}`,
      },
    },
    {
      revalidateOnMount: true,
      refreshInterval: 5000,
    },
  );

  const handleUploadImage = async () => {
    setLoading(true);
    try {
      const data = await http.PostWithFile<DomainOrder>(
        `/api/payment-wimg/${guest}/${oid}`,
        selectedFile!,
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    mutate();
  };

  const handleDownload = (e: HTMLElement) => {
    // Buat canvas dan gambar elemen ke canvas
    const canvas = document.createElement("canvas");
    canvas.width = 5000;
    canvas.height = 1000;
    const context = canvas.getContext("2d");

    context!.font = "16px Arial";
    context!.fillText(e.innerText, 10, 50);

    // Konversi canvas ke data URL
    const dataURL = canvas.toDataURL("image/pdf");

    // Buat link download
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "download.pdf";
    link.click();
  };

  return {
    oid,
    data,
    isError,
    isLoading,
    error,
    mutate,
    handleFileSelect,
    selectedFile,
    handleUploadImage,
    showModal,
    setShowModal,
    order,
    setOrder,
    handleDownload,
    loading,
    setLoading,
  };
};
