import { Link, useHref } from "react-router-dom";

const SidebarLink = ({ to, children }) => {

  const hRef = useHref();
  const isSelected = to === hRef;

  return (
    <Link
      to={to}
      className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${isSelected ? "dark:bg-gray-700" : "bg-transparent"}`}
    >
      {children}
    </Link>
  )
};

export default SidebarLink;