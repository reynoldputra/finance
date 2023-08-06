import { ChevronLeft, CircleDollarSign } from "lucide-react";
import { useState } from "react";
import SidebarMenus from "./SidebarMenus";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      <div
        className={` ${
          open ? "w-64" : "w-28 "
        } bg-white min-h-screen max-h-full p-5 z-50 pt-8 relative duration-300 border-r-2`}
      >
        <ChevronLeft
          className={`absolute cursor-pointer -right-4 top-16 w-7 h-7
           border-2 rounded-full bg-white ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div
          className={`flex gap-x-4 ${open ? "pl-1" : "justify-center pl-0"} items-center`}
        >
          <CircleDollarSign
            className={`cursor-pointer duration-500 text-darkBlue w-9 h-9 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={` text-normalBlue origin-left font-bold text-3xl duration-200 ${
              !open && "hidden"
            }`}
          >
            Finance
          </h1>
        </div>
        <ul className="pt-6">
          <SidebarMenus open={open} />
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
