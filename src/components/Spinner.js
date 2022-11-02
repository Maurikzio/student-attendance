const Spinner = ({ isLoading }) => {
  return (
    isLoading ? (
      <div className="w-full h-full flex justify-center items-center absolute top-0 left-0 bg-slate-600 bg-opacity-25 z-10 backdrop-blur-sm">
        <div className="spinner"></div>
      </div>
    ) : null
  )
};


export default Spinner;