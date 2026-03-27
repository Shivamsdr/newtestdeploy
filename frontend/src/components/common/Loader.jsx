const Loader = ({ minHeightClass = 'min-h-[400px]' }) => {
  return (
    <div className={`flex justify-center items-center ${minHeightClass}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent" />
    </div>
  );
};

export default Loader;
