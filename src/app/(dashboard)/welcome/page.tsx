"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Layers,
} from "lucide-react";
import Image from "next/image";
import { safeLocalStorage } from "@/utils/localStorage";
import { useI18n } from "@/i18n/context";
import { postRequest } from "@/utils/api";
import { useRouter } from "next/navigation";

const Page = () => {
  const user = safeLocalStorage.getItem("user");
  const userName = user ? JSON.parse(user).fullName : "";

  const { t, switchLanguage, isRTL } = useI18n();
  const router = useRouter();
  const getTokens = () => {
    const token = safeLocalStorage.getItem("tokens");
    const tokenData = JSON.parse(token || "{}");
    return tokenData.accessToken;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(40%_60%_at_10%_10%,#e0f2fe_0%,transparent_60%),radial-gradient(35%_55%_at_90%_0%,#dcfce7_0%,transparent_60%),radial-gradient(45%_60%_at_50%_100%,#e9d5ff_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="flex items-center justify-between gap-8 flex-col lg:flex-row">
          <div className="max-w-3xl w-full">
            {/* <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-full bg-white/60 backdrop-blur border border-white/40 shadow-sm flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/60 backdrop-blur border border-white/40 text-gray-700">Sustainability Workspace</span>
            </div> */}
            <Image
              src="/Logo_1.png"
              alt="logo"
              width={100}
              height={20}
              className="mb-5 "
            />

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              {t("welcome.titlePrefix")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-green-400 to-green-700">
                {userName}
              </span>
            </h1>
            <p className="mt-5 text-lg text-gray-700 leading-relaxed">
              {t("welcome.description")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard/steps"
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0d5942ab] to-[#0D5942] text-white font-medium shadow-md hover:shadow-lg transition-shadow"
              >
                {t("welcome.ctaStart")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white/70 backdrop-blur text-gray-900 font-medium shadow-sm border border-white/60 hover:bg-white transition-colors"
              >
                {t("welcome.ctaDashboard")}
              </Link>
             
            </div>

            {/* Stats row */}
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl">
              <div className="rounded-xl bg-white/70 backdrop-blur border border-white/60 p-4 shadow-sm">
                <p className="text-xs text-gray-500">
                  {t("welcome.stats.reporting")}
                </p>
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {t("welcome.stats.iso")}
                </p>
              </div>
              <div className="rounded-xl bg-white/70 backdrop-blur border border-white/60 p-4 shadow-sm">
                <p className="text-xs text-gray-500">
                  {t("welcome.stats.materiality")}
                </p>
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {t("welcome.stats.today")}
                </p>
              </div>
              <div className="rounded-xl bg-white/70 backdrop-blur border border-white/60 p-4 shadow-sm">
                <p className="text-xs text-gray-500">
                  {t("welcome.stats.compliance")}
                </p>
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {t("welcome.stats.onTrack")}
                </p>
              </div>
            </div>
          </div>

          {/* Preview card */}
          <div className="w-full max-w-md">
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">
                    {t("welcome.nextStep.title")}
                  </p>
                  <p className="mt-1 text-base font-semibold text-gray-900">
                    {t("welcome.nextStep.finalizeBaseline")}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#0D5942]" />
              </div>
              <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-[#0d5942a1] to-[#0D5942]" />
              </div>
              <div className="mt-4 flex gap-2">
                <span className="px-2 py-1 text-xs rounded-md bg-blue-50 text-[#0D5942] border border-blue-100">
                  {t("welcome.tags.scope1")}
                </span>
                <span className="px-2 py-1 text-xs rounded-md bg-indigo-50 text-[#0D5942] border border-indigo-100">
                  {t("welcome.tags.scope2")}
                </span>
                <span className="px-2 py-1 text-xs rounded-md bg-emerald-50 text-[#0D5942] border border-emerald-100">
                  {t("welcome.tags.reporting")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/steps"
            className="group rounded-2xl bg-white/70 backdrop-blur border border-white/60 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {t("welcome.grid.boundaries.title")}
              </h3>
              <Layers className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="mt-2 text-sm text-gray-700">
              {t("welcome.grid.boundaries.desc")}
            </p>
            <div className="mt-4 inline-flex items-center text-emerald-700 text-sm font-medium">
              {t("welcome.grid.boundaries.configure")}
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link
            href="/dashboard/steps"
            className="group rounded-2xl bg-white/70 backdrop-blur border border-white/60 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {t("welcome.grid.ghg.title")}
              </h3>
              <ShieldCheck className="w-5 h-5 text-[#0D5942] group-hover:scale-110 transition-transform" />
            </div>
            <p className="mt-2 text-sm text-gray-700">
              {t("welcome.grid.ghg.desc")}
            </p>
            <div className="mt-4 inline-flex items-center text-[#0D5942] text-sm font-medium">
              {t("welcome.grid.ghg.configure")}
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link
            href="/dashboard/steps"
            className="group rounded-2xl bg-white/70 backdrop-blur border border-white/60 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {t("welcome.grid.baseline.title")}
              </h3>
              <TrendingUp className="w-5 h-5 text-[#0D5942] group-hover:scale-110 transition-transform" />
            </div>
            <p className="mt-2 text-sm text-gray-700">
              {t("welcome.grid.baseline.desc")}
            </p>
            <div className="mt-4 inline-flex items-center text-[#0D5942] text-sm font-medium">
              {t("welcome.grid.baseline.configure")}
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>

        {/* Secondary section */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-white/70 backdrop-blur border border-white/60 p-6 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900">
              {t("welcome.tips.title")}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-700 list-disc pl-5">
              <li>{t("welcome.tips.list1")}</li>
              <li>{t("welcome.tips.list2")}</li>
              <li>{t("welcome.tips.list3")}</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 p-6 text-white shadow-sm">
            <h4 className="text-sm font-semibold">{t("welcome.help.title")}</h4>
            <p className="mt-2 text-sm/6 opacity-90">
              {t("welcome.help.desc")}
            </p>
            <div className="mt-4 flex gap-3">
              {/* <Link
                href="/dashboard"
                className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/15 text-sm"
              >
                {t("welcome.help.docs")}
              </Link> */}
               <button
                type="button"
                onClick={switchLanguage}
                className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/15 text-sm"
              >
                {t("language.switchLanguage")}
              </button>
              <button
              onClick={async()=>{
                await postRequest(
                  "auth/logout",
                  {},
                  "Logout Successfully",
                  getTokens(),
                  "post"
                );
                safeLocalStorage.clear();
                router.replace("/login");
              }}
                className="px-4 py-2 bg-white rounded-lg text-blue-700 text-sm font-semibold cursor-pointer"
              >
                {t("navigation.logout")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
