import { Home, LucideIcon, UserCog2, Users2 } from "lucide-react";

export interface ISidebarItem {
  title: string;
  route: string;
  icon: LucideIcon;
}

const SidebarItems: ISidebarItem[] = [
  { title: "Home", route: "/", icon: Home },
  { title: "Customer", route: "/customer", icon: Users2 },
  { title: "Kolektor", route: "/kolektor", icon: UserCog2 },
];

export default SidebarItems;
