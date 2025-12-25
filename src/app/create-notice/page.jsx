"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileUp } from "lucide-react";
import Link from "next/link";
import { createNotice, getAllNoticeCategories } from "@/helper/dataFetching";

export default function CreateNoticePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State for categories dropdown
  const [categories, setCategories] = useState([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  // Load categories on component mount
 
  useEffect(() => {
    async function fetchCategories() {
      try {
        const result = await getAllNoticeCategories();

        // LOG THIS to see exactly what your backend sends:
        console.log("Category API Result:", result);

        // This logic checks where the array is located
        let finalData = [];
        if (Array.isArray(result)) {
          finalData = result;
        } else if (result && Array.isArray(result.data)) {
          finalData = result.data;
        } else if (result && Array.isArray(result.categories)) {
          finalData = result.categories;
        }

        setCategories(finalData);
      } catch (error) {
        console.error("Failed to load categories", error);
        setCategories([]); // Fallback to empty array
      } finally {
        setFetchingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await createNotice(formData);

      // result logic based on your axios helper returning response.data
      if (result) {
        alert("Notice created successfully!");
        router.push("/notice");
        router.refresh();
      }
    } catch (error) {
      alert(
        `Error: ${error.response?.data?.message || "Something went wrong"}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        href="/notices"
        className="flex items-center text-gray-500 hover:text-black mb-8 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to All Notices
      </Link>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-indigo-500/5 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Create Notice
          </h2>
          <p className="text-indigo-100 mt-2">
            Publish a new official announcement.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Notice Title
            </label>
            <input
              name="title"
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g., Dhaka Metro Update"
            />
          </div>

          {/* Category Dropdown Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Select Category
            </label>
            <select
              name="category"
              required
              disabled={fetchingCategories}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">
                {fetchingCategories
                  ? "Loading categories..."
                  : "Choose a category"}
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Details about the notice..."
            />
          </div>

          {/* PDF Upload Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Attachment (PDF)
            </label>
            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-indigo-400 transition-colors group">
              <input
                name="pdfUrl"
                type="file"
                accept=".pdf"
                required
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center justify-center space-x-3 text-gray-500 group-hover:text-indigo-600 transition-colors">
                <FileUp className="w-6 h-6" />
                <span className="font-medium">Click to upload or drag PDF</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || fetchingCategories}
            className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all active:scale-95 ${
              loading || fetchingCategories
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Publishing...
              </span>
            ) : (
              "Post Notice"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
