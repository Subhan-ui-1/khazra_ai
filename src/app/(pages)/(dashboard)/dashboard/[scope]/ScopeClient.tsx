// /app/dashboard/[scope]/ScopeClient.tsx
'use client';

import Scope1 from '../_components/scope1/Scope1';
import Scope2 from '../_components/scope2/Scope2';
import Scope3 from '../_components/scope3/Scope3';

export default function ScopeClient({ scope }: { scope: string }) {
  const renderScope = () => {
    switch (scope) {
      case 'scope1':
        return <Scope1 />;
      case 'scope2':
        return <Scope2 />;
      case 'scope3':
        return <Scope3 />;
      default:
        return <div className="p-4">Invalid Scope</div>;
    }
  };

  return <div>{renderScope()}</div>;
}
