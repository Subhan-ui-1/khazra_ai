'use client';
interface ViewEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    entry: any;
}

export default function ViewEntryModal({ isOpen, onClose, entry }: ViewEntryModalProps) {
    if (!isOpen || !entry) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-500/50 overflow-auto no-scrollbar h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border-2 border-green-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 space-y-6">
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-800">View Entry Details</h2>
                <button
                    onClick={onClose}
                    className="text-green-600 hover:text-red-500 text-3xl leading-none"
                >
                    ×
                </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {['timestamp', 'source', 'type', 'value', 'score', 'status'].map((field) => (
                    <div key={field}>
                    <label className="block text-sm text-green-800 font-medium mb-1 capitalize">
                        {field.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                        type="text"
                        value={entry[field]}
                        readOnly
                        className="w-full border border-green-200 bg-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none"
                    />
                    </div>
                ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-green-100 mt-4">
                <button
                    onClick={onClose}
                    className="text-green-800 px-5 py-2 border border-green-800 rounded-lg text-sm font-medium hover:bg-green-50 transition"
                >
                    Close
                </button>
                </div>
            </div>
        </div>
    );
}
