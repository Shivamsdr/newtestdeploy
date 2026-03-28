import { useEffect } from 'react';
import Button from './Button';

/**
 * Reusable confirmation modal.
 * @param {boolean} isOpen
 * @param {string} title
 * @param {React.ReactNode} children - Message or body content
 * @param {() => void} onConfirm
 * @param {() => void} onCancel
 * @param {string} confirmLabel - e.g. "Delete"
 * @param {string} cancelLabel - e.g. "Cancel"
 * @param {string} confirmVariant - Button variant (danger, primary, etc.)
 * @param {boolean} confirmDisabled - Disable confirm button (e.g. while submitting)
 */
const Modal = ({
  isOpen,
  title,
  children,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  confirmDisabled = false,
  hideFooter = false,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onCancel();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50 "
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="relative bg-white  rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 border border-gray-200 ">
        <h2
          id="modal-title"
          className="text-xl font-bold text-gray-800  mb-4"
        >
          {title}
        </h2>
        <div className="text-gray-600  mb-6 break-words">{children}</div>
        {!hideFooter && (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onCancel} disabled={confirmDisabled}>
              {cancelLabel}
            </Button>
            {onConfirm && (
              <Button
                variant={confirmVariant}
                onClick={onConfirm}
                disabled={confirmDisabled}
              >
                {confirmLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
