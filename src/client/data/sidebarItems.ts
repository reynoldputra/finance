import { ISidebarItem } from "@client/types/SidebarItem";
import { Home, UserCog2, Users2, FileText } from "lucide-react";

const SidebarItems: ISidebarItem[] = [
  { title: "Home", route: "/", icon: Home },
  { title: "Customer", route: "/customer", icon: Users2 },
  { title: "Kolektor", route: "/kolektor", icon: UserCog2 },
  { title: "Invoice", route: "/invoice", icon: FileText },
];

export default SidebarItems;
