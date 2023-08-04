import { ISidebarItem } from "@client/types/SidebarItem";
import { Home, UserCog2, Users2, FileText } from "lucide-react";

const SidebarItems: ISidebarItem[] = [
  { title: "Home", route: "/", icon: Home },
  { title: "Customer", route: "/customer", icon: Users2 },
  { title: "Kolektor", route: "/kolektor", icon: UserCog2 },
  { title: "Invoices", route: "/invoice", icon: FileText, gap: true },
  // { title: "Penagihan", route: "/penagihan", icon: FileText },
  // { title: "Pembayaran", route: "/pembayaran", icon: FileText },
  // { title: "Transfer", route: "/transer", icon: FileText, gap: true },
  // { title: "Giro", route: "/giro", icon: FileText },
  // { title: "Invoice", route: "/invoice", icon: UserCog2 },
  // { title: "Penagihan", route: "/penagihan", icon: UserCog2 },
  // { title: "Transfer", route: "/transfer", icon: UserCog2 },
  // { title: "Giro", route: "/transfer", icon: UserCog2 },
];

export default SidebarItems;
