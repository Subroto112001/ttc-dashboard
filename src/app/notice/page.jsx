"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Download,
  ExternalLink,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getAllnotice, deleteNotice } from "@/helper/dataFetching";

export default function AllNoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 5;

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const result = await getAllnotice();

      // If your API wraps the array in a 'data' property: { success: true, data: [] }
      // If it returns the array directly: [...]
      const noticeData = result?.data || result || [];
      setNotices(noticeData);
    } catch (error) {
      console.error("Error in fetchNotices component:", error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

const handleDelete = async (id) => {
  // 1. Confirmation Dialog
  if (!confirm("Are you sure you want to delete this notice?")) return;

  try {
    // 2. Call the API helper
    await deleteNotice(id);

    // 3. Optimistic UI update: Remove the deleted notice from the local state
    setNotices((prevNotices) => prevNotices.filter((n) => n._id !== id));

    // 4. Success feedback
    alert("Notice deleted successfully");
  } catch (error) {
    // 5. Error feedback
    const errorMessage =
      error.response?.data?.message || "Failed to delete notice";
    alert(errorMessage);
  }
};

  // Pagination Calculations
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = Array.isArray(notices)
    ? notices.slice(indexOfFirstNotice, indexOfLastNotice)
    : [];
  const totalPages = Math.ceil(notices.length / noticesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-gray-500 animate-pulse">Loading notices...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-10">
        <Link
          href="/dashboard"
          className="flex items-center text-gray-500 hover:text-black transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <Link
          href="/create-notice"
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Notice
        </Link>
      </div>

      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Notice Board
        </h1>
        <p className="text-lg text-gray-500">
          Manage and monitor all official announcements.
        </p>
      </header>

      {/* Notices List */}
      <div className="grid gap-6">
        {currentNotices.length > 0 ? (
          currentNotices.map((notice) => (
            <div
              key={notice?._id}
              className="group bg-white border border-gray-200 p-6 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all relative"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  {notice.category?.name && (
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 mb-3">
                      {notice.category.name}
                    </span>
                  )}

                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {notice.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {notice.createdAt
                        ? new Date(notice.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </span>
                    {notice.postedBy && (
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1.5" />
                        {notice.postedBy.firstName} {notice.postedBy.lastName}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {notice.description}
                  </p>

                  {notice.pdfUrl && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      <a
                        href={notice.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-700 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-700 transition-colors border border-gray-100"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View PDF
                      </a>
                      <a
                        href={notice.pdfDownloadUrl || notice.pdfUrl}
                        download
                        className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-700 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-700 transition-colors border border-gray-100"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                  <Link
                    href={`/update-notice/${notice._id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    title="Edit Notice"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(notice._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No notices yet
            </h3>
            <Link
              href="/create-notice"
              className="inline-flex items-center text-indigo-600 font-semibold hover:underline mt-4"
            >
              <Plus className="w-4 h-4 mr-1" /> Create your first notice
            </Link>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {notices.length > noticesPerPage && (
        <div className="flex items-center justify-center mt-12 space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 border border-transparent"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
