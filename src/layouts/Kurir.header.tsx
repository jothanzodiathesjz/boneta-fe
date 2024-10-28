import { useBackRouteStore } from "@/store/BackRouteStore";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
  const { route } = useBackRouteStore((state) => state);
  const router = useRouter();
  return (
    <header className="fixed top-0 w-full md:w-[500px] z-50 shadow-md bg-[#Ffff] border-b flex flex-row items-center py-3 px-3 justify-between">
      <button onClick={() => router.push(route)} className="absolute left-3">
        <span className="material-icons ">keyboard_arrow_left</span>
      </button>
      <div className="w-full flex justify-center ">
        <div className="flex flex-row items-center p-3">
          <span className="material-icons text-orange-600">restaurant</span>
          <span className="text-red-700 font-bold">Boneta</span>
        </div>
      </div>
    </header>
  );
}
