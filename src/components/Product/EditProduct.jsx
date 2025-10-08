import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [categories, setCategories] = useState([]);

  const [product, setProduct] = useState({
    title: "",
    description: "",
    thumbnail: "",
    images: [],
    price: "",
    discount: 0,
    stock: "",
    status: "in stock",
    category: "",
    isPublished: true,
  });

  const [imageUrl, setImageUrl] = useState("");

  // 🟠 Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URI}/seller/categories`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  // 🟢 Fetch Product Data
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URI}/product-id/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProduct({
          title: data.product.title || "",
          description: data.product.description || "",
          thumbnail: data.product.thumbnail || "",
          images: data.product.images || [],
          price: data.product.price || "",
          discount: data.product.discount || 0,
          stock: data.product.stock || "",
          status: data.product.status || "in stock",
          category: data.product.category || "",
          isPublished: data.product.isPublished || false,
        });
      } else {
        toast.error(data.message || "Failed to fetch product");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Error fetching product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // 🟣 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🟡 Add / Remove Images
  const addImageHandler = () => {
    if (!imageUrl) return toast.warn("Please add image URL first");
    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, { url: imageUrl, altText: product.title || "Product Image" }],
    }));
    setImageUrl("");
  };

  const removeImageHandler = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // 🟢 Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URI}/product/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(product),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("✅ Product updated successfully!");
        navigate("/products");
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Something went wrong while updating");
    } finally {
      setUpdating(false);
    }
  };

  // 🌀 Loading State
  if (loading)
    return (
      <Layout>
        <div className="text-center p-6 text-gray-300">Loading product...</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="p-6 bg-gray-900 min-h-screen">
        <h1 className="text-2xl font-semibold text-gray-100 mb-4 text-center">
          ✏️ Edit Product
        </h1>

        <form
          className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4"
          onSubmit={handleSubmit}
        >
          {/* Title */}
          <div>
            <label className="text-gray-300 mb-2 block">Product Title</label>
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-200"
              placeholder="Enter product title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-300 mb-2 block">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-200"
              placeholder="Enter product description"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="text-gray-300 mb-2 block">Thumbnail URL</label>
            <input
              type="text"
              name="thumbnail"
              value={product.thumbnail}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-200"
              placeholder="Enter thumbnail URL"
            />
            {product.thumbnail && (
              <img
                src={product.thumbnail}
                alt="Thumbnail Preview"
                className="w-24 h-24 mt-2 object-cover rounded-md border border-gray-600"
              />
            )}
          </div>

          {/* Images */}
          <div>
            <label className="text-gray-300 mb-2 block">Product Images</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL"
                className="flex-1 p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-200"
              />
              <button
                type="button"
                onClick={addImageHandler}
                className="px-4 py-2 bg-blue-600 rounded-md"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.images?.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img.url}
                    alt={img.altText}
                    className="w-20 h-20 object-cover rounded-md border border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageHandler(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Price, Discount, Stock */}
          <div className="flex gap-2">
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Price"
              className="flex-1 p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-200"
            />
            <input
              type="number"
              name="discount"
              value={product.discount}
              onChange={handleChange}
              placeholder="Discount (%)"
              className="flex-1 p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-200"
            />
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="flex-1 p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-200"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-gray-300 mb-2 block">Status</label>
            <select
              name="status"
              value={product.status}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-200"
            >
              <option value="in stock">In Stock</option>
              <option value="out of stock">Out of Stock</option>
              <option value="limited stock">Limited Stock</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="text-gray-300 mb-2 block">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-200"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Publish Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={product.isPublished}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  isPublished: e.target.checked,
                }))
              }
              className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
            />
            <label className="text-gray-300">Published</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={updating}
            className="w-full bg-green-600 py-3 rounded-md text-white font-semibold hover:bg-green-700"
          >
            {updating ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditProduct;
