import React from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Layout from "../Layout";
import { Link } from "react-router-dom";

function ProductTable() {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URI}/seller/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Network error");
      const data = await response.json();

      if (!data.success) throw new Error(data.message || "Failed to fetch products");

      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URI}/product/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Network error");
      const data = await response.json();

      if (!data.success) throw new Error(data.message || "Failed to delete product");

      // Remove deleted product from state
      setProducts((prevProducts) => prevProducts.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product: " + error.message);
    }
  };


  React.useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Helper to trim long text
  const truncateText = (text = "", maxLength = 40) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-semibold text-gray-100">📦 Product List</h1>

          <Link to={"/add-product"}>
            <button className="py-2 px-6 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition">
              + Add Product
            </button>
          </Link>
        </div>

        {/* Table */}
        <div className="rounded-xl shadow-md border border-gray-800 bg-gray-800 overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-300">
            <thead className="bg-gray-700 text-gray-300 uppercase text-xs font-semibold">
              <tr>
                <th className="px-5 py-3 whitespace-nowrap">Image</th>
                <th className="px-5 py-3 whitespace-nowrap">Title</th>
                <th className="px-5 py-3 whitespace-nowrap">Description</th>
                <th className="px-5 py-3 whitespace-nowrap">Category</th>
                <th className="px-5 py-3 whitespace-nowrap">Price</th>
                <th className="px-5 py-3 whitespace-nowrap">Stock</th>
                <th className="px-5 py-3 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-700/50 transition-all duration-200"
                  >
                    {/* Thumbnail */}
                    <td className="px-5 py-3">
                      <img
                        src={product.thumbnail || "/no-image.png"}
                        alt={product.title}
                        className="w-14 h-14 object-cover rounded-md border border-gray-600"
                      />
                    </td>

                    {/* Title */}
                    <td
                      className="px-5 py-3 font-medium text-gray-100 max-w-[180px] truncate"
                      title={product.title}
                    >
                      {truncateText(product.title, 40)}
                    </td>

                    {/* Description */}
                    <td
                      className="px-5 py-3 text-gray-300 max-w-[220px] truncate"
                      title={product.description}
                    >
                      {truncateText(product.description || "No description", 50)}
                    </td>

                    {/* Category */}
                    <td
                      className="px-5 py-3 text-gray-100 truncate max-w-[140px]"
                      title={product.category?.categoryName || "—"}
                    >
                      {truncateText(product.category || "—", 25)}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-3 text-orange-500 font-semibold whitespace-nowrap">
                      ₹{product.price}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-3 text-gray-50 whitespace-nowrap">
                      {product.stock}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3 flex justify-center gap-2 whitespace-nowrap">
                      <Link to={`/product/${product.slug}`} rel="noreferrer">
                        <button
                          title="View Product"
                          className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
                        >
                          <FaEye />
                        </button></Link>
                      <Link to={`/edit-product/${product._id}`} rel="noreferrer">
                        <button
                          title="Edit Product"
                          className="p-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition"
                        >
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        title="Delete Product"
                        className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default ProductTable;
