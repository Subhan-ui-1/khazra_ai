"use client";

import { postRequest } from "@/utils/api";
import { safeLocalStorage } from "@/utils/localStorage";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [userInitials, setUserInitials] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  useEffect(() => {
    setIsClient(true);
    const getInitials = () => {
      try {
        const user = JSON.parse(safeLocalStorage.getItem("user") || "{}");
        if (!user.fullName) {
          router.push("/login");
          return "";
        } else {
          const fullName = user.fullName;
          const initials = fullName
            .split(" ")
            .map((name: string) => name[0])
            .join("");
          return initials;
        }
      } catch (error) {
        console.error("Error getting user initials:", error);
        return "";
      }
    };
    
    setUserInitials(getInitials());
  }, [router]);
  
  const getTokens = () => {
    try {
      const token = safeLocalStorage.getItem("tokens");
      const tokenData = JSON.parse(token || "{}");
      return tokenData.accessToken;
    } catch (error) {
      console.error("Error getting tokens:", error);
      return "";
    }
  };
  return (
    <header className="bg-white border-b border-green-100 px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between fixed top-0 left-0 right-0 z-40 shadow-sm">
      {/* Logo */}
      <Link
        href="/"
        className="xl:w-[147px] lg:w-[127px] w-[97px] h-[16px] lg:h-[26px] flex items-center"
      >
        <Image src={"/Logo.svg"} alt="khazra logo" height={26} width={147} />
      </Link>

      {/* Desktop Nav */}
      {/* <nav className="md:flex hidden lg:gap-10 md:gap-6">
        <a
          href="#"
          className="text-green-800 font-medium lg:text-sm text-xs py-2 border-b-2 border-green-800 transition-colors"
        >
          Collect & update data
        </a>
        <a
          href="#"
          className="text-green-800 font-medium lg:text-sm text-xs py-2 border-b-2 border-transparent hover:border-green-200 transition-colors"
        >
          Measure emissions
        </a>
        <a
          href="#"
          className="text-green-800 font-medium lg:text-sm text-xs py-2 border-b-2 border-transparent hover:border-green-200 transition-colors"
        >
          Report emissions
        </a>
        <a
          href="#"
          className="text-green-800 font-medium lg:text-sm text-xs py-2 border-b-2 border-transparent hover:border-green-200 transition-colors"
        >
          Reduce emissions
        </a>
      </nav> */}

             <div className="relative">
         <button
           className="size-10 rounded-full items-center justify-center flex bg-[#0D5942] text-white cursor-pointer hover:bg-[#0A4A37] transition-colors duration-200 shadow-sm"
           onClick={() => setShowLogout((prev) => !prev)}
         >
           {isClient ? userInitials : "..."}
         </button>
        {showLogout && (
          <div className="absolute top-12 right-0 bg-white rounded-lg z-30 shadow-lg border border-gray-200 min-w-[140px] py-1">
            <button
              className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 group"
              onClick={async () => {
                await postRequest(
                  "auth/logout",
                  {},
                  "Logout Successfully",
                  getTokens(),
                  "post"
                );
                safeLocalStorage.clear();
                router.replace("login");
              }}
            >
              <svg className="w-4 h-4 text-gray-500 group-hover:text-[#0D5942] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm font-medium group-hover:text-[#0D5942] transition-colors duration-200">Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Desktop Buttons */}
      {/* <div className="md:flex hidden items-center lg:gap-4 gap-2">
        <button
          onClick={async () => {
            await postRequest(
              "auth/logout",
              {},
              "Logout Successfully",
              getTokens(),
              "post"
            );
            safeLocalStorage.clear();
            router.replace("login");
          }}
          className="text-green-800 hover:bg-green-50 p-2 rounded transition-all duration-300 hover:scale-110"
          title="Notifications"
        >
          Logout
        </button>
      </div> */}

      {/* Hamburger Icon (Mobile) */}
      <button
        className="md:hidden text-green-800 p-1 rounded focus:outline-none focus:ring-1 focus:ring-green-100"
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <HiX className="w-4 h-4" />
        ) : (
          <HiMenu className="w-4 h-4" />
        )}
      </button>

      {/* Mobile Dropdown Nav */}
      {/* {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md border-t border-green-100 flex flex-col gap-2 px-6 py-4 md:hidden z-40">
          <a
            href="#"
            className="text-green-800 font-medium text-sm py-2 border-b border-green-50 hover:border-green-200"
          >
            Collect & update data
          </a>
          <a
            href="#"
            className="text-green-800 font-medium text-sm py-2 border-b border-green-50 hover:border-green-200"
          >
            Measure emissions
          </a>
          <a
            href="#"
            className="text-green-800 font-medium text-sm py-2 border-b border-green-50 hover:border-green-200"
          >
            Report emissions
          </a>
          <a
            href="#"
            className="text-green-800 font-medium text-sm py-2 border-b border-green-50 hover:border-green-200"
          >
            Reduce emissions
          </a>
          <div className="flex items-center gap-4">
            <button
              className="text-green-800 hover:bg-green-50 p-2 rounded transition-all duration-300 hover:scale-110"
              title="Notifications"
            >
              🔔
            </button>
            <button
              className="text-green-800 hover:bg-green-50 p-2 rounded transition-all duration-300 hover:scale-110"
              title="Settings"
            >
              ⚙️
            </button>
            <button
              className="text-green-800 hover:bg-green-50 p-2 rounded transition-all duration-300 hover:scale-110"
              title="Export"
            >
              📊
            </button>
          </div>
        </div>
      )} */}
    </header>
  );
}
