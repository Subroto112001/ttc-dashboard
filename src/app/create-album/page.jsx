"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAlbum } from "@/helper/dataFetching";


export default function CreateAlbumForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Matches the keys in your Postman screenshot: title, description, coverImage
    const result = await createAlbum(formData);

    if (result.success) {
      alert("Album created successfully!");
      router.refresh(); // Refresh server data
      router.push("/albums"); // Redirect to dashboard
    } else {
      alert(`Error: ${result.error}`);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border">
      <h2 className="text-2xl font-bold mb-6">Create New Album</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Album Title
          </label>
          <input
            name="title"
            type="text"
            required
            className="mt-1 block w-full border rounded-md p-2"
            placeholder="e.g., My family"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            required
            className="mt-1 block w-full border rounded-md p-2"
            placeholder="Best memories from 2024."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cover Image
          </label>
          <input
            name="coverImage"
            type="file"
            accept="image/*"
            required
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Album"}
        </button>
      </form>
    </div>
  );
}
