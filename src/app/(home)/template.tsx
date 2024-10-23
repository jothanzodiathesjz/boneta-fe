"use client";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import Header from "@/layouts/Headers";
import Sidebar from "@/layouts/Sidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAnimationStore } from "@/store/AnimateStore";
import "leaflet/dist/leaflet.css";
const slideRightVariants = {
  hidden: { opacity: 0, x: -1000 }, // posisi awal di sebelah kiri dan tidak terlihat
  visible: { opacity: 1, x: 0 }, // posisi akhir di tempat semula dan terlihat
  exit: { opacity: 0, x: 1000 }, // posisi saat keluar di sebelah kanan dan tidak terlihat
};
export default function Template({
  children,
  visible = false,
}: {
  children: React.ReactNode;
  visible?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const animationStore = useAnimationStore();
  const handleOpen = () => {
    console.log("handle open");
  };
  const pathName = usePathname();
  const handleClose = (v: boolean) => {
    setIsOpen(v);
  };

  useEffect(() => {
    animationStore.setIsOpen(true);
    console.log("from store", animationStore.isOpen);
  }, [isOpen]);
  return (
    <div className="md:w-[500px] w-full flex flex-col  bg-[#FAFAFD]  rounded-sm layout-border overflow-x-hidden">
      <Header toogle={() => setIsOpen(true)} />
      <AnimatePresence mode="sync">
        {animationStore.isOpen && (
          <motion.div
            key={pathName}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideRightVariants}
            transition={{ duration: 0.3 }}
            className=""
          >
            {/* <div className="sticky top-0 bg-blend-overlay  h-screen bg-black/15">
          </div> */}
            {children}
          </motion.div>
        )}
        <Sidebar toogle={handleClose} isOpen={isOpen} />
      </AnimatePresence>
    </div>
  );
}
