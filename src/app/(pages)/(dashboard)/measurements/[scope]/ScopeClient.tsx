'use client';

import Scope1 from '../_components/scope1/Scope1';

export default function ScopeClient({ scope }: { scope: string }) {
    const renderScope = () => {
        switch (scope) {
        case 'scope1':
            return <Scope1 />;
        default:
            return <div className="p-4">Coming soon</div>;
        }
    };

    return <div>{renderScope()}</div>;
}
