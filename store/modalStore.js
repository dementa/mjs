import { create } from "zustand";

const useModalStore = create((set) => ({
    isOpen: false,
    isLoading: false,
    modalContent: null,
    openModal: (content) => set({ isOpen: true, modalContent: content}),
    closeModal: () => set({ isOpen: false, modalContent: null }),
    loadModal: (loading) => set({ isLoading: loading })
}))

export default useModalStore;