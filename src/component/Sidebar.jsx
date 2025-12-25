"use client";

import { Bell, BookImage, LayoutDashboard, Settings, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Sidebar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setHasToken(false);
        setLoading(false);
        return;
      }

      setHasToken(true);

      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/auth/getme",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        } else {
          localStorage.removeItem("token");
          setHasToken(false);
        }
      } catch (err) {
        console.error("Sidebar Auth Error:", err);
        setHasToken(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
    setUser(null);
    setHasToken(false);
  };

  if (!hasToken && !loading) return null;

  if (loading) {
    return (
      <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-500 font-medium">Loading...</span>
        </div>
      </aside>
    );
  }

  if (!user) return null;

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard />,
    },
    {
      id: "albums",
      name: "Albums",
      path: "/albums",
      icon: <BookImage />,
    },
    {
      id: "notice",
      name: "Notice",
      path: "/notice",
      icon: <Bell />,
    },
    {
      id: "management",
      name: "Management",
      path: "/management",
      icon: <Users />,
    },

    {
      id: "settings",
      name: "Settings",
      path: "/settings",
      icon: <Settings />,
    },
  ];

  const handleGotoPage = (path, id) => {
    setActiveMenu(id);
    router.push(path);
  };

  return (
    <div className="min-h-screen">
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
        shadow-sm lg:shadow-none transition-transform duration-300 ease-in-out
        flex flex-col
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z" />
            </svg>
          </div>
          <span className="font-bold text-sm text-gray-900">PKTC Portal</span>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-white">
              <span className="text-blue-600 font-bold text-sm">
                {(user.firstName || "U").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.firstName || "User"}
              </p>
              <p className="text-xs text-gray-600 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleGotoPage(item.path, item.id)}
              className={`w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all
              ${
                activeMenu === item.id
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
             <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        {/* Logout (FIXED) */}
        <div className="mt-auto p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium
            text-red-600 hover:bg-red-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </div>
  );
};

export default Sidebar;
