import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import { DomainOrder } from "@/domain/Orders";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Image } from "primereact/image";

type OrderMenuModalProps = {
  data: DomainOrder | null;
  visible: boolean;
  closeModal: () => void;
  handleProcess: () => void;
};

const stylePt = {
  header: {
    style: {
      padding: 0,
    },
  },
  content: {
    style: {
      padding: 0,
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

export default function OrderMenuModal({
  data,
  closeModal,
  handleProcess,
  visible,
}: OrderMenuModalProps) {
  return (
    <Sidebar
      pt={stylePt}
      className="w-full bg-transparent h-screen "
      visible={visible}
      position="bottom"
      showCloseIcon={false}
      onHide={closeModal}
    >
      <div className="w-full flex justify-center">
        <div className="md:w-[500px] bg-white h-screen  w-full">
          <div className="w-full flex flex-row justify-between items-center p-3 border-b border-neutral-80">
            <span>Tambah Menu</span>
            <button onClick={closeModal}>
              <span className="material-icons">close</span>
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
