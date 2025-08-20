# Step-by-Step Onboarding Implementation

## Overview
This implementation adds a step-by-step onboarding system that appears when users are logged in but haven't completed their organization setup. The system guides users through setting up their organization boundaries, departments, facilities, vehicles, and equipment.

## How It Works

### 1. Automatic Detection
- When a user accesses the dashboard, the system automatically checks if they have completed the required setup
- Required steps: Boundary, Departments, Facilities
- Optional steps: Vehicles, Equipment
- If setup is incomplete, users are redirected to `/dashboard/steps`

### 2. Step Flow
The onboarding process follows this sequence:
1. **Add Boundary** - Set up organization boundaries and baseline information
2. **Add Departments** - Create organizational structure
3. **Add Facilities** - Add organization locations (only if user selected "Yes" for facilities)
4. **Add Vehicles** - Register fleet vehicles for emissions tracking (only if user selected "Yes" for vehicles)
5. **Add Equipment** - Add equipment and machinery for emissions calculation (only if user selected "Yes" for equipment)

**Dynamic Step Visibility:** Steps 3-5 are dynamically shown/hidden based on the user's responses in the boundary form. If a user indicates they don't have facilities, vehicles, or equipment, those steps will not appear in the onboarding process.

### 3. Smart Navigation
- Users can navigate between steps using Previous/Next buttons
- Optional steps can be skipped if not applicable
- Automatic progression to the next step after completion
- Progress tracking with visual indicators

## Files Modified

### New Files Created
- `src/app/(dashboard)/dashboard/steps/page.tsx` - Main steps page
- `src/app/(dashboard)/dashboard/steps/layout.tsx` - Steps layout

### Files Modified
- `src/app/(dashboard)/dashboard/page.tsx` - Added setup completion check
- `src/app/(dashboard)/dashboard/_components/sections/AddBoundarySection.tsx` - Added onComplete callback
- `src/app/(dashboard)/dashboard/_components/sections/AddDepartmentSection.tsx` - Added onComplete callback
- `src/app/(dashboard)/dashboard/_components/sections/AddFacilitySection.tsx` - Added onComplete callback
- `src/app/(dashboard)/dashboard/_components/sections/AddVehicleSection.tsx` - Added onComplete callback
- `src/app/(dashboard)/dashboard/_components/sections/AddEquipmentSection.tsx` - Added onComplete callback

## Key Features

### Progress Tracking
- Visual progress bar showing completion percentage
- Step-by-step progress indicators
- Completed step highlighting

### User Experience
- Welcome message and clear instructions
- Automatic step progression
- Success notifications
- Skip options for optional steps
- Responsive design for all screen sizes

### Error Handling
- Graceful fallback for API failures
- User-friendly error messages
- Automatic retry mechanisms

## API Integration

### Setup Status Check
The system checks setup completion by calling:
- `dashboard/getDashboardData` - For boundary, facilities, vehicles, equipment
- `departments/getDepartments` - For department verification

### Step Completion
Each component now accepts an `onComplete` callback that:
- Shows success message
- Refreshes setup status
- Automatically progresses to next step
- Redirects to dashboard when all required steps are complete

## Configuration

### Required vs Optional Steps
```typescript
// Dynamic steps based on boundary responses
const getSteps = (boundaryData?: BoundaryData) => [
  { id: 'boundary', required: true },
  { id: 'departments', required: true },
  { id: 'facilities', required: boundaryData?.hasFacilities === 'Yes', show: boundaryData?.hasFacilities === 'Yes' },
  { id: 'vehicles', required: false, show: boundaryData?.hasVehicles === 'Yes' },
  { id: 'equipment', required: false, show: boundaryData?.hasEquipment === 'Yes' }
];
```

### Setup Completion Logic
```typescript
// Setup is complete if boundary, departments, and all applicable steps are done
const isSetupComplete = hasBoundary && hasDepartments && facilitiesComplete && vehiclesComplete && equipmentComplete;

// Where each step completion is conditional:
const facilitiesComplete = !hasFacilities || (hasFacilities && facilitiesExist);
const vehiclesComplete = !hasVehicles || (hasVehicles && vehiclesExist);
const equipmentComplete = !hasEquipment || (hasEquipment && equipmentExist);
```

## Usage

### For Users
1. Login to the system
2. If setup is incomplete, automatically redirected to steps page
3. Complete each step in sequence
4. Skip optional steps if not applicable
5. Automatically redirected to dashboard upon completion

### For Developers
1. Add new required steps by updating the `steps` array
2. Modify step requirements by changing the `required` property
3. Customize step completion logic in `checkSetupStatus`
4. Add new components by following the existing pattern

## Benefits

1. **Improved User Onboarding** - Clear, guided setup process
2. **Reduced User Confusion** - Step-by-step guidance
3. **Flexible Configuration** - Optional steps for different organization types
4. **Better Data Quality** - Ensures required information is collected
5. **Professional Appearance** - Polished, modern interface

## Future Enhancements

1. **Step Validation** - Add validation before allowing step completion
2. **Custom Steps** - Allow organizations to add custom setup steps
3. **Progress Persistence** - Save progress across sessions
4. **Step Dependencies** - Make certain steps dependent on others
5. **Multi-language Support** - Internationalization for global users
