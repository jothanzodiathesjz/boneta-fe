"use client";
import { useBackRouteStore } from "@/store/BackRouteStore";
import { useRouter } from "next/navigation";
import { DomainUserWithProfile } from "@/domain/Users";
import { useAuthStore } from "@/store/AuthStore";
import { useState, useEffect } from "react";
import { getCookie, parseCookie } from "@/utils/cookies";
import { destroyCookie } from "nookies";
export default function DashboardHeader() {
  const { route } = useBackRouteStore((state) => state);
  const authStore = useAuthStore();
  const router = useRouter();
  const gcookies = getCookie("user");
  const [user, setUser] = useState<DomainUserWithProfile | null>(null);
  const logout = async () => {
    await authStore.logOut();
    destroyCookie(null, "user");
    destroyCookie(null, "accessToken");
    localStorage.removeItem("access_token");
  };

  useEffect(() => {
    setUser(parseCookie(gcookies!));
  }, []);
  return (
    <header className="fixed top-0 w-full z-50 shadow-md bg-[#Ffff] border-b flex flex-row items-center py-2 px-3 justify-between">
      <button onClick={() => router.push(route)} className="absolute left-3">
        <span className="material-icons ">keyboard_arrow_left</span>
      </button>
      <div className="w-full flex justify-center ">
        <div
          onClick={() => router.push("/")}
          className="flex flex-row items-center p-3 cursor-pointer"
        >
          <span className="material-icons text-orange-600">restaurant</span>
          <span className="text-red-700 font-bold">Boneta</span>
        </div>
      </div>
      <button
        onClick={() => logout()}
        className="absolute right-3 flex text-neutral-50 items-center gap-2"
      >
        <span>{user?.profile?.firstName ? user.profile.firstName : ""}</span>
        <span className="material-icons">logout</span>
      </button>
    </header>
  );
}
