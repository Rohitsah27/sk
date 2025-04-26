import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, icon }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 text-center">
          {icon && <div className="flex justify-center">{icon}</div>}
          {title && <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>}
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}