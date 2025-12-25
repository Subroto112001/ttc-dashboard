"use client";
import { usePathname } from "next/navigation";
import AuthCheck from "./AuthCheck";
import Sidebar from "./Sidebar";


export default function LayoutClientWrapper({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <AuthCheck>
      <div className="flex">
        {/* The Sidebar will now appear/disappear instantly based on the URL */}
        {!isLoginPage && <Sidebar />}

        <main className="flex-1">{children}</main>
      </div>
    </AuthCheck>
  );
}
