import { create } from "zustand";

export type AnimateStore = {
  isOpen: boolean;
};

export type AnimateStoreActions = {
  setIsOpen: (v: boolean) => void;
};

export const useAnimationStore = create<AnimateStore & AnimateStoreActions>(
  (set) => ({
    isOpen: false,
    setIsOpen: (v) => set({ isOpen: v }),
  }),
);
