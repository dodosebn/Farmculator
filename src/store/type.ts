export interface Sale {
  id: number;
  product: string;
  quantity: number;
  price: number;
  total: number;
  created_at: string;
}

export interface SalesStore {
  sales: Sale[];
  loading: boolean;
  fetchSales: () => Promise<void>;
  addSale: (sale: Omit<Sale, "id" | "created_at">) => Promise<void>;
  updateSale: (id: number, updates: Partial<Sale>) => Promise<void>;
  deleteSale: (id: number) => Promise<void>;
}
