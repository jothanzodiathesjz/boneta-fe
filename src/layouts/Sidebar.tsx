"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar as PSidebar } from "primereact/sidebar";
import { getCookie, deleteCookie } from "@/utils/cookies";
import { useAuthStore } from "@/store/AuthStore";
type SidebarProps = {
  toogle: (v: boolean) => void;
  isOpen: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ toogle, isOpen }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const authStore = useAuthStore();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      toogle(false);
    }
  };

  const token = getCookie("accessToken");
  const user = getCookie("user");
  const jsonString = user ? decodeURIComponent(user) : "";
  const dataObject = jsonString && JSON.parse(jsonString);

  const logout = async () => {
    await authStore.logOut()
    toogle(false);
    router.push("/")
  }


  useEffect(() => {
    setVisible(isOpen);
    console.log(dataObject);
  }, [isOpen, logout]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        toogle(false);
      }
    };

    // Menambahkan event listener untuk mendeteksi klik di luar elemen
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Membersihkan event listener saat komponen dibongkar
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toogle]);

  return (
    <PSidebar
      visible={isOpen}
      className="w-full bg-transparent"
      pt={{
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
      }}
      position="right"
      showCloseIcon={false}
      onHide={() => toogle(false)}
    >
      <div className="w-full flex justify-center">
        <div className="md:w-[500px] w-full pl-20">
          <div
            ref={ref}
            className=" flex flex-col h-screen bg-white rounded-s-md p-3 layout-border gap-2"
          >
            <div className="w-full flex justify-end">
              <button onClick={() => toogle(false)}>
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="flex flex-col justify-center items-center py-3 border-b-2 gap-2 border-neutral-300">
              <span className="material-icons text-neutral-500 text-5xl">
                account_circle
              </span>
              <span className="text-neutral-700 font-semibold">
                {dataObject
                  ? dataObject.profile.firstName +
                    " " +
                    dataObject.profile.lastName
                  : "Guest"}
              </span>
            </div>
            <div className="flex flex-col justify-center items-center py-3  gap-2">
              <button
                onClick={() => router.push("/orders")}
                className="w-full flex items-center justify-start px-7 gap-4 border-[1px] shadow-lg p-3 rounded-md"
              >
                <span className="material-icons  text-neutral-500">
                  list_alt
                </span>
                <span className="text-neutral-500 font-semibold">Orders</span>
              </button>
              <button className="w-full flex items-center justify-start px-7 gap-4 border-[1px] shadow-lg p-3 rounded-md">
                <span className="material-icons  text-neutral-500">
                  manage_accounts
                </span>
                <span className="text-neutral-500 font-semibold">
                  Account Settings
                </span>
              </button>
              {token && (
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center justify-start px-7 gap-4 border-[1px] shadow-lg p-3 rounded-md"
                >
                  <span className="material-icons text-neutral-500">
                    logout
                  </span>
                  <span className="text-neutral-500 font-bold">Logout</span>
                </button>
              )}
              {!token && (
                <button
                  onClick={() => router.push("/login")}
                  className="w-full flex items-center justify-start px-7 gap-4 border-[1px] shadow-lg p-3 rounded-md"
                >
                  <span className="material-icons text-neutral-500">login</span>
                  <span className="text-neutral-500 font-semibold">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PSidebar>
  );
};

export default Sidebar;
