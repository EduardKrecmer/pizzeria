const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
        <div className="loading-spinner mb-4"></div>
        <p className="text-neutral-800 font-medium">Načítava sa...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
