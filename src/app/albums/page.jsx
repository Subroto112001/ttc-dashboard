"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trash2,
  Edit,
  AlertCircle,
  Plus,
  LayoutGrid,
  Calendar,
  ImageIcon,
} from "lucide-react";
import { deleteAlbum, getAllAlbums } from "@/helper/dataFetching"; // Ensure this matches your file structure

export default function AlbumsDashboard() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, album: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

const fetchAlbums = async () => {
  try {
    // result is now the actual JSON object returned from the helper
    const result = await getAllAlbums();

    // Check if result.data exists (based on your API structure)
    setAlbums(result?.data || []);
  } catch (error) {
    console.error("Error fetching albums:", error);
  } finally {
    setLoading(false);
  }
};

  const handleDeleteClick = (album) => {
    setDeleteModal({ show: true, album });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.album) return;
    setDeleting(true);

    const result = await deleteAlbum(deleteModal.album._id);

    if (result.success) {
      setAlbums((prev) => prev.filter((a) => a._id !== deleteModal.album._id));
      setDeleteModal({ show: false, album: null });
    } else {
      alert(result.error || "Failed to delete album");
    }
    setDeleting(false);
  };

  // Get the 3 most recent albums for the hero section
  const latestAlbums = [...albums]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading your memories...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
      {/* --- HEADER SECTION --- */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider text-sm">
            <ImageIcon className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Gallery Manager
          </h1>
          <p className="text-gray-500 max-w-md">
            Create, update, and manage your family photo albums and digital
            memories.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/create-album"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Create Album
          </Link>
        </div>
      </header>

      {/* --- LATEST MEMORIES SECTION --- */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800">
              Recent Collections
            </h2>
          </div>
          <Link
            href="/albums"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            View All {albums.length} Albums
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestAlbums.length > 0 ? (
            latestAlbums.map((album) => (
              <AlbumCard
                key={album._id}
                album={album}
                isLatest={true}
                onDelete={() => handleDeleteClick(album)}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
              <p className="text-gray-400 text-lg">
                Your gallery is empty. Start by creating an album!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Confirm Delete
                </h3>
                <p className="text-sm text-gray-500">
                  This action is permanent
                </p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-900">
                "{deleteModal.album?.title}"
              </span>
              ? This will remove the album and its cover photo from the cloud
              storage forever.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, album: null })}
                disabled={deleting}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Delete Now"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AlbumCard({ album, isLatest, onDelete }) {
  const dateDisplay = new Date(album.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Handle cover image whether it's an object or a string
  const imageUrl =
    album.coverImage?.url || album.coverImage || "/placeholder-image.jpg";

  return (
    <div className="group relative bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={imageUrl}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
          <p className="text-white text-xs font-medium truncate">
            {album.title}
          </p>
        </div>

        {/* Floating Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <Link
            href={`/update-album/${album._id}`}
            className="p-3 bg-white/90 backdrop-blur-md shadow-lg rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
            title="Edit Album"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={onDelete}
            className="p-3 bg-white/90 backdrop-blur-md shadow-lg rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
            title="Delete Album"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {isLatest && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            New
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {album.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed h-10">
          {album.description || "No description provided for this album."}
        </p>

        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center text-xs font-medium text-gray-400 gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {dateDisplay}
          </div>
          <Link
            href={`/albums/${album._id}`}
            className="text-xs font-bold text-gray-900 hover:text-blue-600 flex items-center gap-1"
          >
            View Album
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
