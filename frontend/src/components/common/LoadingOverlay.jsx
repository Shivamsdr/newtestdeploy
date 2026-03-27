const LoadingOverlay = ({ show, message = 'Loading…' }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" aria-hidden="true" />

      {/* Card */}
      <div className="relative bg-white/80  border border-white/40  shadow-xl rounded-2xl px-5 py-4 flex items-center gap-3">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" aria-hidden="true" />
        <div className="text-sm font-medium text-gray-800 ">{message}</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;

