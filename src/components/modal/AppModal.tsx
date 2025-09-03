import React from "react";

interface AppModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeToMaxWidth: Record<NonNullable<AppModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-[70vw]",
};

const AppModal: React.FC<AppModalProps> = ({
  isOpen,
  title,
  description,
  onClose,
  footer,
  children,
  size = "xl",
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[5px]"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className={`w-full ${sizeToMaxWidth[size]} bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {description && (
                <p className="text-sm text-gray-500">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto px-5 py-4 space-y-6">{children}</div>
          {footer && (
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppModal;


