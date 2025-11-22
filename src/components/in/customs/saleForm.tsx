import React from "react";

export interface SaleFormData {
  product: string;
  quantity: number | string; 
  price: number | string;
}

interface SaleFormProps {
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

const SaleForm: React.FC<SaleFormProps> = ({
  editingId,
  handleSubmit,
  handleChange,
  formData,
  isSubmitting,
  cancelEdit,
  handleShare
}) => {
  return (
          <div className="bg-white p-6 border border-gray-300">
                 <div className="flex justify-between">

            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {editingId ? "Edit Sale" : "Add New Sale"}
            </h2>
            <div className="cursor-pointer">
                <button
                  onClick={handleShare}
                  className="bg-green-500 px-4 py-1 text-white
                  rounded-full hover:bg-green-600 transition-colors cursor-pointer"
                >
                  Share
                </button>
                </div>
              </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  placeholder="e.g., Organic Wheat"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {formData.quantity && formData.price && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 font-medium">
                    Total: ₦
                    {(
                      Number(formData.quantity) * Number(formData.price)
                    ).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !formData.product ||
                    !formData.quantity ||
                    !formData.price
                  }
                  className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  {isSubmitting
                    ? editingId
                      ? "Updating..."
                      : "Adding..."
                    : editingId
                      ? "Update Sale"
                      : "Add Sale"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
 )
}

export default SaleForm;