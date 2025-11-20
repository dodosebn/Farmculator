import { create } from "zustand";
import { supabase } from "@/store/supabase";

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

  // -------------------------------------------------
  // FETCH ONLY LOGGED-IN USER'S SALES
  // -------------------------------------------------
  fetchSales: async () => {
    set({ loading: true });
    try {
      // 1️⃣ Get logged in user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.warn("No user logged in");
        set({ sales: [] });
        return;
      }

      // 2️⃣ Fetch ONLY this user’s sales
      const res = await fetch(`/api/sales/fetch?user_id=${user.id}`);
      const data = await res.json();

      if (data.success) {
        set({ sales: data.sales || [] });
      } else {
        console.error("Failed to fetch sales:", data.message);
        set({ sales: [] });
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      set({ sales: [] });
    } finally {
      set({ loading: false });
    }
  },

  // -------------------------------------------------
  // ADD SALE (must include user_id)
  // -------------------------------------------------
  addSale: async (sale) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const res = await fetch("/api/sales/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sale,
          user_id: user.id, // ← IMPORTANT
        }),
      });

      const data = await res.json();

      if (data.success) {
        set({ sales: [data.sale, ...get().sales] });
      } else {
        throw new Error(data.message || "Failed to add sale");
      }
    } catch (error) {
      console.error("Error adding sale:", error);
      throw error;
    }
  },

  // -------------------------------------------------
  // UPDATE SALE
  // -------------------------------------------------
  updateSale: async (id, updates) => {
    try {
      const res = await fetch("/api/sales/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updates }),
      });

      const data = await res.json();

      if (data.success) {
        set({
          sales: get().sales.map((s) => (s.id === id ? data.sale : s)),
        });
      } else {
        throw new Error(data.message || "Failed to update sale");
      }
    } catch (error) {
      console.error("Error updating sale:", error);
      throw error;
    }
  },

  // -------------------------------------------------
  // DELETE SALE
  // -------------------------------------------------
  deleteSale: async (id) => {
    try {
      const res = await fetch("/api/sales/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        set({
          sales: get().sales.filter((s) => s.id !== id),
        });
      } else {
        throw new Error(data.message || "Failed to delete sale");
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
      throw error;
    }
  },
}));
