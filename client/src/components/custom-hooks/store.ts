import { create } from "zustand";

export const useLoadingStore = create((set) => ({
        isLoading: true,
        setIsLoading: (isLoading: boolean) => set({ isLoading }),
    }));
