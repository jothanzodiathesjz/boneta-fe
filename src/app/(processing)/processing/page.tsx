"use client";
import { useRouter } from "next/navigation";
import { useAnimationStore } from "@/store/AnimateStore";
import { useEffect } from "react";
import { useAuthStore } from "@/store/AuthStore";
import { useState } from "react";
import { DomainUserWithProfile } from "@/domain/Users";
import { getCookie, parseCookie } from "@/utils/cookies";

export default function Chasier() {
  const route = [
    {
      name: "Chasier",
      path: "/processing/chasier",
      icon: "point_of_sale",
      roles: ["kasir"],
    },
    {
      name: "Kitchen",
      path: "/processing/kitchen",
      icon: "kitchen",
      roles: ["kitchen"],
    },
    {
      name: "Orders Report",
      path: "/processing/orders",
      icon: "list",
      roles: ["admin", "pimpinan", "kasir"],
    },
    {
      name: "Users",
      path: "/processing/users",
      icon: "person",
      roles: ["admin"],
    },
    {
      name: "Menus",
      path: "/processing/menus",
      icon: "local_dining",
      roles: ["admin"],
    },
    {
      name: "Others",
      path: "/processing/others",
      icon: "more",
      roles: ["admin"],
    },
    {
      name: "Pelayan",
      path: "/processing/pelayan",
      icon: "room_service",
      roles: ["pelayan"],
    },
    {
      name: "Kurir",
      path: "/processing/kurir",
      icon: "local_shipping",
      roles: ["kurir"],
    },
  ];
  const authStore = useAuthStore();
  const animationStore = useAnimationStore();
  const [user, setUser] = useState<DomainUserWithProfile | null>(
    parseCookie(getCookie("user")!)
  );
  const router = useRouter();
  const handleRoute = (route: string, status: boolean) => {
    animationStore.setIsOpen(status);
    console.log("cliked");
    setTimeout(() => {
      router.push(route);
    }, 500);
  };

  useEffect(() => {
    animationStore.setIsOpen(true);
    console.log(authStore.isAuthenticated, authStore.user);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between pt-20">
      <div className="w-full flex flex-row justify-center md:justify-start flex-wrap gap-5 p-5">
        {route
          .filter((item) =>
            item.roles.some((role) => user?.roles.includes(role))
          )
          .map((item, index) => (
            <div
              key={index}
              onClick={() => handleRoute(item.path, false)}
              className="bg-white cursor-pointer shadow-lg h-36 w-56 p-5 rounded-xl flex flex-col justify-center items-center hover:scale-105"
            >
              <span
                style={{ fontSize: 60 }}
                className="material-icons-outlined font-normal text-neutral-700"
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
