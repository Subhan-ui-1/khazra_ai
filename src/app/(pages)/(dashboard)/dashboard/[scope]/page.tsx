// /app/dashboard/[scope]/page.tsx
import ScopeClient from './ScopeClient';

export default function SectionScopePage({ params }: { params: { scope: string } }) {
  return <ScopeClient scope={params.scope} />;
}

export async function generateStaticParams() {
  return [
    { scope: 'scope1' },
    { scope: 'scope2' },
    { scope: 'scope3' },
  ];
}
