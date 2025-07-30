"use client";

import AuthLayout from "@/components/authLayout/AuthLayout";
import FormInput from "@/components/formInput/FormInput";
import Navbar from "@/components/navbar/Navbar";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
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

interface FormData {
  organizationId: string;
  industry: string;
  businessNature: string;
  baselineYear: string;
  baselineEmissions: string;
}

export default function AddBoundaryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Get organization ID from localStorage with error handling
  const getOrganizationId = (): string => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
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
      toast.error("Please enter a baseline year");
      return false;
    }

    const year = parseInt(data.baselineYear);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear) {
      toast.error(
        "Please enter a valid baseline year between 1900 and current year"
      );
      return false;
    }

    if (!data.baselineEmissions) {
      toast.error("Please enter baseline emissions");
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

      try {
        const response = await postRequest(
          "boundaries/addBoundary",
          formData,
          "Boundary created successfully",
          undefined,
          "post"
        );

        if (response?.data?.success) {
          toast.success(
            response.data.message || "Boundary created successfully"
          );
          router.push("/addFacility");
        } else {
          toast.error(response?.data?.message || "Failed to create boundary");
        }
      } catch (error) {
        console.error("Error creating boundary:", error);
        toast.error(
          "An error occurred while creating the boundary. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateForm, router]
  );

  const handleCancel = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <>
      <Navbar />
      <AuthLayout
        heading="Add Boundary"
        description="Define your organization's operational boundary for emissions tracking and sustainability reporting."
        imageSrc="/organization.png"
        bottomSlot={
          <p
            className="text-center text-[var(--Paragraph)]"
            style={{ fontSize: "var(--P1-size)" }}
          >
            By creating this boundary, you acknowledge that you have read and
            understood, and agree to Khazra.ai{" "}
            <a href="/terms" className="text-[var(--Primary)] cursor-pointer">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-[var(--Primary)] cursor-pointer">
              Privacy Policy
            </a>
          </p>
        }
      >
        <form className="max-w-[600px] w-full mx-auto" onSubmit={handleSubmit}>
          <div className="mb-6">
            <FormInput
              name="industry"
              label="Industry"
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
              label="Business Nature"
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
              label="Baseline Year"
              type="text"
              placeholder="Enter baseline year (e.g., 2005)"
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
