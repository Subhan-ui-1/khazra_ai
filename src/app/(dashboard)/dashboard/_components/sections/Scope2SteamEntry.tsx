import React, { useState, useEffect } from "react";
import { Plus, X, Edit3, Trash2, Thermometer, Paperclip } from "lucide-react";
import { getRequest, postRequest } from "@/utils/api";
import toast from "react-hot-toast";
import { safeLocalStorage } from "@/utils/localStorage";
import Table from "@/components/Table";
import { scope2EnergyTypes } from "@/constants/scope2EnergyType";
import FileUploadModal from "@/components/FileUploadModal";
import { useRouter } from "next/navigation";

interface Facility {
  _id: string;
  facilityName: string;
  facilityType: string;
  city: string;
  country: string;
}

interface EnergyType {
  _id: string;
  energyType: string;
  energyTypeUnit: string;
  emissionFactorC02: number;
}

interface SteamFormData {
  month: string;
  year: string;
  facility: string;
  energyType: string;
  gridLocation: string;
  consumedUnits: string;
  amountOfConsumption: string;
  emissionFactor: string;
  customEmissionFactor: boolean;
  attachment?: File|null;
}

const Scope2SteamEntry: React.FC = () => {
  const [selectedFacility, setSelectedFacility] = useState("all");
  const [steamData, setSteamData] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showAttachment, setShowAttachment] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const router = useRouter()

  // Dropdown data states
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [energyTypes, setEnergyTypes] = useState<EnergyType[]>([]);

  const [formData, setFormData] = useState<SteamFormData>({
    month: "",
    year: "",
    facility: "",
    energyType: "",
    gridLocation: "",
    consumedUnits: "",
    amountOfConsumption: "",
    emissionFactor: "",
    customEmissionFactor: false,
    attachment: null,
  });

  const getToken = () => {
    const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
    return tokenData.accessToken;
  };

  // Fetch dropdown data
  const fetchFacilities = async () => {
    try {
      const facilities = safeLocalStorage.getItem("facilities");
      if(facilities){
        setFacilities(JSON.parse(facilities));
        return;
      }
      const response = await getRequest(
        "facilities/getFacilities?status=Active",
        getToken()
      );
      if (response.success) {
        setFacilities(response.data.facilities || []);
        safeLocalStorage.setItem("facilities", JSON.stringify(response.data.facilities));
      } else {
        return;
      }
    } catch (error: any) {
      return;
    }
  };

  const fetchEnergyTypes = async () => {
    setEnergyTypes(scope2EnergyTypes);
  };

  const getSteamTotal = async () => {
    try {
      const steamTotal = safeLocalStorage.getItem("steamTotal");
      if(steamTotal){
        setSteamData(JSON.parse(steamTotal));
        return;
      }
      const response = await getRequest(
        "purchased-electricity/getPurchasedElectricity?scopeType=steam",
        getToken()
      );
      if (response.success) {
        setSteamData(response.data.purchasedElectricity || []);
        safeLocalStorage.setItem("steamTotal", JSON.stringify(response.data.purchasedElectricity||[]));
      } else {
        return;
      }
    } catch (error: any) {
      return;
    }
  };

  // Load dropdown data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchFacilities(),
          fetchEnergyTypes(),
          getSteamTotal(),
        ]);
        setDataLoaded(true);
      } catch (error) {
        return;
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFileUploadOnAPI = async (file:File)=>{
    const formData = new FormData();
    formData.append("file", file);
    const response = await postRequest(
      "upload-attachment/uploadAttachment",
      formData,
      "",
      getToken(),
      "post",
    );
    if(response.success){
      return response.attachment;
    }
    return null;
  }

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

  const handleSubmit = async () => {
    showConfirmation(
      editingItem 
        ? "Are you sure you want to update this steam record?" 
        : "Are you sure you want to add this new steam record?",
      () => submitSteamData()
    );
  };

  const submitSteamData = async () => {
    setLoading(true);

    try {
      const energyType = energyTypes.find(
        (e) => e.energyType === "Purchased Steam"
      );
      // Prepare the data according to the API specification
      const requestData = {
        month: parseInt(formData.month),
        year: 2025,
        facility: formData.facility,
        energyType: energyType?._id,
        gridLocation: formData.gridLocation,
        consumedUnits: parseFloat(formData.consumedUnits),
        amountOfConsumption: parseFloat(formData.amountOfConsumption),
        emissionFactor: formData.customEmissionFactor
          ? parseFloat(formData.emissionFactor)
          : parseFloat(energyType?.emissionFactorC02?.toString() || ""),
        attachment: null,
      };

      if (editingItem) {
        // Update existing record
        const editingId = editingItem?._id || editingItem?.id;

        if (!editingId) {
          return;
        }
        delete requestData.attachment;
        const response = await postRequest(
          `purchased-electricity/updatePurchasedElectricity/${editingId}`,
          requestData,
          "",
          getToken(),
          "put",
          true,
          "purchasedElectricity"
        );

        if (response.success) {
          toast.success("Steam data updated successfully");
          const steamTotal = safeLocalStorage.getItem("steamTotal");
          if(steamTotal){
            const steamData = JSON.parse(steamTotal) ||[];
            const index = steamData.findIndex((item:any)=>item._id == editingId);
            steamData[index] = response.purchasedElectricity;
            safeLocalStorage.setItem("steamTotal", JSON.stringify(steamData));
          }
          await getSteamTotal();
          setShowForm(false);
          setEditingItem(null);
          resetForm();
        } else {
          return;
        }
      } else {
        if(formData.attachment){
          const attachment = await handleFileUploadOnAPI(formData.attachment);
          if(attachment){
            requestData.attachment = attachment;
          }
          else{
            return;
          }
        }
        // Add new record
        const response = await postRequest(
          "purchased-electricity/addPurchasedElectricity",
          { ...requestData, scope: "scope2", scopeType: "steam" },
          "",
          getToken(),
          "post",
          true,
          "purchasedElectricity"
        );

        if (response.success) {
          toast.success("Steam data added successfully");
          const steamTotal = safeLocalStorage.getItem("steamTotal");
          if(steamTotal){
            const steamData = JSON.parse(steamTotal) ||[];
            steamData.push(response.purchasedElectricity);
            safeLocalStorage.setItem("steamTotal", JSON.stringify(steamData));
          }
          await getSteamTotal();
          setShowForm(false);
          resetForm();
        } else {
          return;
        }
      }
    } catch (error: any) {
      return;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      month: "",
      year: "",
      facility: "",
      energyType: "",
      gridLocation: "",
      consumedUnits: "",
      amountOfConsumption: "",
      emissionFactor: "",
      customEmissionFactor: false,
      attachment: null,
    });
  };

  const startEdit = (item: any) => {
    setShowAttachment(false);
    setEditingItem(item);
    setFormData({
      month: item.month?.toString() || "",
      year: item.year?.toString() || "",
      facility: item.facility || "",
      energyType: item.energyType || "",
      gridLocation: item.gridLocation || "",
      consumedUnits: item.consumedUnits?.toString() || "",
      amountOfConsumption: item.amountOfConsumption?.toString() || "",
      emissionFactor: item.emissionFactor?.toString() || "",
      customEmissionFactor: false,
      attachment: null,
    });
    setShowForm(true);
  };

  useEffect(() => {
    if (showForm) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [showForm]);

  const deleteRecord = async (item: any) => {
    try {
      const editingId = item?._id || item?.id;

      if (!editingId) {
        return;
      }

      const response = await postRequest(
        `purchased-electricity/deletePurchasedElectricity/${editingId}`,
        {},
        "Steam record deleted successfully",
        getToken(),
        "delete",
        true,
        "purchasedElectricity"
      );

      if (response.success) {
        toast.success("Steam record deleted successfully");
        const steamTotal = safeLocalStorage.getItem("steamTotal");
        if(steamTotal){
          const steamData = JSON.parse(steamTotal) ||[];
          const index = steamData.findIndex((item:any)=>item._id == editingId);
          steamData.splice(index, 1);
          safeLocalStorage.setItem("steamTotal", JSON.stringify(steamData));
        }
        await getSteamTotal();
      } else {
          return;
      }
    } catch (error: any) {
      return;
    }
  };

  const handleFileSelect = (file: File) => {
    setFormData((prev: any) => ({
      ...prev,
      attachment: file,
    }));
    toast.success(`File "${file.name}" selected successfully`);
  };

  // Helper functions to get names from IDs
  const getFacilityName = (facilityId: string) => {
    if (!facilityId) return "N/A";
    const facility = facilities.find((f) => f._id === facilityId);
    return facility ? facility.facilityName : dataLoaded ? "N/A" : "Loading...";
  };

  const getEnergyTypeName = (energyTypeId: string) => {
    if (!energyTypeId) return "N/A";
    const energyType = energyTypes.find((e) => e._id === energyTypeId);
    return energyType
      ? energyType.energyType
      : dataLoaded
      ? "N/A"
      : "Loading...";
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 10; year--) {
      years.push(year);
    }
    return years;
  };

  const getMonthName = (monthNumber: number | string) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthIndex = parseInt(monthNumber.toString()) - 1;
    return months[monthIndex] || monthNumber;
  };

  const filteredData =
    selectedFacility === "all"
      ? steamData
      : steamData.filter((item) => item.facility === selectedFacility);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <Table
          title="Purchased Steam"
          data={filteredData}
          loading={loading}
          columns={[
            {
              key: "monthYear",
              label: "Month/Year",
              render: (value, row) => (
                <span>
                  {getMonthName(row.month)} {row.year}
                </span>
              ),
            },
            {
              key: "facility",
              label: "Facility",
              render: (value, row) => (
                <span>{getFacilityName(row.facility)}</span>
              ),
            },
            {
              key: "gridLocation",
              label: "Grid Location",
              render: (value, row) => <span>{row.gridLocation}</span>,
            },
            {
              key: "consumedUnits",
              label: "Consumed Units",
              type: "number",
              render: (value, row) => (
                <span>{row.consumedUnits?.toLocaleString()}</span>
              ),
            },
            {
              key: "amountOfConsumption",
              label: "Amount of Consumption",
              type: "number",
              render: (value, row) => (
                <span>{row.amountOfConsumption?.toLocaleString()}</span>
              ),
            },
            {
              key: "emissionFactor",
              label: "Emission Factor",
              render: (value, row) => <span>{row.emissionFactor}</span>,
            },
            {
              key: "totalEmissions",
              label: "Total Emissions",
              render: (value, row) => (
                <span>{row.totalEmissions.toFixed(1)}</span>
              ),
            },
          ]}
          actions={[
            {
              label: "",
              icon: <Edit3 className="w-4 h-4 text-green-500" />,
              onClick: (row) => {
                setShowAttachment(false);
                startEdit(row);
              },
              variant: "primary",
            },
            {
              label: "",
              icon: <Paperclip className="w-4 h-4 text-green-500" />,
              show: (row) => !!(row?.attachment && row.attachment.url),
              onClick: (row) =>{
                if (row?.attachment?.url) {
                  window.open(row.attachment.url, '_blank', 'noopener,noreferrer');
                  return;
                }
              },
              variant: "primary",
            },
           
          ]}
          showAddButton={true}
          addButtonLabel="Add Steam Record"
          onAddClick={() => {
            setShowAttachment(true);
            setShowForm(true);
          }}
          emptyMessage="No steam records found."
          rowKey="_id"
        />
      </div>
      {showForm && (
        <div className="bg-white border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-black">
              {editingItem ? "Edit" : "Add"} Steam Consumption
            </h4>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingItem(null);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month *
                </label>
                <select
                  value={formData.month}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      month: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select Month</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <select
                  value={formData.year}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      year: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select Year</option>
                  {generateYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facility *
                </label>
                <select
                  value={formData.facility}
                  onChange={(e) => {
                    if (e.target.value === "add-facility") {
                      router.push("/dashboard?section=add-facility");
                      return;
                    }
                    setFormData((prev: any) => ({
                      ...prev,
                      facility: e.target.value,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select Facility</option>
                  {facilities.map((facility) => (
                    <option key={facility._id} value={facility._id}>
                      {facility.facilityName}
                    </option>
                  ))}
                  <option value="add-facility" className="text-green-600 font-semibold bg-green-50 border-t border-green-200 py-2">
                       Add New Facility
                  </option>
                </select>
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Energy Type *</label>
                <select
                  value={formData.energyType}
                  onChange={(e) => {
                    const selectedEnergyType = e.target.value;
                    const energyType = energyTypes.find(e => e._id === selectedEnergyType);
                    setFormData((prev: any) => ({
                      ...prev,
                      energyType: selectedEnergyType,
                      // emissionFactor: energyType?.emissionFactorC02?.toString() || ''
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select Energy Type</option>
                  {energyTypes.map((energyType) => (
                    <option key={energyType._id} value={energyType._id}>
                      {energyType.energyType}
                    </option>
                  ))}
                </select>
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grid Location *
                </label>
                <input
                  type="text"
                  value={formData.gridLocation}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      gridLocation: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., Argentina Kwh"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consumed Units *
                </label>
                <input
                  type="number"
                  value={formData.consumedUnits}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      consumedUnits: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount of Consumption *
                </label>
                <input
                  type="number"
                  value={formData.amountOfConsumption}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      amountOfConsumption: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="24"
                  required
                />
              </div>
              {showAttachment&& <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachment (optional)
                </label>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowFileModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D5942] transition-colors"
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    {formData.attachment ? 'Change File' : 'Upload File'}
                  </button>
                  
                  {formData.attachment && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Selected:</span>
                      <span className="text-sm font-medium text-gray-900">{formData.attachment.name}</span>
                      <button
                        type="button"
                        onClick={() => setFormData((prev: any) => ({ ...prev, attachment: "" }))}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>}
              {formData.customEmissionFactor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Emission Factor *
                  </label>
                  <input
                    type="number"
                    value={formData.emissionFactor}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        emissionFactor: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    placeholder="5"
                    required
                  />
                </div>
              )}
              <div className="col-span-2">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="customEmissionFactor"
                    checked={formData.customEmissionFactor}
                    onChange={(e) => {
                      setFormData((prev: any) => ({
                        ...prev,
                        customEmissionFactor: e.target.checked,
                        emissionFactor: e.target.checked
                          ? 0
                          : prev.emissionFactor,
                        // emissionFactor: !e.target.checked ? prev.emissionFactor : 0
                      }));
                    }}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="customEmissionFactor"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Use Custom Emission Factor
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-[#0D5942] text-white rounded-md disabled:opacity-50"
              >
                <span>{loading ? "Saving..." : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={showFileModal}
        onClose={() => setShowFileModal(false)}
        onFileSelect={handleFileSelect}
        acceptedTypes={['.pdf', '.png', '.jpg', '.jpeg', '.csv', '.xlsx', '.xls']}
        maxSize={10}
        title="Upload Attachment"
        description="Drag and drop your file here or click to browse"
      />

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
                <h3 className="text-lg font-semibold text-gray-900">Confirm Action</h3>
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
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scope2SteamEntry;
