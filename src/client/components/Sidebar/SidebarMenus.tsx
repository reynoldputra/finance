import { useNavigate } from "react-router-dom";
import { SheetTrigger } from "../ui/sheet";
import { ISidebarItem } from "@client/types/SidebarItem";
import SidebarItems from "../../data/sidebarItems";

const SidebarMenus: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col justify-start mt-4 gap-y-6">
      {SidebarItems.map((menu: ISidebarItem) => (
        <SheetTrigger asChild key={menu.route}>
          <div
            onClick={() => navigate(menu.route)}
            className="w-full flex items-center gap-x-4 cursor-pointer"
          >
            <menu.icon />
            <p className="text-xl font-semibold">{menu.title}</p>
          </div>
        </SheetTrigger>
      ))}
    </div>
  );
};

export default SidebarMenus;
