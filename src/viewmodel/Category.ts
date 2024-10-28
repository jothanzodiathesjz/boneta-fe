import { useState, useRef } from "react";
import { DomainCategory } from "@/domain/Category";
import { HttpClient } from "@/services/httpClient";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
const http = new HttpClient();
export const CategoryViewModel = () => {
  const [category, setCategory] = useState<DomainCategory[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<DomainCategory | null>();
  const toast = useRef<Toast>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState<DomainCategory>({
    uuid: "",
    name: "",
  });
  const [tbd, setTbd] = useState<DomainCategory | null>();
  const { data, isError, isLoading, mutate } =
    http.Send<DomainCategory[]>("/api/category");
  const [meja, setMeja] = useState("");
  const [generateLoading, setGenerateLoading] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const showError = () => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: "Terjadi Kesalahan",
      life: 3000,
    });
  };

  const showSuccess = () => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Data Telah Tersimpan",
      life: 3000,
    });
  };
  const handleCreateCategory = async () => {
    try {
      await http.Post<DomainCategory>("/api/create-category", {
        body: JSON.stringify(categoryForm),
      });
      showSuccess();
      mutate();
    } catch (error) {
      showError();
    }
    setShowCategoryForm(false);
  };

  const handleGenerate = () => {
    if (meja === "") {
      return;
    }
    setShowQr(false);
    setGenerateLoading(true);
    setTimeout(() => {
      setShowQr(true);
      setGenerateLoading(false);
    }, 500);
  };


  const reject = () => {
    toast.current?.show({
      severity: "warn",
      summary: "ditolak",
      detail: "You have ditolak",
      life: 3000,
    });
  };
  const confirm2 = (tbd: DomainCategory) => {
    setTbd(tbd);
    const accept = async () => {
      try {
        if (!tbd) throw new Error("Data Tidak Valid");
        await http.Delete<DomainCategory>(
          `/api/category/${tbd?.uuid}`,
        );
        toast.current?.show({
          severity: "info",
          summary: "Confirmed",
          detail: `${tbd?.name} has been deleted`,
          life: 3000,
        });
      } catch (error) {
        toast.current?.show({
          severity: "warn",
          summary: "Error",
          detail: "Terjadi Kesalahan",
          life: 3000,
        });
      }
      setSelectedCategory(null);
      mutate();
    };
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    });
  };
  return {
    category,
    setCategory,
    data,
    isError,
    isLoading,
    categoryForm,
    setCategoryForm,
    selectedCategory,
    setSelectedCategory,
    handleCreateCategory,
    showCategoryForm,
    setShowCategoryForm,
    confirm2,
    tbd,
    setTbd,
    mutate,
    toast,
    meja,
    setMeja,
    generateLoading,
    handleGenerate,
    showQr,
    setShowQr,
  };
};
