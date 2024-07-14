import {create} from 'zustand'

export type BackRouteStore = {
    route:string;
}

export type BackRouteStoreActions = {
    setBackRoute: (v: string) => void
}

export const useBackRouteStore = create<BackRouteStore & BackRouteStoreActions>((set) => ({
    route: '/processing',
    setBackRoute: (v) => set({route: v})
}))


