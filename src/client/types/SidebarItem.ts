import { LucideIcon } from "lucide-react";

export interface ISidebarItem {
  title: string;
  route: string;
  icon: LucideIcon;
  gap?: boolean;
}
