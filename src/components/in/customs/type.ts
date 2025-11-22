export const timeStamps = [
  {
    name: "1 day",
    value: "1",
  },
  {
    name: "7 days",
    value: "7",
  },
  {
    name: "30 days",
    value: "30",
  },
  {
    name: "Never",
    value: "never",
  },
];
export interface ShareSettings {
  includeCharts: boolean;
  includeAI: boolean;
  readOnly: boolean;
  expiresIn: string;
}

export interface ShareLinkProps {
  showShareModal: boolean;
  setShowShareModal: (value: boolean) => void;
  shareSettings: ShareSettings;
  handleShareSettingsChange: (
    key: keyof ShareSettings,
    value: boolean | string
  ) => void;
  shareLink: string;
  handleCopyLink: () => void;
  isCopied: boolean;
  shareViaWhatsApp: () => void;
}
export interface DemLinksProps {
      handleCopyLink: () => void;
  isCopied: boolean;
  shareViaWhatsApp: () => void;
    shareLink: string;

}
export interface SaleFormData {
  product: string;
  quantity: number | string; 
  price: number | string;
}

export interface SaleFormProps {
  editingId: number | null;
  formData: SaleFormData;

  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  isSubmitting: boolean;
  handleShare: () => void;
  cancelEdit: () => void;
}
export interface Sale {
id: number;
product: string;
quantity: number;
price: number;
total: number;
created_at?: string;
}

export interface ProductRevenue {
product: string;
revenue: number;
}

export interface SalesTableProps {
loading: boolean;
sales: Sale[];
activeTab: "list" | "charts" | "ai";

productRevenueData: ProductRevenue[];

COLORS: string[];

aiSummary: string | null;

generateAISummary: () => Promise<void>;
isGeneratingSummary: boolean;

handleEditSale: (sale: Sale) => void;
handleDeleteSale: (id: number) => void;
}
