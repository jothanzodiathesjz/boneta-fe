'use client';
import { useRouter } from "next/navigation";
import { useAnimationStore } from "@/store/AnimateStore";
import { useEffect } from "react";
import { useAuthStore } from "@/store/AuthStore";

export default function Chasier() {
  const route = [
    {
    name: "Chasier",
    path: "/processing/chasier",
    icon: "point_of_sale",
  },
  {
    name: "Kitchen",
    path: "/processing/kitchen",
    icon: "kitchen",
  },
  {
    name: "Order List",
    path: "/processing/orders",
    icon: "list",
  },
  {
    name: "Users",
    path: "/processing/users",
    icon: "person",
  },
  {
    name: "Menus",
    path: "/processing/menus",
    icon: "menu",
  },
  {
    name: "Others",
    path: "/processing/others",
    icon: "more",
  },
  {
    name: "Stok",
    path: "/processing/stok",
    icon: "inventory_2",
  }
];
const authStore = useAuthStore();
const animationStore = useAnimationStore();
const router = useRouter();
const handleRoute = (route: string,status:boolean) => {
  animationStore.setIsOpen(status)
  console.log('cliked')
  setTimeout(() => {
    router.push(route)
    },500)
}

useEffect(() => {
  animationStore.setIsOpen(true)
  console.log(authStore.isAuthenticated,authStore.user)
},[])

  return (
    <div className="flex min-h-screen flex-col items-center justify-between pt-20">
      <div className="w-full flex flex-row flex-wrap gap-5 p-5">
        {
          route.map((item, index) => (
              <div 
              key={index}
              onClick={() => handleRoute(item.path,false)}
              className="bg-white cursor-pointer shadow-lg h-36 w-56 p-5 rounded-xl flex flex-col justify-center items-center hover:scale-105">
              <span style={{fontSize: 60}} className="material-icons-outlined font-normal text-neutral-700">{item.icon}</span>
              <span>{item.name}</span>
              </div>
          ))
          }
      </div>
    </div>
  );
}
