import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  useEffect,
} from "react";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { DomainStocks } from "@/domain/Stocks";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { DropdownChangeEvent } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

type StockModalType = {
  data: DomainStocks | null;
  visible: boolean;
  udpating: boolean;
  submit: (data: DomainStocks) => void;
  closeModal: () => void;
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

export default function StockModal({ data, closeModal, visible, submit }: StockModalType) {
  const toast = useRef<Toast>(null);
  const [formData, setFormData] = useState<DomainStocks>({
    name: "",
    description: "",
    category: "",
    quantity: 0,
    unit: "",
    price: 0,
    supplier: "",
    created_at: 0,
    deleted_at: 0,
    uuid: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    category: "",
    quantity: "",
    unit: "",
    price: "",
    supplier: "",
  });

  const units = [
    { label: "Kg", value: "kg" },
    { label: "Gram", value: "gram" },
    { label: "Pcs", value: "pcs" },
    { label: "Lembar", value: "lembar" },
    { label: "Ml", value: "ml" },
    { label: "Liter", value: "liter" },
  ];

  const clearForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      quantity: 0,
      unit: "",
      price: 0,
      supplier: "",
      created_at: 0,
      deleted_at: 0,
      uuid: "",
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (value.trim() === "") {
      setErrors((prevState) => ({
        ...prevState,
        [name]: `${name} is required`,
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        [name]: "",
      }));
    }
  };

  const handleNumberChange = (name: string, value: number) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value || 0,
    }));

    if (value <= 0) {
      setErrors((prevState) => ({
        ...prevState,
        [name]: `${name} must be greater than 0`,
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        [name]: "",
      }));
    }
  };

  const handleDropdownChange = (e: DropdownChangeEvent) => {
    setFormData((prevState) => ({
      ...prevState,
      unit: e.value,
    }));

    if (!e.value) {
      setErrors((prevState) => ({
        ...prevState,
        unit: "Unit is required",
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        unit: "",
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let valid = true;

    // Validasi sebelum submit
    for (const key in formData) {
      if (formData[key as keyof DomainStocks] === "") {
        if (key === "uuid" || key === "created_at" || key === "deleted_at")
          continue;
        setErrors((prevState) => ({
          ...prevState,
          [key]: `${key} is required`,
        }));
        valid = false;
      }
    }
    console.log("Form Data:", formData);
    console.log(valid);
    if (valid) {
      // Lakukan sesuatu dengan data form, misalnya kirim ke server
      submit(formData);
      clearForm();
      closeModal();
    }
  };

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  return (
    <Sidebar
      pt={stylePt}
      className="h-screen bg-[#FAFAFD]"
      visible={visible}
      header="Stock Form"
      position="bottom"
      onHide={() => (closeModal(), clearForm())}
    >
      <Toast ref={toast} />
      <div className="w-full flex flex-row">
        <div className="w-full flex p-4 bg-gray-100 rounded-lg shadow-md">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="w-full flex flex-col gap-6"
          >
            <div className="w-full flex flex-row gap-5">
              <div className="w-full lg:w-1/2 flex flex-col gap-3">
                <div className="w-full">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Name
                  </label>
                  <InputText
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                  {errors.name && (
                    <small className="p-error">{errors.name}</small>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="description"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Description
                  </label>
                  <InputTextarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border rounded"
                  />
                  {errors.description && (
                    <small className="p-error">{errors.description}</small>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="category"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Category
                  </label>
                  <InputText
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                  {errors.category && (
                    <small className="p-error">{errors.category}</small>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="quantity"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Quantity
                  </label>
                  <InputNumber
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onValueChange={(e) =>
                      handleNumberChange("quantity", e.value || 0)
                    }
                    className="w-full p-2 border rounded"
                  />
                  {errors.quantity && (
                    <small className="p-error">{errors.quantity}</small>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col gap-3">
                <div className="w-full">
                  <label
                    htmlFor="unit"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Unit
                  </label>
                  <Dropdown
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    options={units}
                    onChange={handleDropdownChange}
                    placeholder="Select a Unit"
                    className="w-full p-0 border rounded"
                  />
                  {errors.unit && (
                    <small className="p-error">{errors.unit}</small>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="price"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Price
                  </label>
                  <InputNumber
                    id="price"
                    name="price"
                    value={formData.price}
                    onValueChange={(e) =>
                      handleNumberChange("price", e.value || 0)
                    }
                    className="w-full p-2 border rounded"
                  />
                  {errors.price && (
                    <small className="p-error">{errors.price}</small>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="supplier"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Supplier
                  </label>
                  <InputText
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                  {errors.supplier && (
                    <small className="p-error">{errors.supplier}</small>
                  )}
                </div>
              </div>
            </div>
            <Button
              type="submit"
              label="Submit"
              className="w-full p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            />
          </form>
        </div>
      </div>
    </Sidebar>
  );
}
