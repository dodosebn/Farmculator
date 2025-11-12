import { create } from "zustand";

export interface Sale {
  id: number;
  product: string;
  quantity: number;
  price: number;
  total: number;
  created_at: string;
}

interface SalesStore {
  sales: Sale[];
  loading: boolean;
  fetchSales: () => Promise<void>;
  addSale: (sale: Omit<Sale, "id" | "created_at">) => Promise<void>;
  updateSale: (id: number, updates: Partial<Sale>) => Promise<void>;
  deleteSale: (id: number) => Promise<void>;
}

export const useSalesStore = create<SalesStore>((set, get) => ({
  sales: [],
  loading: false,

  fetchSales: async () => {
    set({ loading: true });
    const res = await fetch("/api/sales/fetch");
    const data = await res.json();
    if (!data.error) set({ sales: data.sales });
    set({ loading: false });
  },

  addSale: async (sale) => {
    const res = await fetch("/api/sales/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sale),
    });
    const data = await res.json();
    if (!data.error) set({ sales: [data.sale, ...get().sales] });
  },

  updateSale: async (id, updates) => {
    const res = await fetch("/api/sales/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates }),
    });
    const data = await res.json();
    if (!data.error) {
      set({ sales: get().sales.map((s) => (s.id === id ? data.sale : s)) });
    }
  },

  deleteSale: async (id) => {
    const res = await fetch("/api/sales/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!data.error) set({ sales: get().sales.filter((s) => s.id !== id) });
  },
}));
