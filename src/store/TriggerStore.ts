import { create } from "zustand";

export type CountStore = {
  count: number;
};

export type CountStoreActions = {
  setCount: (v: number) => void;
};

export const useCountStore = create<CountStore & CountStoreActions>((set) => ({
  count: 0,
  setCount: (v) => set({ count: v }),
}));
