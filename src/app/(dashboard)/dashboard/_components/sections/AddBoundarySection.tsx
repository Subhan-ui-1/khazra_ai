"use client";

import AuthLayout from "@/components/authLayout/AuthLayout";
import FormInput from "@/components/formInput/FormInput";
import Navbar from "@/components/navbar/Navbar";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import toast from "react-hot-toast";
import { postRequest } from "@/utils/api";

// Constants
const INDUSTRY_OPTIONS = [
  "Industry",
  "Textile",
  "Chemical Industries",
  "Tech Industries",
  "Medical Industries",
  "Automobile Industries",
];

const BUSINESS_NATURE_OPTIONS = ["Hybrid", "Remote", "Onsite"];

// Generate past years for dropdown (from current year back to 1900)
const generatePastYears = (): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let year = currentYear; year >= 1900; year--) {
    years.push(year.toString());
  }
  return years;
};

const PAST_YEARS = generatePastYears();

const YES_NO_OPTIONS = ["No", "Yes"];

interface FormData {
  organizationId: string;
  industry: string;
  businessNature: string;
  baselineYear: string;
  baselineEmissions?: string;
  vehicleCount: number;
  facilityCount: number;
  equipmentCount: number;
}

export default function AddBoundaryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  const [questions, setQuestions] = useState<{
    vehicleCount: "Yes" | "No"|"";
    facilityCount: "Yes" | "No"|""  ;
    equipmentCount: "Yes" | "No"|"";
  }>({
    vehicleCount: "",
    facilityCount: "",
    equipmentCount: "",
  });
  const changeQuestion = (question: "vehicleCount" | "facilityCount" | "equipmentCount", value: "Yes" | "No"|"") => {
    setQuestions((prev) => ({
      ...prev,
      [question]: value,
    }));
  };
  const tokenString = JSON.parse(localStorage.getItem("tokens") || "{}");
  if (!tokenString.accessToken) {
    router.replace("/login");
  }
  // Get organization ID from localStorage with error handling
  const getOrganizationId = (): string => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      return user.organization || "";
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return "";
    }
  };

  const [formData, setFormData] = useState<FormData>({
    organizationId: getOrganizationId(),
    industry: "",
    businessNature: "",
    baselineYear: "",
    baselineEmissions: "",
    vehicleCount: 0,
    facilityCount: 0,
    equipmentCount: 0,
  });

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const validateForm = useCallback((data: FormData): boolean => {
    if (!data.industry || data.industry === "Industry") {
      toast.error("Please select a valid industry");
      return false;
    }

    if (!data.businessNature || data.businessNature === "") {
      toast.error("Please select a business nature");
      return false;
    }

    if (!data.baselineYear) {
      toast.error("Please select a baseline year");
      return false;
    }

    return true;
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validateForm(formData)) {
        return;
      }

      setIsLoading(true);
      console.log(formData, "formData");
      // try {
      //   const response = await postRequest(
      //     "boundaries/addBoundary",
      //     formData,
      //     "Boundary created successfully",
      //     tokenString.accessToken,
      //     "post"
      //   );

      //   if (response?.success) {
      //     toast.success(
      //       response.message || "Boundary created successfully"
      //     );
      //     router.push("/dashboard?section=add-facility");
      //   } else {
      //     toast.error(response?.message || "Failed to create boundary");
      //   }
      // } catch (error) {
      //   console.error("Error creating boundary:", error);
      //   toast.error(
      //     "An error occurred while creating the boundary. Please try again."
      //   );
      // } finally {
      //   setIsLoading(false);
      // }
    },
    [formData, validateForm, router]
  );

  const handleCancel = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <>
      <AuthLayout
        heading="Add Boundary"
        // description="Define your organization's operational boundary for emissions tracking and sustainability reporting."
        // imageSrc="/organization.png"
        // bottomSlot={
        //   <p
        //     className="text-center text-[var(--Paragraph)]"
        //     style={{ fontSize: "var(--P1-size)" }}
        //   >
        //     By creating this boundary, you acknowledge that you have read and
        //     understood, and agree to Khazra.ai{" "}
        //     <a href="/terms" className="text-[var(--Primary)] cursor-pointer">
        //       Terms & Conditions
        //     </a>{" "}
        //     and{" "}
        //     <a href="/privacy" className="text-[var(--Primary)] cursor-pointer">
        //       Privacy Policy
        //     </a>
        //   </p>
        // }
      >
        <form className="max-w-[600px] w-full mx-auto" onSubmit={handleSubmit}>
          <div className="mb-6">
            <FormInput
              name="industry"
              label="Industry*"
              type="select"
              placeholder="Select your industry"
              options={INDUSTRY_OPTIONS}
              value={formData.industry}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-6">
            <FormInput
              name="businessNature"
              label="Business Nature*"
              type="select"
              placeholder="Select business nature"
              options={BUSINESS_NATURE_OPTIONS}
              value={formData.businessNature}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-6">
            <FormInput
              name="baselineYear"
              label="Baseline Year*"
              type="select"
              placeholder="Select baseline year"
              options={PAST_YEARS}
              value={formData.baselineYear}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-6">
            <FormInput
              name="baselineEmissions"
              label="Baseline Emissions (tCO2e)"
              type="text"
              placeholder="Enter baseline emissions"
              value={formData.baselineEmissions}
              onChange={handleInputChange}
            />
          </div>

          {/* Vehicle Count Section */}
          <div className="mb-6">
            <FormInput
              name="vehicleCount"
              label="Do you have any vehicles?"
              type="select"
              placeholder="Select Yes or No"
              options={YES_NO_OPTIONS}
              value={questions.vehicleCount}
              onChange={(e) => changeQuestion("vehicleCount", e.target.value as "Yes" | "No" | "")}
            />
            {questions.vehicleCount === "Yes" && (
              <div className="mt-4">
                <FormInput
                  name="vehicleCount"
                  label="How many vehicles do you have?"
                  type="number"
                  placeholder="Enter number of vehicles"
                  value={formData.vehicleCount}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>

          {/* Facility Count Section */}
          <div className="mb-6">
            <FormInput
              name="facilityCount"
              label="Do you have any facilities?"
              type="select"
              placeholder="Select Yes or No"
              options={YES_NO_OPTIONS}
              value={questions.facilityCount}
              onChange={(e) => changeQuestion("facilityCount", e.target.value as "Yes" | "No" | "")}
            />
            {questions.facilityCount === "Yes" && (
              <div className="mt-4">
                <FormInput
                  name="facilityCount"
                  label="How many facilities do you have?"
                  type="number"
                  placeholder="Enter number of facilities"
                  value={formData.facilityCount}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>

          {/* Equipment Count Section */}
          <div className="mb-6">
            <FormInput
              name="equipmentCount"
              label="Do you have any equipments?"
              type="select"
              placeholder="Select Yes or No"
              options={YES_NO_OPTIONS}
              value={questions.equipmentCount}
              onChange={(e) => changeQuestion("equipmentCount", e.target.value as "Yes" | "No" | "")}
            />
            {questions.equipmentCount === "Yes" && (
              <div className="mt-4">
                <FormInput
                  name="equipmentCount"
                  label="How many equipments do you have?"
                  type="number"
                  placeholder="Enter number of equipments"
                  value={formData.equipmentCount}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-[20px] bg-black p-3 rounded-lg hover:opacity-90 cursor-pointer mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            style={{ color: "var(--Placeholder)" }}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Boundary...
              </>
            ) : (
              "Create Boundary"
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full text-[20px] border border-[var(--Outline)] p-3 rounded-lg hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: "var(--Paragraph)",
              backgroundColor: "var(--Placeholder)",
            }}
          >
            Cancel
          </button>
        </form>
      </AuthLayout>

      {/* {isLoading && (
                <div className="fixed inset-0 z-[999] backdrop-blur-sm bg-black/40 flex items-center justify-center">
                    <DotLottieReact
                        src="https://lottie.host/3285712b-b88e-4d25-b560-0792e2ac5457/ciHZUebQPG.lottie"
                        autoplay
                        loop
                        style={{ width: 150, height: 150 }}
                    />
                </div>
            )} */}
    </>
  );
}
