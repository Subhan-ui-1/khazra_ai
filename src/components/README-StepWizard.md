# StepWizard Component

A professional, reusable step-by-step wizard component for React applications that provides a clean interface for managing multi-step processes with navigation, progress tracking, and completion handling.

## Features

- 🎯 **Professional Design**: Clean, modern UI with smooth animations and transitions
- 📊 **Progress Tracking**: Visual progress bar and step indicators
- ✅ **Step Validation**: Built-in validation support with custom error messages
- 🧭 **Flexible Navigation**: Configurable step navigation and skipping
- 🎨 **Customizable**: Extensive customization options for styling and behavior
- 📱 **Responsive**: Mobile-friendly design with responsive layouts
- ♿ **Accessible**: Proper ARIA labels and keyboard navigation support

## Installation

The component is already included in your project. Simply import it:

```tsx
import StepWizard, { Step } from '@/components/StepWizard';
```

## Basic Usage

```tsx
import React, { useState } from 'react';
import StepWizard, { Step } from '@/components/StepWizard';

const MyWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps: Step[] = [
    {
      id: 1,
      title: 'Step 1',
      description: 'First step description',
    },
    {
      id: 2,
      title: 'Step 2',
      description: 'Second step description',
    },
    {
      id: 3,
      title: 'Step 3',
      description: 'Final step description',
    },
  ];

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleComplete = () => {
    console.log('Wizard completed!');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <div>Step 1 content</div>;
      case 2:
        return <div>Step 2 content</div>;
      case 3:
        return <div>Step 3 content</div>;
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <StepWizard
      steps={steps}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      onComplete={handleComplete}
      stepContent={renderStepContent()}
    />
  );
};
```

## Props Interface

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `steps` | `Step[]` | Array of step configurations |
| `currentStep` | `number` | Current active step (1-based) |
| `onStepChange` | `(step: number) => void` | Callback when step changes |
| `onComplete` | `() => void` | Callback when wizard completes |
| `stepContent` | `React.ReactNode` | Content to display for current step |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCancel` | `() => void` | - | Callback for cancel action |
| `showStepNumbers` | `boolean` | `true` | Show step numbers in overview |
| `showProgressBar` | `boolean` | `true` | Show progress bar |
| `allowStepNavigation` | `boolean` | `true` | Allow clicking on steps to navigate |
| `className` | `string` | `''` | Additional CSS classes |
| `isLoading` | `boolean` | `false` | Show loading state |
| `canProceed` | `boolean` | `true` | Enable/disable next button |
| `canGoBack` | `boolean` | `true` | Enable/disable back button |
| `nextButtonText` | `string` | `'Next'` | Text for next button |
| `backButtonText` | `string` | `'Back'` | Text for back button |
| `completeButtonText` | `string` | `'Complete'` | Text for complete button |
| `showCancelButton` | `boolean` | `false` | Show cancel button |
| `cancelButtonText` | `string` | `'Cancel'` | Text for cancel button |
| `stepValidation` | `(step: number) => boolean \| string` | - | Validation function |
| `onStepValidation` | `(step: number, isValid: boolean, error?: string) => void` | - | Validation callback |

## Step Configuration

Each step in the `steps` array can have the following properties:

```tsx
interface Step {
  id: string | number;           // Unique identifier
  title: string;                 // Step title
  description?: string;          // Optional description
  icon?: React.ReactNode;        // Custom icon component
  status?: 'pending' | 'active' | 'completed' | 'error';  // Step status
  isOptional?: boolean;          // Mark step as optional
  canSkip?: boolean;             // Allow skipping this step
}
```

## Validation

The component supports step validation through the `stepValidation` prop:

```tsx
const validateStep = (step: number): boolean | string => {
  switch (step) {
    case 1:
      if (!formData.name) return 'Name is required';
      if (!formData.email) return 'Email is required';
      return true; // Step is valid
    case 2:
      if (!formData.company) return 'Company is required';
      return true;
    default:
      return true;
  }
};

<StepWizard
  // ... other props
  stepValidation={validateStep}
  onStepValidation={(step, isValid, error) => {
    console.log(`Step ${step}: ${isValid ? 'Valid' : 'Invalid'} - ${error}`);
  }}
/>
```

## Integration with Existing Code

To integrate with your existing `khazra-target-setting (2).tsx` file:

### 1. Replace the existing step logic:

```tsx
// Instead of managing steps manually, use StepWizard
const [currentStep, setCurrentStep] = useState(1);

const steps: Step[] = [
  {
    id: 1,
    title: 'Target Strategy',
    description: 'Define your target approach and methodology',
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: 2,
    title: 'Scope & Coverage',
    description: 'Select emission scopes and coverage boundaries',
    icon: <Globe className="w-5 h-5" />,
  },
  {
    id: 3,
    title: 'Baseline & Targets',
    description: 'Set baseline data and target values',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    id: 4,
    title: 'Review & Deploy',
    description: 'Review configuration and deploy target',
    icon: <CheckCircle className="w-5 h-5" />,
  },
];
```

### 2. Replace the existing step rendering:

```tsx
// Instead of multiple conditional renders, use a single function
const renderStepContent = () => {
  switch (currentStep) {
    case 1:
      return <TargetStrategyStep targetData={targetData} setTargetData={setTargetData} />;
    case 2:
      return <ScopeCoverageStep targetData={targetData} setTargetData={setTargetData} />;
    case 3:
      return <BaselineTargetsStep targetData={targetData} setTargetData={setTargetData} />;
    case 4:
      return <ReviewDeployStep targetData={targetData} />;
    default:
      return <div>Step not found</div>;
  }
};
```

### 3. Use the StepWizard component:

```tsx
// Replace the existing TargetSetupForm with StepWizard
const TargetSetupForm = () => (
  <StepWizard
    steps={steps}
    currentStep={currentStep}
    onStepChange={setCurrentStep}
    onComplete={addCustomTarget}
    onCancel={() => {
      setActiveTab("dashboard");
      resetTargetForm();
    }}
    stepContent={renderStepContent()}
    stepValidation={validateStep}
    showCancelButton={true}
    cancelButtonText="Back to Dashboard"
    nextButtonText="Continue"
    completeButtonText="Deploy Target"
    isLoading={loading}
    canProceed={canProceedToNextStep()}
  />
);
```

## Customization Examples

### Custom Styling

```tsx
<StepWizard
  // ... other props
  className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-xl"
  showProgressBar={true}
  showStepNumbers={true}
/>
```

### Conditional Navigation

```tsx
<StepWizard
  // ... other props
  canProceed={currentStep === 1 ? !!targetData.targetCategory : true}
  canGoBack={currentStep > 1}
  allowStepNavigation={false} // Disable clicking on steps
/>
```

### Custom Button Text

```tsx
<StepWizard
  // ... other props
  nextButtonText="Save & Continue"
  backButtonText="Go Back"
  completeButtonText="Submit Target"
  cancelButtonText="Cancel Setup"
/>
```

## Styling

The component uses Tailwind CSS classes and can be customized through:

1. **Props**: Use `className` prop for additional styling
2. **CSS Variables**: Override default colors and spacing
3. **Tailwind Config**: Extend the design system

## Accessibility Features

- Proper ARIA labels for screen readers
- Keyboard navigation support
- Focus management between steps
- Semantic HTML structure
- Color contrast compliance

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- React 16.8+ (hooks support required)
- TypeScript support included

## Performance Considerations

- Memoized step content rendering
- Efficient state updates
- Minimal re-renders
- Optimized animations

## Troubleshooting

### Common Issues

1. **Steps not updating**: Ensure `currentStep` state is properly managed
2. **Validation not working**: Check that `stepValidation` returns correct values
3. **Styling conflicts**: Use `className` prop to override default styles
4. **Navigation issues**: Verify `allowStepNavigation` and step permissions

### Debug Mode

Enable console logging for debugging:

```tsx
<StepWizard
  // ... other props
  onStepValidation={(step, isValid, error) => {
    console.log(`Step ${step} validation:`, { isValid, error });
  }}
/>
```

## Examples

See `StepWizardExample.tsx` for a complete working example that demonstrates:

- Step configuration
- Form validation
- Data management
- Custom styling
- Integration patterns

## Support

For questions or issues, refer to the component code or create an issue in your project repository.
