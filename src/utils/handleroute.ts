import { useRouter,useSearchParams } from "next/navigation";
import { useAnimationStore } from "@/store/AnimateStore";


export const useRouteAnimation = () => { 
    const router = useRouter();
    const animationStore = useAnimationStore()

    const handleRoute =(route:string) => {
        animationStore.setIsOpen(false)
        // console.log('cliked')
        setTimeout(() => {
          router.push(route)
        },300)
        
    }

    return {
        handleRoute
    }
}