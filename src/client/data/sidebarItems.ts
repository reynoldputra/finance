import { ISidebarItem } from "@client/types/SidebarItem";
import { Home, UserCog2, Users2 } from "lucide-react";

const SidebarItems: ISidebarItem[] = [
  { title: "Home", route: "/", icon: Home },
  { title: "Customer", route: "/customer", icon: Users2 },
  { title: "Kolektor", route: "/kolektor", icon: UserCog2 },
  { title: "Invoice", route: "/invoice", icon: UserCog2 },
  { title: "Penagihan", route: "/penagihan", icon: UserCog2 },
  { title: "Transfer", route: "/transfer", icon: UserCog2 },
  { title: "Giro", route: "/transfer", icon: UserCog2 },
];

export default SidebarItems;
