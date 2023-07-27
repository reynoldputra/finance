import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Menu } from "lucide-react";
import SidebarMenus from "./SidebarMenus";

export const Sidebar: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="cursor-pointer" />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>Sidebar</SheetTitle>
        </SheetHeader>
        <SidebarMenus />
      </SheetContent>
    </Sheet>
  );
};
