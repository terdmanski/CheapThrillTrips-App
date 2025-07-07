// lib/stores/useAgreementsStore.ts

import { create } from 'zustand';

type Agreement = {
  checked: boolean;
  expanded: boolean;
};

type Store = {
  agreements: Agreement[];
  toggleCheck: (index: number) => void;
  toggleExpand: (index: number) => void;
  setAgreements: (agreements: Agreement[]) => void;
};

export const useAgreementsStore = create<Store>((set) => ({
  agreements: [
    { checked: false, expanded: false },
    { checked: false, expanded: false },
    { checked: false, expanded: false },
  ],
  toggleCheck: (index) =>
    set((state) => {
      const updated = [...state.agreements];
      updated[index].checked = !updated[index].checked;
      return { agreements: updated };
    }),
  toggleExpand: (index) =>
    set((state) => {
      const updated = [...state.agreements];
      updated[index].expanded = !updated[index].expanded;
      return { agreements: updated };
    }),
  setAgreements: (agreements) => set({ agreements }),
}));
