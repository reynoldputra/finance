import { useNavigate, useLocation } from "react-router-dom";
import { ISidebarItem } from "@client/types/SidebarItem";
import SidebarItems from "../../data/sidebarItems";

interface sidebarMenusProps {
  open: boolean;
}

const SidebarMenus: React.FC<sidebarMenusProps> = ({ open }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isOnThisPath = (route: string, currRoute: string) => {
    if (route === currRoute) {
      return "bg-opacity-100 shadow-lg shadow-normalBlue/70";
    } else {
      return " bg-opacity-[0.15] hover:bg-opacity-100 hover:shadow-lg hover:shadow-normalBlue/70";
    }
  };
  const isOnThisPathIcon = (route: string, currRoute: string) => {
    if (route === currRoute) {
      return "text-white";
    } else {
      return "text-darkBlue group-hover:text-white";
    }
  };
  return (
    <>
      {SidebarItems.map((item: ISidebarItem, index) => (
        <li
          key={item.title}
          className={`flex rounded-md p-2 cursor-pointer text-gray-800 font-semibold text-lg items-center gap-x-4 ${
            item.gap ? "mt-9" : "mt-2"
          } ${index === 0 && "bg-light-white"} ${!open && "justify-center"} `}
          onClick={() => navigate(item.route)}
        >
          <div
            className={`group bg-normalBlue p-[0.65rem] duration-500 rounded-lg  ${isOnThisPath(
              item.route,
              pathname
            )}`}
          >
            <item.icon
              className={`cursor-pointer  w-7 h-7 ${isOnThisPathIcon(
                item.route,
                pathname
              )}`}
            />
          </div>
          <span className={`${!open && "hidden"} origin-left duration-200`}>
            {item.title}
          </span>
        </li>
      ))}
    </>
  );
};

export default SidebarMenus;
