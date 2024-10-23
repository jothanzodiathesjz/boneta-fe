"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import DashboardHeader from "@/layouts/Dashboard.header";
import { usePathname } from "next/navigation";
import { useAnimationStore } from "@/store/AnimateStore";

const slideRightVariants = {
  hidden: { opacity: 0, x: -1000 }, // posisi awal di sebelah kiri dan tidak terlihat
  visible: { opacity: 1, x: 0 }, // posisi akhir di tempat semula dan terlihat
  exit: { opacity: 0, x: 1000 },
  // posisi saat keluar di sebelah kanan dan tidak terlihat
};
export default function Template({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
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
  }, []);
  return (
    <div className="w-full flex flex-col overflow-x-hidden bg-[#FAFAFD]  rounded-sm layout-border">
      <DashboardHeader />
      <AnimatePresence mode="sync">
        {animationStore.isOpen && (
          <motion.div
            key={pathName}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideRightVariants}
            transition={{ duration: 0.5 }}
            className=""
          >
            {/* <div className="sticky top-0 bg-blend-overlay  h-screen bg-black/15">
          </div> */}
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
