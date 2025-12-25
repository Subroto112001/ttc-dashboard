"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  Mail,
  Phone,
  Building2,
  Loader2,
  UserCircle,
  Trash2,
  Pencil,
  AlertTriangle,
  X,
} from "lucide-react";
import { getAllManagement, deleteManagement } from "@/helper/dataFetching";

export default function ManagementPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the custom modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await getAllManagement();
      if (response && response.success) {
        setMembers(response.data);
      } else {
        setMembers([]);
      }
    } catch (error) {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Open modal and store ID
  const openDeleteModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  // Close modal and reset
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    setIsDeleting(true);
    try {
      await deleteManagement(selectedId);
      setMembers(members.filter((member) => member._id !== selectedId));
      closeModal();
    } catch (error) {
      alert("Failed to delete member");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
        <p className="text-gray-500 font-medium">Loading Management Team...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Management Team
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Total Members:{" "}
            <span className="text-teal-600 font-bold">{members.length}</span>
          </p>
        </div>
        <Link
          href="/create-management"
          className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 group"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add New Member
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {members.map((member) => (
          <div
            key={member._id}
            className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col relative"
          >
            <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-teal-50">
                  <UserCircle className="w-20 h-20 text-teal-200" />
                </div>
              )}

              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link
                  href={`/update-management/${member._id}`}
                  className="p-2 bg-white/90 backdrop-blur rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => openDeleteModal(member._id)}
                  className="p-2 bg-white/90 backdrop-blur rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-lg text-teal-700 text-xs font-bold uppercase tracking-wider">
                  {member.designation}
                </span>
              </div>
            </div>

            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-extrabold text-gray-900">
                {member.name}
              </h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-3 text-gray-400" />
                  <span>{member.phoneNumber}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="uppercase text-xs font-medium">
                    {member.officeName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- CUSTOM DELETE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          {/* Modal Card */}
          <div className="relative bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 animate-in fade-in zoom-in duration-200">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-2">
                Are you sure?
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                This action cannot be undone. This will permanently remove the
                member from the management records.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={closeModal}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
