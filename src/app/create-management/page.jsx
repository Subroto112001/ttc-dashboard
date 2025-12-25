"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserPlus,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import Link from "next/link";
import { createManagement } from "@/helper/dataFetching";

export default function CreateManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // State for the success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await createManagement(formData);

      if (result.success) {
        // Show our custom modal instead of alert
        setShowSuccessModal(true);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong";
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }

  // Function to handle closing the modal and redirecting
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    router.push("/management");
    router.refresh();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link
        href="/management"
        className="flex items-center text-gray-500 hover:text-teal-600 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Management Team
      </Link>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        <div className="bg-teal-600 p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <UserPlus className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Add Member
              </h2>
              <p className="text-teal-100">
                Fill in the details to create a new profile.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="Rahim"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="rahim@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              />
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                type="text"
                required
                placeholder="01764298643"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              />
            </div>

            {/* Designation Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Designation
              </label>
              <input
                name="designation"
                type="text"
                required
                placeholder="manager"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              />
            </div>

            {/* Office Name Field */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Office Name
              </label>
              <input
                name="officeName"
                type="text"
                required
                placeholder="ttc-pirganj"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              />
            </div>

            {/* Image Upload Field */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Profile Photo
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
                <div className="relative flex-grow group">
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full py-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center group-hover:border-teal-400 transition-colors">
                    <span className="text-sm font-medium text-teal-600">
                      Choose Author Photo
                    </span>
                    <span className="text-xs text-gray-400">
                      JPG, PNG or WEBP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg shadow-teal-100 transition-all active:scale-[0.98] flex items-center justify-center ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Creating
                Profile...
              </>
            ) : (
              "Create Management Profile"
            )}
          </button>
        </form>
      </div>

      {/* --- SUCCESS MODAL --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>

          <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full p-10 animate-in fade-in zoom-in duration-300 text-center">
            <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-teal-600" />
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-500 mb-8 font-medium">
              Management member has been created successfully.
            </p>

            <button
              onClick={handleCloseModal}
              className="w-full py-4 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-200"
            >
              Continue to List
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
