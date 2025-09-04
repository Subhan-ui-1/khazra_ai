"use client";

import React from "react";
import { useI18n } from "@/i18n/context";
import LanguageSwitcher from "@/components/languageSwitcher/LanguageSwitcher";
import { safeLocalStorage } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { postRequest } from "@/utils/api";

interface GlobalHeaderProps {
  title?: string;
  showLanguageSwitcher?: boolean;
  children?: React.ReactNode;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  title,
  showLanguageSwitcher = true,
  children,
}) => {
  const { t, locale, isRTL, setLocale } = useI18n();

  const router = useRouter();

  const getTokens = () => {
    const token = safeLocalStorage.getItem("tokens");
    const tokenData = JSON.parse(token || "{}");
    return tokenData.accessToken;
  };
  return (
    <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50 border-gray-200">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {title && (
              <h1
                className={`text-2xl font-bold text-gray-900 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {title}
              </h1>
            )}
            {children}
          </div>
          <div className="flex gap-2">
            {showLanguageSwitcher && (
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
              </div>
            )}
            <div
              onClick={async () => {
                await postRequest(
                  "auth/logout",
                  {},
                  "Logout Successfully",
                  getTokens(),
                  "post"
                );
                safeLocalStorage.clear();
                router.replace("/login");
                setLocale("en");
              }}
              className="flex items-center space-x-4 border border-gray-300  rounded-md px-5 cursor-pointer"
            >
              {t("navigation.logout")}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
