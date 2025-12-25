"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { getSingleManagement, updateManagement } from "@/helper/dataFetching";

export default function EditManagementPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [member, setMember] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load existing data
  useEffect(() => {
    async function loadMember() {
      const response = await getSingleManagement(id);
      if (response && response.success) {
        setMember(response.data);
        setImagePreview(response.data.image);
      }
      setLoading(false);
    }
    loadMember();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setUpdating(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await updateManagement(id, formData);
      if (result.success) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || "Update failed"}`);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-teal-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link
        href="/management"
        className="flex items-center text-gray-500 hover:text-teal-600 mb-8 group transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Management List
      </Link>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        <div className="bg-teal-600 p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Save className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Edit Member
              </h2>
              <p className="text-teal-100 italic">Updating: {member?.name}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                defaultValue={member?.name}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                defaultValue={member?.email}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                type="text"
                required
                defaultValue={member?.phoneNumber}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Designation
              </label>
              <input
                name="designation"
                type="text"
                required
                defaultValue={member?.designation}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Office Name
              </label>
              <input
                name="officeName"
                type="text"
                required
                defaultValue={member?.officeName}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Profile Photo (Optional)
              </label>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="relative flex-grow">
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full py-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center group-hover:border-teal-400 transition-colors">
                    <span className="text-sm font-medium text-teal-600">
                      Change Photo
                    </span>
                    <span className="text-xs text-gray-400">
                      Leave empty to keep current
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg shadow-teal-100 transition-all active:scale-[0.98] flex items-center justify-center ${
              updating ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {updating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Saving
                Changes...
              </>
            ) : (
              "Update Management Profile"
            )}
          </button>
        </form>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => router.push("/management")}
          ></div>
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full p-10 animate-in fade-in zoom-in duration-300 text-center">
            <CheckCircle2 className="w-16 h-16 text-teal-600 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-900 mb-2">Updated!</h2>
            <p className="text-gray-500 mb-8 font-medium">
              Profile information has been updated successfully.
            </p>
            <button
              onClick={() => {
                router.push("/management");
                router.refresh();
              }}
              className="w-full py-4 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 shadow-lg"
            >
              Back to List
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
