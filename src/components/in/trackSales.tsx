import { useState, ChangeEvent, FormEvent } from "react";

interface Sale {
  id: number;
  product: string;
  quantity: number;
  price: number;
  total: number;
}

interface FormData {
  product: string;
  quantity: string;
  price: string;
}

const TrackSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [formData, setFormData] = useState<FormData>({
    product: "",
    quantity: "",
    price: "",
  });

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.product || !formData.quantity || !formData.price) return;

    const newSale: Sale = {
      id: Date.now(),
      product: formData.product,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      total: Number(formData.quantity) * Number(formData.price),
    };

    setSales([newSale, ...sales]);
    setFormData({ product: "", quantity: "", price: "" });
  };

  // Calculate total revenue
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="p-4 rounded-2xl shadow-md bg-white max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">🌾 Track Sales</h2>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="product"
          placeholder="Product Name"
          value={formData.product}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity Sold"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          type="number"
          name="price"
          placeholder="Price per Unit (₦)"
          value={formData.price}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Add Sale
        </button>
      </form>

      {/* Summary */}
      <div className="mt-4 text-center">
        <p className="font-semibold">
          Total Revenue: ₦{totalRevenue.toLocaleString()}
        </p>
      </div>

      {/* Sales List */}
      {sales.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Sales Records</h3>
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-1">Product</th>
                <th className="border p-1">Qty</th>
                <th className="border p-1">Price</th>
                <th className="border p-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td className="border p-1">{sale.product}</td>
                  <td className="border p-1">{sale.quantity}</td>
                  <td className="border p-1">₦{sale.price}</td>
                  <td className="border p-1">₦{sale.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrackSales;
