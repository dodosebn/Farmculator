import { create } from "zustand";
import { supabase } from "@/store/supabase";
import { SalesStore } from "./type";
export const useSalesStore = create<SalesStore>((set, get) => ({
  sales: [],
  loading: false,
  fetchSales: async () => {
    set({ loading: true });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.warn("No user logged in");
        set({ sales: [] });
        return;
      }
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

  addSale: async (sale) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const res = await fetch("/api/sales/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sale,
          user_id: user.id,
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
