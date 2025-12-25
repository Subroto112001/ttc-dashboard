"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAlbumById, updateAlbum } from "@/helper/dataFetching"; // Adjust paths
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";

export default function UpdateAlbumPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Step 1: Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      const result = await getAlbumById(id);
      if (result.success) {
        setFormData({
          title: result.data.title,
          description: result.data.description,
        });
        setPreview(result.data.coverImage?.url || result.data.coverImage);
      } else {
        alert("Failed to load album data");
      }
      setFetching(false);
    };
    if (id) loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (selectedFile) data.append("image", selectedFile);

    const result = await updateAlbum(id, data);

    if (result.success) {
      alert("Album updated successfully!");
      router.push("/"); // Back to dashboard
      router.refresh();
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  if (fetching) return <div className="p-10 text-center">Loading Album...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link
        href="/"
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Edit Album Details
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Album Title
            </label>
            <input
              type="text"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700 block">
              Cover Image
            </label>
            <div className="flex items-center gap-6 p-4 border-2 border-dashed border-gray-200 rounded-2xl">
              {preview && (
                <img
                  src={preview}
                  className="w-32 h-32 object-cover rounded-xl shadow-md"
                  alt="Preview"
                />
              )}
              <div className="flex-1">
                <label className="cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 w-fit">
                  <Upload className="w-4 h-4" />
                  Change Photo
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setSelectedFile(file);
                      setPreview(URL.createObjectURL(file));
                    }}
                  />
                </label>
                <p className="text-xs text-gray-400 mt-2">
                  Recommended: 16:9 ratio, Max 5MB
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Saving Changes..." : "Update Album"}
          </button>
        </form>
      </div>
    </div>
  );
}
