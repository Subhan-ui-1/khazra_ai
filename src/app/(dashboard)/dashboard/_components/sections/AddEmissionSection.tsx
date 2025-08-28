"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DynamicForm, { FormField } from "@/components/forms/DynamicForm";
import { safeLocalStorage } from "@/utils/localStorage";
import { getRequest, postRequest } from "@/utils/api";

type InputMode =
  | "scopeTotals"
  | "scopeCategory"
  | "scopeCategoryFacility"
  | "comprehensive";

interface AddEmissionSectionProps {
  onComplete?: (data?: any) => void;
  apiBasePath?: string; // e.g., "emissions" or "emissions/summaries"
  useApi?: boolean; // enable when backend is ready
}

// Small helper so user only needs to provide the base path
const createApiHelper = (basePath: string, token?: string) => {
  const build = (suffix?: string) =>
    suffix ? `${basePath}/${suffix}` : basePath;
  return {
    fetch: (suffix?: string) => getRequest(build(suffix), token),
    create: (payload: any, suffix?: string) =>
      postRequest(build(suffix), payload, undefined, token, "post"),
    update: (id: string, payload: any, suffix?: string) =>
      postRequest(
        build(suffix ? `${suffix}/${id}` : id),
        payload,
        undefined,
        token,
        "put"
      ),
    remove: (id: string, suffix?: string) =>
      postRequest(
        build(suffix ? `${suffix}/${id}` : id),
        {},
        undefined,
        token,
        "delete"
      ),
  };
};

const SCOPE_OPTIONS = [
  { value: "1", label: "Scope 1" },
  { value: "2", label: "Scope 2" },
];

const CATEGORY_OPTIONS = [
  { value: "stationary", label: "Stationary" },
  { value: "mobile", label: "Mobile" },
  { value: "electricity", label: "Purchased Electricity" },
  { value: "heating", label: "Heating" },
  { value: "cooling", label: "Cooling" },
  { value: "steam", label: "Steam" },
];

const MODE_OPTIONS = [
  { value: "scopeTotals", label: "Scope wise - 1, 2 total" },
  { value: "scopeCategory", label: "Scope and category wise" },
  {
    value: "scopeCategoryFacility",
    label: "Scope, category and facility wise",
  },
  {
    value: "comprehensive",
    label:
      "Comprehensive (Scope 1 stationary, facility, equipment/vehicle, etc.)",
  },
];

interface EmissionSummary {
  _id?: string;
  mode: InputMode;
  // Generic capture for UI preview card
  data: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

const AddEmissionSection: React.FC<AddEmissionSectionProps> = ({
  onComplete,
  apiBasePath = "",
  useApi = false,
}) => {
  const router = useRouter();

  const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
  if (!tokenData.accessToken) {
    toast.error("Please login to continue");
    router.push("/login");
  }

  const [existing, setExisting] = useState<EmissionSummary | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState<EmissionSummary | null>(null);
  const [mode, setMode] = useState<InputMode | "">("");

  const api = useMemo(
    () =>
      apiBasePath ? createApiHelper(apiBasePath, tokenData.accessToken) : null,
    [apiBasePath, tokenData.accessToken]
  );

  useEffect(() => {
    if (!useApi || !api) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.fetch();
        if (res?.success && res?.data) {
          setExisting({
            mode: res.data.mode as InputMode,
            data: res.data,
            _id: res.data._id,
            createdAt: res.data.createdAt,
            updatedAt: res.data.updatedAt,
          });
        }
      } catch (e) {
        // Silent for now
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [useApi, api]);

  // Emission section is visible to all authenticated users for now (no permission gating)

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setMode("");
  };

  const startEdit = (data: EmissionSummary) => {
    setEditing(data);
    setMode(data.mode);
    setShowForm(true);
  };

  const fields: FormField[] = useMemo(() => {
    const list: FormField[] = [
      {
        name: "inputMode",
        label: "Select Input Mode",
        type: "select",
        required: true,
        options: MODE_OPTIONS,
        onChange: (val) => setMode(val as InputMode),
        defaultValue: editing?.mode || "",
      },
      // Mode 1: Scope totals (show three number inputs)
      {
        name: "scope1Total",
        label: "Scope 1 Total Emissions (tCO2e)",
        type: "number",
        required: true,
        condition: (fd) => fd.inputMode === "scopeTotals",
      },
      {
        name: "scope2Total",
        label: "Scope 2 Total Emissions (tCO2e)",
        type: "number",
        required: true,
        condition: (fd) => fd.inputMode === "scopeTotals",
      },
      {
        name: "facility",
        label: "Facility",
        type: "text",
        required: true,
        placeholder: "Enter facility name",
        condition: (fd) => fd.inputMode === "scopeCategoryFacility",
      },
      // Mode 4: Comprehensive
      {
        name: "comp_scope1_stationary",
        label: "Scope 1 - Stationary (tCO2e)",
        type: "number",
        required: true,
        condition: (fd) =>
          fd.inputMode === "scopeCategory" ||
          fd.inputMode === "comprehensive" ||
          fd.inputMode === "scopeCategoryFacility",
      },
      {
        name: "comp_scope1_mobile",
        label: "Scope 1 - Mobile (tCO2e)",
        type: "number",
        required: true,
        condition: (fd) =>
          fd.inputMode === "scopeCategory" ||
          fd.inputMode === "comprehensive" ||
          fd.inputMode === "scopeCategoryFacility",
      },
      {
        name: "comp_scope2_electricity",
        label: "Scope 2 - Purchased Electricity (tCO2e)",
        type: "number",
        required: true,
        condition: (fd) =>
          fd.inputMode === "scopeCategory" ||
          fd.inputMode === "comprehensive" ||
          fd.inputMode === "scopeCategoryFacility",
      },
      {
        name: "comp_scope2_heating",
        label: "Scope 2 - Heating (tCO2e)",
        type: "number",
        required: false,
        condition: (fd) =>
          fd.inputMode === "scopeCategory" ||
          fd.inputMode === "comprehensive" ||
          fd.inputMode === "scopeCategoryFacility",
      },
      {
        name: "comp_scope2_cooling",
        label: "Scope 2 - Cooling (tCO2e)",
        type: "number",
        required: false,
        condition: (fd) =>
          fd.inputMode === "scopeCategory" ||
          fd.inputMode === "comprehensive" ||
          fd.inputMode === "scopeCategoryFacility",
      },
      {
        name: "comp_scope2_steam",
        label: "Scope 2 - Steam (tCO2e)",
        type: "number",
        required: false,
        condition: (fd) =>
          fd.inputMode === "scopeCategory" ||
          fd.inputMode === "comprehensive" ||
          fd.inputMode === "scopeCategoryFacility",
      },
      {
        name: "totalFacilities",
        label: "Facilities Total",
        type: "number",
        required: false,
        condition: (fd) => fd.inputMode === "comprehensive",
      },
      {
        name: "totalEquipment",
        label: "Equipment Total",
        type: "number",
        required: false,
        condition: (fd) => fd.inputMode === "comprehensive",
      },
      {
        name: "totalVehicles",
        label: "Vehicle Total",
        type: "number",
        required: false,
        condition: (fd) => fd.inputMode === "comprehensive",
      },
    ];
    return list;
  }, [editing]);

  const buildPayload = useCallback((data: any) => {
    const payload: any = { mode: data.inputMode };
    switch (data.inputMode as InputMode) {
      case "scopeTotals": {
        payload.scope1Total = Number(data.scope1Total || 0);
        payload.scope2Total = Number(data.scope2Total || 0);
        break;
      }
      case "scopeCategory": {
        // Using detailed breakdown (same fields as comprehensive)
        payload.scope1 = {
          stationary: Number(data.comp_scope1_stationary || 0),
          mobile: Number(data.comp_scope1_mobile || 0),
        };
        payload.scope2 = {
          electricity: Number(data.comp_scope2_electricity || 0),
          heating: Number(data.comp_scope2_heating || 0),
          cooling: Number(data.comp_scope2_cooling || 0),
          steam: Number(data.comp_scope2_steam || 0),
        };
        break;
      }
      case "scopeCategoryFacility": {
        payload.facility = data.facility;
        payload.scope1 = {
          stationary: Number(data.comp_scope1_stationary || 0),
          mobile: Number(data.comp_scope1_mobile || 0),
        };
        payload.scope2 = {
          electricity: Number(data.comp_scope2_electricity || 0),
          heating: Number(data.comp_scope2_heating || 0),
          cooling: Number(data.comp_scope2_cooling || 0),
          steam: Number(data.comp_scope2_steam || 0),
        };
        break;
      }
      case "comprehensive": {
        payload.scope1 = {
          stationary: Number(data.comp_scope1_stationary || 0),
          mobile: Number(data.comp_scope1_mobile || 0),
        };
        payload.scope2 = {
          electricity: Number(data.comp_scope2_electricity || 0),
          heating: Number(data.comp_scope2_heating || 0),
          cooling: Number(data.comp_scope2_cooling || 0),
          steam: Number(data.comp_scope2_steam || 0),
        };
        payload.totals = {
          facilities: Number(data.totalFacilities || 0),
          equipment: Number(data.totalEquipment || 0),
          vehicles: Number(data.totalVehicles || 0),
        };
        break;
      }
    }
    return payload;
  }, []);

  const onSubmit = async (form: any) => {
    try {
      if (!form?.inputMode) {
        toast.error("Please select an input mode");
        return;
      }
      setSubmitting(true);
      const payload = buildPayload(form);

      if (useApi && api) {
        const res = editing?._id
          ? await api.update(editing._id as string, payload)
          : await api.create(payload);
        if (res?.success) {
          toast.success(editing ? "Emissions updated" : "Emissions created");
          setExisting({
            mode: payload.mode,
            data: res.data || payload,
            _id: res.data?._id,
          });
          setShowForm(false);
          setEditing(null);
          if (onComplete) onComplete(res.data);
          return;
        }
      }

      // Mock success path when API is disabled or not ready
      toast.success("Saved locally (API not enabled)");
      setExisting({ mode: payload.mode, data: payload });
      setShowForm(false);
      setEditing(null);
      if (onComplete) onComplete(payload);
    } catch (e) {
      // No-op; toasts already handled by api.ts
    } finally {
      setSubmitting(false);
    }
  };

  const renderExisting = () => {
    if (!existing || showForm) return null;
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Existing Emission Summary
          </h2>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-lg">
              Active
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Mode</h3>
            <p className="text-sm text-gray-900">{existing.mode}</p>
          </div>

          {/* Scope totals */}
          {existing?.data?.scope1Total !== undefined && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Scope 1 Total
              </h3>
              <p className="text-sm text-gray-900">
                {existing.data.scope1Total}
              </p>
            </div>
          )}
          {existing?.data?.scope2Total !== undefined && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Scope 2 Total
              </h3>
              <p className="text-sm text-gray-900">
                {existing.data.scope2Total}
              </p>
            </div>
          )}

          {/* Facility if included */}
          {existing?.data?.facility && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Facility
              </h3>
              <p className="text-sm text-gray-900">{existing.data.facility}</p>
            </div>
          )}

          {/* Scope 1 breakdown */}
          {existing?.data?.scope1 && (
            <>
              {existing.data.scope1?.stationary !== undefined && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Scope 1 - Stationary
                  </h3>
                  <p className="text-sm text-gray-900">
                    {existing.data.scope1.stationary}
                  </p>
                </div>
              )}
              {existing.data.scope1?.mobile !== undefined && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Scope 1 - Mobile
                  </h3>
                  <p className="text-sm text-gray-900">
                    {existing.data.scope1.mobile}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Scope 2 breakdown */}
          {existing?.data?.scope2 && (
            <>
              {existing.data.scope2?.electricity !== undefined && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Scope 2 - Electricity
                  </h3>
                  <p className="text-sm text-gray-900">
                    {existing.data.scope2.electricity}
                  </p>
                </div>
              )}
              {existing.data.scope2?.heating !== undefined && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Scope 2 - Heating
                  </h3>
                  <p className="text-sm text-gray-900">
                    {existing.data.scope2.heating}
                  </p>
                </div>
              )}
              {existing.data.scope2?.cooling !== undefined && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Scope 2 - Cooling
                  </h3>
                  <p className="text-sm text-gray-900">
                    {existing.data.scope2.cooling}
                  </p>
                </div>
              )}
              {existing.data.scope2?.steam !== undefined && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Scope 2 - Steam
                  </h3>
                  <p className="text-sm text-gray-900">
                    {existing.data.scope2.steam}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Totals if available */}
          {existing?.data?.totals && (
            <>
              {existing.data.totals?.facilities !== undefined && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Facilities Total
                  </h3>
                  <p className="text-sm text-gray-900">
                    {existing.data.totals.facilities}
                  </p>
                </div>
              )}
              {existing.data.totals?.equipment !== undefined && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Equipment Total
                  </h3>
                  <p className="text-sm text-gray-900">
                    {existing.data.totals.equipment}
                  </p>
                </div>
              )}
              {existing.data.totals?.vehicles !== undefined && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Vehicle Total
                  </h3>
                  <p className="text-sm text-gray-900">
                    {existing.data.totals.vehicles}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Emission summary saved.</p>
            <button
              onClick={() => startEdit(existing)}
              className="bg-[#0D5942] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Emissions
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Emission Management
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#0D5942] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Emission Summary
        </button>
      </div>

      {renderExisting()}

      {showForm && (
        <div>
          <DynamicForm
            title={editing ? "Edit Emission Summary" : "Add Emission Summary"}
            fields={fields}
            onSubmit={onSubmit}
            onCancel={resetForm}
            initialData={{ inputMode: editing?.mode || mode }}
            loading={submitting}
            submitText={editing ? "Update" : "Create"}
            cancelText="Cancel"
            onClose={resetForm}
            confirmationMessage={
              editing
                ? "Do you want to update emissions?"
                : "Do you want to create emissions?"
            }
          />
        </div>
      )}

      {!showForm && !existing && !loading && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="mt-2 text-gray-600">No emission summary found.</p>
        </div>
      )}

      {loading && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <svg
            className="animate-spin h-8 w-8 mx-auto text-[#0D5942]"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading emission info...</p>
        </div>
      )}
    </div>
  );
};

export default AddEmissionSection;
