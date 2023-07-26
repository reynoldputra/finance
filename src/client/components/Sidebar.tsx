import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu, Home } from "lucide-react";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  return (
    // main content sidebarnya dibuat array of object dan distore disuatu file
    // isi objectnya icon, 
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="cursor-pointer" />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>ini sidebar bg</SheetTitle>
          {/* <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription> */}
        </SheetHeader>
        <div className="h-full flex flex-col justify-start mt-4 gap-y-6">
          <div
            onClick={() => navigate("/customer")}
            className="w-full flex items-center gap-x-4 cursor-pointer"
          >
            <Home />
            <p className="text-xl font-semibold">Home</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
