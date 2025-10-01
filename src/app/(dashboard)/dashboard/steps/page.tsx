"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Shield,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { useI18n } from "@/i18n/context";
import GlobalHeader from "@/components/GlobalHeader/GlobalHeader";
import BoundarySetupSteps from "../_components/sections/BoundarySetupSteps";
import GHGManage from "../_components/sections/GHGManage";
import AddEmissionSection from "../_components/sections/AddEmissionSection";
import Image from "next/image";
import { safeLocalStorage } from "@/utils/localStorage";

interface Step {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  completed?: boolean;
}

const steps: Step[] = [
  {
    id: "boundary",
    title: "",
    // description: 'Set up your organization boundaries and baseline information',
    icon: <Building2 className="w-5 h-5" />,
    component: BoundarySetupSteps,
  },
  {
    id: "ghg",
    title: "",
    // description: 'Define policies, training, and inventory practices for robust GHG governance',
    icon: <Shield className="w-5 h-5" />,
    component: GHGManage,
  },
  {
    id: "emissions",
    title: "",
    // description: 'Select baseline year, define reporting periods, and enter scope-wise data',
    icon: <TrendingUp className="w-5 h-5" />,
    component: AddEmissionSection,
  },
];

export default function StepsPage() {
  const { t, isRTL, setLocale } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [stepProgress, setStepProgress] = useState<Record<string, number>>({});
  const router = useRouter();

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps((prev) => new Set([...prev, stepId]));
    setStepProgress((prev) => ({ ...prev, [stepId]: 100 }));
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  const handleProgressChange = (stepId: string, percent: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(percent)));
    setStepProgress((prev) => ({ ...prev, [stepId]: clamped }));
  };

  const localizedSteps = steps.map((s) => ({
    ...s,
    title:
      s.id === "boundary"
        ? t("steps.nav.boundary")
        : s.id === "ghg"
        ? t("steps.nav.ghg")
        : s.id === "emissions"
        ? t("steps.nav.baseline")
        : s.title,
  }));
  const CurrentStepComponent = localizedSteps[currentStep].component;
  const completedCount = completedSteps.size;
  const totalSteps = steps.length;
  const progressPercentage = useMemo(() => {
    // Only average across steps that have reported progress or are completed
    const considered = steps
      .map((s) => ({
        id: s.id,
        value: stepProgress[s.id],
        completed: completedSteps.has(s.id),
      }))
      .filter((s) => typeof s.value === "number" || s.completed);

    if (considered.length === 0) return 0;

    const sum = considered.reduce(
      (acc, s) => acc + (typeof s.value === "number" ? s.value! : 100),
      0
    );
    return Math.round(sum / considered.length);
  }, [stepProgress, completedSteps]);

  const getTokens = () => {
    const token = safeLocalStorage.getItem("tokens");
    const tokenData = JSON.parse(token || "{}");
    return tokenData.accessToken;
  };

  if (!getTokens()) {
    router.push("/login");
    return;
  }

  return (
    <div className="min-h-screen bg-white relative">
      <GlobalHeader>
        <div className="ml-8 flex items-center space-x-4">
          <Image src={"/Logo_1.png"} alt="khazra logo" height={26} width={85} />
          {/* <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {totalSteps}
          </span> */}
        </div>
      </GlobalHeader>

      <div className="flex pt-12">
        {/* Sidebar */}
        <aside className="w-72 bg-[#0D5942] text-white border-r border-green-100 py-6 overflow-y-auto h-screen fixed left-0 top-16 z-10">
          {/* Progress Section */}
          <div className="px-5 mb-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">
                  {t("steps.sidebar.setupProgress")}
                </span>
                <span className="text-sm font-medium text-white">
                  {progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              {/* <p className="text-xs text-white/80 mt-2">
                {completedCount} of {totalSteps} steps completed
              </p> */}
            </div>
          </div>

          {/* Steps Navigation */}
          <div className="px-2">
            <p className="px-3 py-2 text-xs font-semibold text-white opacity-60 uppercase tracking-wider mb-3">
              {t("steps.sidebar.setupSteps")}
            </p>
            <div className="space-y-1">
              {localizedSteps.map((step, index) => {
                const isCompleted = completedSteps.has(step.id);
                const isCurrent = index === currentStep;
                const pct = stepProgress[step.id] ?? (isCompleted ? 100 : 0);

                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={`w-full flex items-center gap-3 py-3 px-3 text-white text-sm font-medium transition-all duration-300 cursor-pointer hover:bg-[#496a6065] rounded-lg ${
                      isCurrent ? "bg-[#10694e] font-semibold" : ""
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        isCurrent ? "bg-white/20" : "bg-white/10"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <span className="truncate">{step.title}</span>
                        {/* <span className="text-xs font-medium opacity-80">{pct}%</span> */}
                      </div>
                      {/* <div className="mt-1 h-1 rounded-full bg-white/20">
                        <div
                          className={`h-1 rounded-full ${pct === 100 ? 'bg-green-400' : 'bg-white'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div> */}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-72 border-l border-green-100 xl:ps-10 pe-2 lg:py-6 lg:ps-8 p-4 bg-white max-md:mt-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Step Header */}
            {/* <div className="px-6 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                {steps[currentStep].icon}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {steps[currentStep].description}
                  </p>
                </div>
              </div>
            </div> */}

            {/* Step Content */}
            <div className="p-6">
              <CurrentStepComponent
                onComplete={() => handleStepComplete(steps[currentStep].id)}
                onProgressChange={(p: number) =>
                  handleProgressChange(steps[currentStep].id, p)
                }
              />
            </div>
          </div>
        </main>
      </div>

      {/* Add Later Button - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            router.push("/dashboard");
            setLocale("en");
          }}
          className="inline-flex items-center px-6 py-3 bg-[#8c3738] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-white"
        >
          <span>{t("steps.nav.addLater")}</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
      <div className="fixed bottom-6 right-46 z-40">
        <button
          onClick={() => {
            router.push("/dashboard");
            setLocale("en");
          }}
          className="inline-flex items-center px-6 py-3 bg-[#8c3738] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-white"
        >
          <span>{t("welcome.ctaDashboard")}</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
