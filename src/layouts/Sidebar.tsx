"use client"
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar as PSidebar } from "primereact/sidebar";
import { getCookie,deleteCookie } from "@/utils/cookies";
type SidebarProps = {
    toogle: (v:boolean) => void
    isOpen: boolean
}

const Sidebar: React.FC<SidebarProps> = ({toogle, isOpen}) => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const router = useRouter()
    const [visible, setVisible] = React.useState(false);
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        toogle(false);
      }
    };

    const hanldeLogout = () => {
        deleteCookie('accessToken')
        deleteCookie('user')
        router.push('/')
    }
  
    useEffect(() => {
      setVisible(isOpen);
    }, [isOpen]);
  
    return (
        <PSidebar
        visible={isOpen}
        className="w-full bg-transparent"
        pt={{header:{
            style: {
                padding: 0
            }
        },
        content: {
            style: {
                padding: 0,
                boxShadow: 'none',
                border: 'none'
            }
        },
        root: {
            style: {
                boxShadow: 'none',
            }
        }
    }}
        position="right"
        showCloseIcon={false}
        onHide={() => toogle(false)}
        >
        <div
        className="w-full flex justify-center">
            <div className="md:w-[500px] w-full pl-20">
             <div 
            className=" flex flex-col h-screen bg-white rounded-s-md p-3 layout-border gap-2">
                <div className="w-full flex justify-end">
                    <button
                    onClick={()=>toogle(false)}
                    >
                     <span className="material-icons">close</span>
                    </button>
                </div>
                <div className="flex flex-col justify-center items-center py-3 border-b-2 gap-2 border-neutral-300">
                    <span className="material-icons text-neutral-500 text-5xl">account_circle</span>
                    <span className="text-neutral-700 font-bold">Login | Username</span>
                </div>
                <div className="flex flex-col justify-center items-center py-3  gap-2">
                    <button 
                     onClick={() => router.push('/orders')}
                    className="w-full flex items-center justify-start px-7 gap-4 border-[1px] shadow-lg p-3 rounded-md">
                        <span className="material-icons  text-neutral-500">list_alt</span>
                        <span className="text-neutral-500 font-bold">Orders</span>
                    </button>
                    <button 
                   
                    className="w-full flex items-center justify-start px-7 gap-4 border-[1px] shadow-lg p-3 rounded-md">
                        <span className="material-icons  text-neutral-500">manage_accounts</span>
                        <span className="text-neutral-500 font-bold">Account Settings</span>
                    </button>
                    <button 
                    onClick={hanldeLogout}
                    className="w-full flex items-center justify-start px-7 gap-4 border-[1px] shadow-lg p-3 rounded-md">
                        <span className="material-icons text-neutral-500">logout</span>
                        <span className="text-neutral-500 font-bold">Logout</span>
                    </button>
                </div>
            </div>
            </div>
        </div>
        </PSidebar>
    );
};

export default Sidebar;
