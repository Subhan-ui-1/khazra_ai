import React, { useState, useEffect } from 'react';
import { Plus, X, Edit3, Trash2, Thermometer } from 'lucide-react';
import { getRequest, postRequest } from "@/utils/api";
import toast from "react-hot-toast";
import { safeLocalStorage } from '@/utils/localStorage';
import Table from "@/components/Table";

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
}

const Scope2SteamEntry: React.FC = () => {
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [steamData, setSteamData] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Dropdown data states
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [energyTypes, setEnergyTypes] = useState<EnergyType[]>([]);

  const [formData, setFormData] = useState<SteamFormData>({
    month: '',
    year: '',
    facility: '',
    energyType: '',
    gridLocation: '',
    consumedUnits: '',
    amountOfConsumption: '',
    emissionFactor: '',
    customEmissionFactor: false
  });

  const getToken = () => {
    const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
    return tokenData.accessToken;
  };

  // Fetch dropdown data
  const fetchFacilities = async () => {
    try {
      const response = await getRequest("facilities/getFacilities?status=Active", getToken());
      if (response.success) {
        setFacilities(response.data.facilities || []);
      } else {
        // toast.error(response.message || "Failed to fetch facilities");
        console.log(response, 'response')
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to fetch facilities");
      console.log(error, 'error')
    }
  };

  const fetchEnergyTypes = async () => {
    try {
      const response = await getRequest("energy-types/getEnergyTypes", getToken());
      if (response.success) {
        setEnergyTypes(response.data.energyTypes || []);
      } else {
        // toast.error(response.message || "Failed to fetch energy types");
        console.log(response, 'response')
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to fetch energy types");
      console.log(error, 'error')
    }
  };

  const getSteamTotal = async () => {
    try {
      const response = await getRequest("purchased-electricity/getPurchasedElectricity?scopeType=steam", getToken());
      if (response.success) {
        setSteamData(response.data.purchasedElectricity || []);
      } else {
        // toast.error(response.message || "Failed to fetch steam data");
        console.log(response, 'response')
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to fetch steam data");
      console.log(error, 'error')
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
          getSteamTotal()
        ]);
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const energyType = energyTypes.find(e => e.energyType === "Purchased Steam")
      // Prepare the data according to the API specification
      const requestData = {
        
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        facility: formData.facility,
        energyType: energyType?._id,
        gridLocation: formData.gridLocation,
        consumedUnits: parseFloat(formData.consumedUnits),
        amountOfConsumption: parseFloat(formData.amountOfConsumption),
        emissionFactor: formData.customEmissionFactor
        ? parseFloat(formData.emissionFactor)
        : parseFloat(energyType?.emissionFactorC02?.toString() || ""),
      };

      if (editingItem) {
        // Update existing record
        const editingId = editingItem?._id || editingItem?.id;
        
        if (!editingId) {
          // toast.error("No item ID found for editing");
          console.log("No item ID found for editing")
          return;
        }

        const response = await postRequest(
          `purchased-electricity/updatePurchasedElectricity/${editingId}`,
          requestData,
          '',
          getToken(),
          "put",
          true, 
          'purchasedElectricity'
        );

        if (response.success) {
          toast.success("Steam data updated successfully");
          await getSteamTotal();
          setShowForm(false);
          setEditingItem(null);
          resetForm();
        } else {
          // toast.error(response.message || "Failed to update steam data");
          console.log(response, 'response')
        }
      } else {
        // Add new record
        const response = await postRequest(
          "purchased-electricity/addPurchasedElectricity",
          {...requestData,  scope: "scope2",
            scopeType: "steam",},
            '',
          getToken(),
          "post",
          true, 
          'purchasedElectricity'
        );

        if (response.success) {
          toast.success("Steam data added successfully");
          await getSteamTotal();
          setShowForm(false);
          resetForm();
        } else {
          // toast.error(response.message || "Failed to add steam data");
          console.log(response, 'response')
        }
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to save steam data");
      console.log(error, 'error')
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      month: '',
      year: '',
      facility: '',
      energyType: '',
      gridLocation: '',
      consumedUnits: '',
      amountOfConsumption: '',
      emissionFactor: '',
      customEmissionFactor: false
    });
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      month: item.month?.toString() || '',
      year: item.year?.toString() || '',
      facility: item.facility || '',
      energyType: item.energyType || '',
      gridLocation: item.gridLocation || '',
      consumedUnits: item.consumedUnits?.toString() || '',
      amountOfConsumption: item.amountOfConsumption?.toString() || '',
      emissionFactor: item.emissionFactor?.toString() || '',
      customEmissionFactor: false
    });
    setShowForm(true);
  };

  useEffect(() => {
    if (showForm) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [showForm]);

  const deleteRecord = async (item: any) => {
    try {
      const editingId = item?._id || item?.id;
      
      if (!editingId) {
        // toast.error("No item ID found for deletion");
        console.log("No item ID found for deletion")
        return;
      }

      const response = await postRequest(
        `purchased-electricity/deletePurchasedElectricity/${editingId}`,
        {},
        "Steam record deleted successfully",
        getToken(),
        "delete",
        true,
        'purchasedElectricity'
      );

      if (response.success) {
        toast.success("Steam record deleted successfully");
        await getSteamTotal();
      } else {
        //  toast.error(response.message || "Failed to delete steam record");
        console.log(response, 'response')
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to delete steam record");
      console.log(error, 'error')
    }
  };

  // Helper functions to get names from IDs
  const getFacilityName = (facilityId: string) => {
    if (!facilityId) return "N/A";
    const facility = facilities.find(f => f._id === facilityId);
    return facility ? facility.facilityName : (dataLoaded ? "N/A" : "Loading...");
  };

  const getEnergyTypeName = (energyTypeId: string) => {
    if (!energyTypeId) return "N/A";
    const energyType = energyTypes.find(e => e._id === energyTypeId);
    return energyType ? energyType.energyType : (dataLoaded ? "N/A" : "Loading...");
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
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = parseInt(monthNumber.toString()) - 1;
    return months[monthIndex] || monthNumber;
  };

  const filteredData = selectedFacility === 'all'
    ? steamData
    : steamData.filter(item => item.facility === selectedFacility);

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
              render: (value, row) => <span>{getFacilityName(row.facility)}</span>,
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
          ]}
          actions={[
            {
              label: "",
              icon: <Edit3 className="w-4 h-4 text-green-500" />,
              onClick: (row) => startEdit(row),
              variant: "primary",
            },
          ]}
          showAddButton={true}
          addButtonLabel="Add Steam Record"
          onAddClick={() => setShowForm(true)}
          emptyMessage="No steam records found."
          rowKey="_id"
        />
      </div>
      {showForm && (
        <div className="bg-white border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-black">
              {editingItem ? 'Edit' : 'Add'} Steam Consumption
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Month *</label>
                <select
                  value={formData.month}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, month: e.target.value }))}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, year: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select Year</option>
                  {generateYearOptions().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facility *</label>
                <select
                  value={formData.facility}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, facility: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select Facility</option>
                  {facilities.map((facility) => (
                    <option key={facility._id} value={facility._id}>
                      {facility.facilityName}
                    </option>
                  ))}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Grid Location *</label>
                <input
                  type="text"
                  value={formData.gridLocation}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, gridLocation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., Argentina Kwh"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consumed Units *</label>
                <input
                  type="number"
                  value={formData.consumedUnits}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, consumedUnits: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount of Consumption *</label>
                <input
                  type="number"
                  value={formData.amountOfConsumption}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, amountOfConsumption: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="24"
                  required
                />
              </div>
              {formData.customEmissionFactor && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Emission Factor *</label>
                    <input
                      type="number"
                      value={formData.emissionFactor}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, emissionFactor: e.target.value }))}
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
                      console.log(e.target.checked, 'checked')
                      setFormData((prev: any) => ({ 
                      ...prev, 
                      customEmissionFactor: e.target.checked,
                      emissionFactor: e.target.checked ?0: prev.emissionFactor,
                      // emissionFactor: !e.target.checked ? prev.emissionFactor : 0
                    }))}}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="customEmissionFactor" className="ml-2 block text-sm text-gray-700">
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
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Scope2SteamEntry; 