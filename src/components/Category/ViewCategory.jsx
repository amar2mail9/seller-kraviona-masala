import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Layout from "../Layout";
import { Link } from "react-router-dom";

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URI}/seller/categories`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        }   
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      console.log(data);
      
      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URI}/category/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        }
      });
      if (!res.ok) throw new Error("Failed to delete category");
      const data = await res.json();
      console.log(data);
      // Refresh categories after deletion
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Layout>
      <div className="p-6 bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-100">📁 Categories</h1>
          <Link to={'/add-category'}>
          <button className="py-2 px-6 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition">
            Add Category
          </button>
          </Link>
          
        </div>

        {/* Category Table */}
        <div className="overflow-x-auto rounded-xl shadow-md border border-gray-800 bg-gray-800">
          <table className="min-w-full text-left text-gray-300 text-sm">
            <thead className="bg-gray-700 uppercase text-xs font-semibold text-gray-300">
              <tr>
                <th className="px-5 py-3">Image</th>
                <th className="px-5 py-3">Category Name</th>
                <th className="px-5 py-3">Published</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <td className="px-5 py-3">
                      <img
                        src={category.image || "https://via.placeholder.com/60"}
                        alt={category.categoryName}
                        className="w-16 h-16 object-cover rounded-md border border-gray-600"
                      />
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-100">
                      {category.categoryName}
                    </td>
                  
                    <td className="px-5 py-3">
                      {category.isPublished ? (
                        <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-600 text-white rounded-full text-xs">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 flex justify-center gap-3">
                      <button
                        title="View Category"
                        className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
                      >
                        <FaEye />
                      </button>
                      <button
                        title="Edit Category"
                        className="p-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteCategory(category._id)}
                        title="Delete Category"
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
};

export default ViewCategory;
