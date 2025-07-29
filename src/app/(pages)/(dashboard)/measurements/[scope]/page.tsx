import ScopeClient from './ScopeClient';

export default function SectionScopePage({ params }: { params: { scope: string } }) {
  return <ScopeClient scope={params.scope} />;
}

// ✅ Server-side static generation
export async function generateStaticParams() {
  return [
    { scope: 'scope1' },
    // add other scopes here
  ];
}
