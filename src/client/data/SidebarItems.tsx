import { Home, LucideIcon, Users2 } from "lucide-react";

export interface ISidebarItem {
  title: string;
  route: string;
  icon: LucideIcon;
}

const SidebarItems: ISidebarItem[] = [
  { title: "Home", route: "/", icon: Home },
  { title: "Customer", route: "/customer", icon: Users2 },
];

export default SidebarItems;
