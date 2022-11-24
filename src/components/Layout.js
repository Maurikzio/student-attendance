import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarLink from "./SidebarLink";
import { logoutUser, getUserInfo, selectUserInfo } from '../store/user/userSlice';

const Layout = ({children }) => {
  const { loading: loadingUser } = useSelector((state) => state.user);
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserInfo());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userGender = userInfo?.gender === "F" ? "a " : "";

  return (
    <div className="flex w-full min-h-full relative bg-zinc-200">
      {(loadingUser) ? (
        <div
          className="absolute left-0 top-0 w-full h-full bg-slate-100 flex justify-center items-center z-20 border"
        >
          <h2 className="text-3xl font-thin tracking-tight text-indigo-600">Cargando...</h2>
        </div>
      ) : null}
      <aside className="w-64 h-full" aria-label="Sidebar">
        <div className="h-full w-64 py-4 px-3 bg-zinc-700 flex flex-col">
            {userInfo ? (<div className="p-2 text-white h-24">
              <h2 className="text-xl font-bold mb-2">{`${userInfo.name} ${userInfo.lastname}`}</h2>
              <h3>{userInfo.role === "inspector" ? `Inspector${userGender}` : `Tutor${userGender} de ${userInfo.tutorOf}`}</h3>
            </div>) : null}
            <ul className="space-y-2 border-t border-zinc-500 pt-4">
              <li>
                  <SidebarLink to={"/"}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 transition duration-75 text-gray-400 group-hover:text-gray-900">
                      <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3">Registros de asistencia</span>
                  </SidebarLink>
              </li>
              <li>
                  <SidebarLink to={"/nuevo-registro"}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 transition duration-75 text-gray-400 group-hover:text-gray-900">
                      <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM12.75 12a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V18a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V12z" clipRule="evenodd" />
                      <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
                    </svg>
                    <span className="ml-3">Nuevo registro</span>
                  </SidebarLink>
              </li>
              <li>
                <SidebarLink to={"/estudiantes"}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 transition duration-75 text-gray-400 group-hover:text-gray-900">
                    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                    <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">Estudiantes</span>
                </SidebarLink>
              </li>
            </ul>
            <div className="border-t border-zinc-500 pt-4 mt-auto">
              <button
                className="inline-flex justify-center w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => dispatch(logoutUser())}
              >
                Salir
              </button>
            </div>
        </div>
      </aside>

      {/* <div className="grow overflow-y-scroll border h-full relative"> */}
      <div className="grow h-screen relative">
        {children}
      </div>
    </div>
  )
};

export default Layout;