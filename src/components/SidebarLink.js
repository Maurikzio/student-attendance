import { Link, useHref } from "react-router-dom";

const SidebarLink = ({ to, children }) => {

  const hRef = useHref();
  const isSelected = to === hRef;

  return (
    <Link
      to={to}
      className={`flex items-center p-2 text-base font-normal rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 ${isSelected ? "dark:bg-zinc-800" : "bg-transparent"}`}
    >
      {children}
    </Link>
  )
};

export default SidebarLink;