import { useNavigate } from "react-router-dom";

const NotFound = () => {

  const navigate = useNavigate();

  return (
    <div className="w-full bg-slate-200 flex justify-center items-center flex-col gap-4">
      <h2>Página no encontrada!</h2>
      <div className="flex gap-2">
        <button
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 py-2 px-4 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => navigate(-1)}
        >Regresar</button>
        <button
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => navigate("/")}
        >Pagina principal</button>
      </div>
    </div>
  )
};

export default NotFound;