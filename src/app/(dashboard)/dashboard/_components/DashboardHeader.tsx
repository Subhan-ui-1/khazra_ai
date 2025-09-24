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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState("");
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
      return "";
    }
  };

  // Confirmation modal handlers
  const showConfirmation = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmMessage("");
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmMessage("");
  };

  const handleLogout = async () => {
    try {
      await postRequest(
        "auth/logout",
        {},
        "Logout Successfully",
        getTokens(),
        "post"
      );
      safeLocalStorage.clear();
      router.replace("login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <header className="bg-white border-b border-green-100 px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between fixed top-0 left-0 right-0 z-40 shadow-sm">
      {/* Logo */}
      <Link
        href="/"
        className="xl:w-[147px] lg:w-[127px] w-[97px] h-[16px] lg:h-[26px] flex items-center justify-center"
      >
        <Image src={"/Logo_1.png"} alt="khazra logo" height={26} width={75} />
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
              onClick={() => {
                setShowLogout(false);
                showConfirmation(
                  "Are you sure you want to logout?",
                  handleLogout
                );
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
              </div>
              <p className="text-gray-600 mb-6">{confirmMessage}</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-[#0D5942] text-white rounded-md hover:bg-[#0a4a35] transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
