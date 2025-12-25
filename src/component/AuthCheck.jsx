"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthCheck({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const isPublicPath = pathname === "/login";

      if (!token && !isPublicPath) {
        // Not logged in and trying to access protected page
        setAuthorized(false);
        router.push("/login");
      } else {
        // Either has token or is on login page
        setAuthorized(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="border-4 border-black p-5 font-black uppercase animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
