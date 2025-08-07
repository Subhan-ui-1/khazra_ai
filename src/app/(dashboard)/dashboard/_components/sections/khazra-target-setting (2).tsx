import { useState, useEffect } from "react";
import { 
  ChevronRight,
  Target,
  TrendingDown,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  BarChart3,
  Settings,
  FileText,
  Calculator,
  Globe,
  Factory,
  Zap,
  Truck,
  Building,
  AlertTriangle,
  Info,
  Award,
  Shield,
  Users,
  Briefcase,
  Activity,
  LineChart,
  MapPin,
  Edit3,
  Trash2,
} from "lucide-react";
import { safeLocalStorage } from "@/utils/localStorage";
import { getRequest, postRequest } from "@/utils/api";
import toast from "react-hot-toast";

const FlexibleTargetPlatform = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentStep, setCurrentStep] = useState(1);
  const [customTargets, setCustomTargets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTargetForm, setShowTargetForm] = useState(false);
  const [editingTarget, setEditingTarget] = useState<any>(null);
  
  const [targetData, setTargetData] = useState({
    // Organization Info
    organizationName: "",
    industry: "",
    headquarters: "",
    revenue: 0,
    employees: 0,
    
    // Target Strategy
    targetCategory: "", // voluntary, regulatory, net_zero, custom
    targetType: "", // absolute, intensity_revenue, intensity_employee, intensity_product
    methodology: "", // custom, regulatory, sectoral, science_based
    ambitionLevel: "", // conservative, moderate, ambitious, transformational
    
    // Scope & Coverage
    scopeCoverage: {
      scope1: true,
      scope2: true,
      scope3: true,
      scope3Categories: [],
    },
    geographicCoverage: "", // global, regional, country, facility
    businessCoverage: 0, // percentage of business operations
    
    // Baseline & Target
    baselineYear: 0,
    baselineEmissions: {
      scope1: 0,
      scope2: 0,
      scope3: 0,
      total: 0,
    },
    targetYear: 0,
    targetValue: 0, // 50% reduction
    targetUnit: "",
    
    // Business Context
    intensityMetrics: {
      revenue: 0,
      employees: 0,
      productUnits: 0,
      floorArea: 0,
    },
    
    // Regulatory Context
    regulations: {
      euTaxonomy: false,
      csrd: false,
      cdp: false,
      tcfd: false,
      localRegulations: [],
    },
    
    // Milestones & Verification
    milestones: [
      { year: 0, target: 0, description: "" },
      { year: 0, target: 0, description: "" },
      { year: 0, target: 0, description: "" },
      { year: 0, target: 0, description: "" },
    ],
    verificationRequired: false,
    verificationFrequency: "",
  });

  // API Functions
  const getToken = () => {
    const tokenData = JSON.parse(safeLocalStorage.getItem("tokens") || "{}");
    return tokenData.accessToken;
  };

  // Fetch custom targets
  const fetchCustomTargets = async () => {
    try {
      const response = await getRequest(
        "custom-targets/getCustomTargets",
        getToken()
      );
      console.log(response, "response...........................");
      if (response.success) {
        setCustomTargets(response.customTargets || []);
      } else {
        // toast.error(response.message || "Failed to fetch custom targets");
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to fetch custom targets");
    }
  };

  // Add custom target
  const addCustomTarget = async () => {
    setLoading(true);
    try {
      const metrics = calculateTargetMetrics();
      const ambition = assessTargetAmbition();
      
      // Convert scope coverage to array format
      const scopeCoverageArray = [];
      if (targetData.scopeCoverage.scope1) scopeCoverageArray.push("Scope 1");
      if (targetData.scopeCoverage.scope2) scopeCoverageArray.push("Scope 2");
      // if (targetData.scopeCoverage.scope3) scopeCoverageArray.push("Scope 3");

      // Get target category and methodology names
      const targetCategoryName =
        targetCategories.find((cat) => cat.value === targetData.targetCategory)
          ?.label || "Voluntary Commitment";
      const methodologyName =
        methodologies.find((meth) => meth.value === targetData.methodology)
          ?.label || "Custom Methodology";

      const requestData = {
        targetCategory: {
          name: targetCategoryName,
          description:
            targetCategories.find(
              (cat) => cat.value === targetData.targetCategory
            )?.desc || "Self-determined sustainability goals",
        },
        methodology: {
          name: methodologyName,
          description:
            methodologies.find((meth) => meth.value === targetData.methodology)
              ?.desc || "Business-specific approach",
        },
        targetType:
          targetData.targetType === "absolute"
            ? "Absolute Reduction"
            : targetData.targetType === "intensity_revenue"
            ? "Intensity per Revenue"
            : targetData.targetType === "intensity_employee"
            ? "Intensity per Employee"
            : "Intensity per Product",
        ambitionLevel:
          targetData.ambitionLevel === "conservative"
            ? "Conservative (1-2% annual)"
            : targetData.ambitionLevel === "moderate"
            ? "Moderate (2-4% annual)"
            : targetData.ambitionLevel === "ambitious"
            ? "Ambitious (4-6% annual)"
            : "Transformational (6%+ annual)",
        scopeCoverage: scopeCoverageArray,
        geographicCoverage:
          targetData.geographicCoverage === "global"
            ? "Global Operations"
            : targetData.geographicCoverage === "regional"
            ? "Regional Operations"
            : targetData.geographicCoverage === "country"
            ? "Country-Specific"
            : "Facility-Level",
        businessCoverage: targetData.businessCoverage,
        baselineYear: targetData.baselineYear,
        targetYear: targetData.targetYear,
        totalEmissions: targetData.baselineEmissions.total,
        targetAnalysis: {
          totalReduction: parseFloat(metrics.totalReduction),
          annualRate: parseFloat(metrics.annualReduction),
          leadingEdge: ambition.level,
        },
      };

      const response = await postRequest(
        "custom-targets/addCustomTarget",
        requestData,
        "Custom target added successfully",
        getToken(),
        "post"
      );

      if (response.success) {
        // toast.success("Custom target added successfully");
        await fetchCustomTargets();
        setActiveTab("dashboard");
        setShowTargetForm(false);
        resetTargetForm();
      } else {
        // toast.error(response.message || "Failed to add custom target");
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to add custom target");
    } finally {
      setLoading(false);
    }
  };

  // Load custom targets on component mount
  useEffect(() => {
    fetchCustomTargets();
  }, []);

  const targetCategories = [
    {
      value: "net_zero",
      label: "Net Zero Commitment",
      desc: "Achieve carbon neutrality",
    },
    {
      value: "custom",
      label: "Custom Strategy",
      desc: "Tailored approach for your business",
    },
  ];

  const methodologies = [
    {
      value: "custom",
      label: "Custom Methodology",
      desc: "Business-specific approach",
    },
    {
      value: "sectoral",
      label: "Sectoral Best Practice",
      desc: "Industry benchmarks",
    },
    {
      value: "regulatory",
      label: "Regulatory Framework",
      desc: "Government guidelines",
    },
    {
      value: "science_based",
      label: "Science-Based Approach",
      desc: "Climate science aligned",
    },
  ];

  // Calculation Functions
  const calculateTargetMetrics = () => {
    const totalReduction =
      ((targetData.baselineEmissions.total - targetData.targetValue) /
        targetData.baselineEmissions.total) *
      100;
    const years = targetData.targetYear - targetData.baselineYear;
    const annualReduction = totalReduction / years;
    
    return {
      totalReduction: totalReduction.toFixed(1),
      annualReduction: annualReduction.toFixed(1),
      absoluteReduction: (
        targetData.baselineEmissions.total - targetData.targetValue
      ).toFixed(0),
      years,
    };
  };

  const assessTargetAmbition = () => {
    const metrics = calculateTargetMetrics();
    const annualRate = parseFloat(metrics.annualReduction);

    if (annualRate < 2)
    return {
        level: "Conservative",
        color: "orange",
        desc: "Below industry average",
      };
    if (annualRate < 4)
      return { level: "Moderate", color: "blue", desc: "Industry aligned" };
    if (annualRate < 6)
      return {
        level: "Ambitious",
        color: "green",
        desc: "Above industry average",
      };
    return { level: "Transformational", color: "purple", desc: "Leading edge" };
  };

  const resetTargetForm = () => {
    setTargetData({
      organizationName: "",
      industry: "",
      headquarters: "",
      revenue: 0,
      employees: 0,
      targetCategory: "",
      targetType: "",
      methodology: "",
      ambitionLevel: "",
      scopeCoverage: {
        scope1: true,
        scope2: true,
        scope3: true,
        scope3Categories: [],
      },
      geographicCoverage: "",
      businessCoverage: 0,
      baselineYear: 0,
      baselineEmissions: {
        scope1: 0,
        scope2: 0,
        scope3: 0,
        total: 0,
      },
      targetYear: 0,
      targetValue: 0,
      targetUnit: "",
      intensityMetrics: {
        revenue: 0,
        employees: 0,
        productUnits: 0,
        floorArea: 0,
      },
      regulations: {
        euTaxonomy: false,
        csrd: false,
        cdp: false,
        tcfd: false,
        localRegulations: [],
      },
      milestones: [
        { year: 0, target: 0, description: "" },
        { year: 0, target: 0, description: "" },
        { year: 0, target: 0, description: "" },
        { year: 0, target: 0, description: "" },
      ],
      verificationRequired: false,
      verificationFrequency: "",
    });
    setCurrentStep(1);
  };

  const steps = [
    { title: "Target Strategy"},
    { title: "Scope & Coverage"},
    { title: "Baseline & Targets"},
    { title: "Review & Deploy"},
  ];

  // Target Setup Form
  const TargetSetupForm = () => (
    <div className="space-y-4">
      {/* Progress Steps */}
      <div className="relative w-full">
        {/* Static gray background line */}
        <div className="absolute top-5.5 left-0 right-0 h-0.5 bg-gray-200 z-0" />

        {/* Dynamic green progress line based on currentStep */}
        <div
          className="absolute top-5.5 left-0 h-0.5 bg-green-500 z-10 transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Step Circles */}
        <div className="flex justify-between items-center relative z-20">
          {steps.map((step, index) => {
            const isActive = currentStep === index + 1;
            const isCompleted = currentStep > index + 1;

            return (
              <div key={index} className="flex items-center">
                <div className={`w-[20px] h-[18px] rounded-full bg-white border-5 ${isActive ? "border-green-500" : isCompleted ? "border-green-600" : "border-gray-300"}`}></div>
                <div
                  className={`w-full h-auto py-2 pe-2 ps-1 flex items-center justify-center text-lg font-semibold bg-white transition-all duration-300 ${
                    isActive
                      ? "border-green-500 text-green-500"
                      : isCompleted
                      ? "border-green-600 text-green-600"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                  <span
                    className={`ms-1 text-sm ${
                      isActive 
                      ? "text-green-500"
                      : isCompleted
                      ? "text-green-600"
                      : " text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Target Strategy */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">
                Target Strategy & Approach
              </h3>
            </div>
            
            {/* Target Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-green-700 mb-3">
                Target Category *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {targetCategories.map((category) => (
                  <div
                    key={category.value}
                    onClick={() =>
                      setTargetData((prev) => ({
                        ...prev,
                        targetCategory: category.value,
                      }))
                    }
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      targetData.targetCategory === category.value
                        ? "border-green-500 bg-white"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {category.label}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {category.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Methodology Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-green-700 mb-3">
                Methodology *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {methodologies.map((method) => (
                  <div
                    key={method.value}
                    onClick={() =>
                      setTargetData((prev) => ({
                        ...prev,
                        methodology: method.value,
                      }))
                    }
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      targetData.methodology === method.value
                        ? "border-green-500 bg-white"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {method.label}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {method.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Target Type *
                </label>
                <select
                  value={targetData.targetType}
                  onChange={(e) =>
                    setTargetData((prev) => ({
                      ...prev,
                      targetType: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="absolute">Absolute Reduction</option>
                  <option value="intensity_revenue">
                    Intensity per Revenue
                  </option>
                  <option value="intensity_employee">
                    Intensity per Employee
                  </option>
                  <option value="intensity_product">
                    Intensity per Product
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Ambition Level
                </label>
                <select
                  value={targetData.ambitionLevel}
                  onChange={(e) =>
                    setTargetData((prev) => ({
                      ...prev,
                      ambitionLevel: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="conservative">
                    Conservative (1-2% annual)
                  </option>
                  <option value="moderate">Moderate (2-4% annual)</option>
                  <option value="ambitious">Ambitious (4-6% annual)</option>
                  <option value="transformational">
                    Transformational (6%+ annual)
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Scope & Coverage */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">
                Scope Coverage & Boundaries
              </h3>
            </div>
            
            {/* Emission Scopes */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="scope1"
                    checked={targetData.scopeCoverage.scope1}
                    onChange={(e) =>
                      setTargetData((prev) => ({
                        ...prev,
                        scopeCoverage: {
                          ...prev.scopeCoverage,
                          scope1: e.target.checked,
                        },
                      }))
                    }
                    className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <Factory className="w-5 h-5 text-orange-600" />
                  <label
                    htmlFor="scope1"
                    className="font-medium text-orange-900"
                  >
                    Scope 1
                  </label>
                </div>
                <p className="text-sm text-orange-700">
                  Direct emissions from owned/controlled sources
                </p>
                <div className="mt-2 text-xs text-orange-600">
                  • On-site combustion
                  <br />
                  • Company vehicles
                  <br />• Process emissions
                </div>
              </div>

              <div className="border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="scope2"
                    checked={targetData.scopeCoverage.scope2}
                    onChange={(e) =>
                      setTargetData((prev) => ({
                        ...prev,
                        scopeCoverage: {
                          ...prev.scopeCoverage,
                          scope2: e.target.checked,
                        },
                      }))
                    }
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Zap className="w-5 h-5 text-blue-600" />
                  <label htmlFor="scope2" className="font-medium text-blue-900">
                    Scope 2
                  </label>
                </div>
                <p className="text-sm text-blue-700">
                  Indirect emissions from purchased energy
                </p>
                <div className="mt-2 text-xs text-blue-600">
                  • Purchased electricity
                  <br />
                  • Purchased steam
                  <br />• Heating & cooling
                </div>
              </div>
            </div>

            {/* Coverage Parameters */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Geographic Coverage
                </label>
                <select
                  value={targetData.geographicCoverage}
                  onChange={(e) =>
                    setTargetData((prev) => ({
                      ...prev,
                      geographicCoverage: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="global">Global Operations</option>
                  <option value="regional">Regional Operations</option>
                  <option value="country">Country-Specific</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Baseline & Targets */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-white border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">
                Baseline Data & Target Setting
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Baseline Year
                </label>
                <select
                  value={targetData.baselineYear}
                  onChange={(e) =>
                    setTargetData((prev) => ({
                      ...prev,
                      baselineYear: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Target Year
                </label>
                <select
                  value={targetData.targetYear}
                  onChange={(e) =>
                    setTargetData((prev) => ({
                      ...prev,
                      targetYear: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {[
                    2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034,
                    2035, 2040, 2045, 2050,
                  ].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Baseline Emissions */}
            <div className="mb-6">
              <div className="grid grid-cols-4 gap-4">
                {targetData.scopeCoverage.scope1 && (
                  <div>
                    <label className="block text-sm text-orange-700 mb-1">
                      Scope 1
                    </label>
                    <input
                      type="number"
                      value={targetData.baselineEmissions.scope1}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setTargetData((prev) => ({
                          ...prev,
                          baselineEmissions: {
                            ...prev.baselineEmissions,
                            scope1: value,
                            total: value + prev.baselineEmissions.scope2,
                          },
                        }));
                      }}
                      className="w-full px-3 py-2 border border-orange-300 rounded-md focus:ring-orange-500"
                    />
                  </div>
                )}

                {targetData.scopeCoverage.scope2 && (
                  <div>
                    <label className="block text-sm text-blue-700 mb-1">
                      Scope 2
                    </label>
                    <input
                      type="number"
                      value={targetData.baselineEmissions.scope2}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setTargetData((prev) => ({
                          ...prev,
                          baselineEmissions: {
                            ...prev.baselineEmissions,
                            scope2: value,
                            total: prev.baselineEmissions.scope1 + value,
                          },
                        }));
                      }}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Total
                  </label>
                  <input
                    type="number"
                    value={targetData.baselineEmissions.total}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Target Setting */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-green-700 mb-2">
                Target Emissions ({targetData.targetYear})
              </label>
              <input
                type="number"
                value={targetData.targetValue}
                onChange={(e) =>
                  setTargetData((prev) => ({
                    ...prev,
                    targetValue: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Target Analysis */}
            {targetData.baselineEmissions.total && targetData.targetValue && (
              <div className="bg-white border border-green-200 rounded-lg p-6">
                <h4 className="font-medium text-green-900 mb-4">
                  Target Analysis
                </h4>
                
                {(() => {
                  const metrics = calculateTargetMetrics();
                  const ambition = assessTargetAmbition();
                  
                  return (
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-700">
                          {metrics.totalReduction}%
                        </div>
                        <div className="text-sm text-green-600">
                          Total Reduction
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-700">
                          {metrics.annualReduction}%
                        </div>
                        <div className="text-sm text-green-600">
                          Annual Rate
                        </div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold text-${ambition.color}-700`}
                        >
                          {ambition.level}
                        </div>
                        <div className="text-sm text-green-600">
                          {ambition.desc}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Review & Deploy */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="bg-white border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">
                Review & Deploy Target
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-medium text-green-900">
                  Target Configuration
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Organization:</span>
                    <span className="font-medium text-green-900">
                      {targetData.organizationName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Category:</span>
                    <span className="font-medium text-green-900 capitalize">
                      {targetData.targetCategory.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Methodology:</span>
                    <span className="font-medium text-green-900 capitalize">
                      {targetData.methodology.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Type:</span>
                    <span className="font-medium text-green-900 capitalize">
                      {targetData.targetType.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Coverage:</span>
                    <span className="font-medium text-green-900">
                      {targetData.businessCoverage}% of operations
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-green-900">Target Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">
                      Baseline ({targetData.baselineYear}):
                    </span>
                    <span className="font-medium text-green-900">
                      {targetData.baselineEmissions.total.toLocaleString()}{" "}
                      tCO₂e
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">
                      Target ({targetData.targetYear}):
                    </span>
                    <span className="font-medium text-green-900">
                      {targetData.targetValue.toLocaleString()} tCO₂e
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Reduction:</span>
                    <span className="font-medium text-green-600">
                      {calculateTargetMetrics().totalReduction}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Annual Rate:</span>
                    <span className="font-medium text-green-600">
                      {calculateTargetMetrics().annualReduction}%/year
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Ambition:</span>
                    <span className="font-medium text-green-600">
                      {assessTargetAmbition().level}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scope Coverage Summary */}
            <div className="mt-6 pt-6 border-t border-green-200">
              <h4 className="font-medium text-green-900 mb-3">
                Scope Coverage
              </h4>
              <div className="flex space-x-6">
                {targetData.scopeCoverage.scope1 && (
                  <div className="flex items-center space-x-2">
                    <Factory className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-700 font-medium">Scope 1</span>
                    <span className="text-sm text-green-600">
                      ({targetData.baselineEmissions.scope1.toLocaleString()}{" "}
                      tCO₂e)
                    </span>
                  </div>
                )}
                {targetData.scopeCoverage.scope2 && (
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 font-medium">Scope 2</span>
                    <span className="text-sm text-green-600">
                      ({targetData.baselineEmissions.scope2.toLocaleString()}{" "}
                      tCO₂e)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between p-4 border-t border-gray-200">
        <button
          onClick={() => {
            if (currentStep === 1) {
              setActiveTab("dashboard");
            } else {
              setCurrentStep(Math.max(1, currentStep - 1));
            }
          }}
          className="flex items-center space-x-2 px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{currentStep === 1 ? "Back" : "Previous"}</span>
        </button>
        
        {currentStep < 4 ? (
          <button
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            className="flex items-center space-x-2 px-6 py-3 bg-[#0D5942] text-white rounded-lg "
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={addCustomTarget}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-[#0D5942] text-white rounded-lg  disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{loading ? "Deploying..." : "Deploy Target"}</span>
          </button>
        )}
      </div>
    </div>
  );

  // Target Dashboard
  const TargetDashboard = () => {
    const metrics = calculateTargetMetrics();
    const ambition = assessTargetAmbition();
    
    return (
      <div className="space-y-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs font-semibold text-black opacity-70 uppercase tracking-wider mb-2">
                  Current Emissions
                </div>
                <div className="text-3xl font-bold text-black mb-2">
                  {customTargets.length > 0
                    ? customTargets[0].totalEmissions
                    : "0"}
                </div>
                <div className="text-sm text-black mb-2">tCO₂e (2024)</div>
                <div className="text-xs text-black opacity-60">
                  Baseline year emissions
                </div>
              </div>
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl">
                📊
              </div>
            </div>
          </div>

          <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs font-semibold text-black opacity-70 uppercase tracking-wider mb-2">
                  Annual Reduction
                </div>
                <div className="text-3xl font-bold text-black mb-2">
                  {customTargets.length > 0
                    ? customTargets[0].targetAnalysis.totalReduction
                    : "0"}
                  %
                </div>
                <div className="text-sm text-black mb-2">per year</div>
                <div className="text-xs text-black opacity-60">
                  Target reduction rate
                </div>
              </div>
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl">
                📉
              </div>
            </div>
          </div>

          <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs font-semibold text-black opacity-70 uppercase tracking-wider mb-2">
                  Ambition Level
                </div>
                <div className="text-3xl font-bold text-black mb-2">
                  {ambition.level.split(" ")[0]}
                </div>
                <div className="text-sm text-black mb-2">{ambition.desc}</div>
                <div className="text-xs text-black opacity-60">
                  Target classification
                </div>
              </div>
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl">
                🏆
              </div>
            </div>
          </div>
        </div>

        {/* Custom Targets Table */}
        <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-black">Custom Targets</h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Target Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Methodology
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Scope Coverage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reduction Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Timeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customTargets.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium">
                          No custom targets yet
                        </p>
                        <p className="text-sm">
                          Create your first carbon reduction target to get
                          started
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  customTargets.map((target, index) => (
                    <tr key={target._id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {target.targetCategory.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {target.targetType}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {target.methodology.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {target.scopeCoverage.join(", ")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {target.targetAnalysis.totalReduction}% reduction
                        </div>
                        <div className="text-xs text-gray-500">
                          {target.baselineYear} → {target.targetYear}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {target.baselineYear} - {target.targetYear}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-lg ${
                            target.targetAnalysis.leadingEdge ===
                            "Transformational"
                              ? "bg-purple-100 text-purple-700"
                              : target.targetAnalysis.leadingEdge ===
                                "Ambitious"
                              ? "bg-green-100 text-green-700"
                              : target.targetAnalysis.leadingEdge === "Moderate"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {target.targetAnalysis.leadingEdge}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingTarget(target);
                              setShowTargetForm(true);
                            }}
                            className="text-green-600 hover:text-[#0D5942]"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-green-100 pb-6 flex justify-between items-center">
        <div>          
          <h1 className="text-3xl font-bold text-black mb-4">
            Carbon Target Setting
          </h1>
          <p className="text-black opacity-70 max-w-4xl leading-relaxed">
            Set and manage your organization's carbon reduction targets with
            flexible methodologies, track progress, and implement reduction
            initiatives to achieve your sustainability goals.
          </p>
        </div>
        {/* Navigation Buttons */}
        <div className="flex justify-end items-center">
          {activeTab !== "setup" && (
            <button
              onClick={() => setActiveTab("setup")}
              className="bg-[#0D5942]  text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              <span>Setup New Target</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="">
          {activeTab === "setup" && <TargetSetupForm />}
          {activeTab === "dashboard" && <TargetDashboard />}
        </div>
      </div>

      {/* Target Form Modal */}
      {showTargetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingTarget ? "Edit Target" : "Add Custom Target"}
              </h3>
              <button
                onClick={() => {
                  setShowTargetForm(false);
                  setEditingTarget(null);
                  resetTargetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <TargetSetupForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default FlexibleTargetPlatform; 