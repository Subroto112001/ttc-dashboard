"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, FileUp, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  getSingleNotice,
  updateNotice,
  getAllNoticeCategories,
} from "@/helper/dataFetching";

export default function EditNoticePage() {
  const router = useRouter();
  const { id } = useParams(); // URL parameter for notice ID

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);
  const [categories, setCategories] = useState([]);

  // Load notice data and categories simultaneously
useEffect(() => {
  async function loadData() {
    try {
      const [noticeRes, categoryRes] = await Promise.all([
        getSingleNotice(id),
        getAllNoticeCategories(),
      ]);

      setNotice(noticeRes?.data || noticeRes);

      // LOG THE DATA to see the structure in the console
      console.log("Category Response:", categoryRes);

      // SAFE EXTRACTION: Check where the array is located
      let finalCategories = [];
      if (Array.isArray(categoryRes)) {
        finalCategories = categoryRes;
      } else if (categoryRes?.data && Array.isArray(categoryRes.data)) {
        finalCategories = categoryRes.data;
      } else if (
        categoryRes?.categories &&
        Array.isArray(categoryRes.categories)
      ) {
        finalCategories = categoryRes.categories;
      }

      setCategories(finalCategories);
    } catch (error) {
      console.error("Error loading edit data:", error);
      setCategories([]); // Fallback to empty array on error
    } finally {
      setLoading(false);
    }
  }
  loadData();
}, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await updateNotice(id, formData);
      if (result) {
        alert("Notice updated successfully!");
        router.push("/notice");
        router.refresh();
      }
    } catch (error) {
      alert(
        `Error: ${error.response?.data?.message || "Failed to update notice"}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
        <p className="text-gray-500">Loading notice details...</p>
      </div>
    );
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

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Edit Notice
          </h2>
          <p className="text-indigo-100 mt-2">
            Modify the details for this announcement.
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
              defaultValue={notice?.title}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Category Dropdown - Sets previous category */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Category
            </label>
            <select
              name="category"
              required
              // notice.category?._id handles the previous selection
              defaultValue={notice?.category?._id || notice?.category}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all"
            >
              <option value="">Select Category</option>
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
              defaultValue={notice?.description}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
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
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center justify-center space-x-3 text-gray-500 group-hover:text-indigo-600 transition-colors">
                <FileUp className="w-6 h-6" />
                <span className="font-medium">Update PDF (Optional)</span>
              </div>
            </div>
            {notice?.pdfUrl && (
              <p className="mt-2 text-xs text-gray-400 italic">
                Currently: {notice.pdfUrl.split("/").pop()}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all active:scale-95 ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
            }`}
          >
            {submitting ? "Saving Changes..." : "Update Notice"}
          </button>
        </form>
      </div>
    </div>
  );
}
