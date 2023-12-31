import { ISidebarItem } from "@client/types/SidebarItem";
import {
  Home,
  UserCog2,
  Users2,
  FileText,
  Banknote,
  Receipt,
  Undo2,
  // File
} from "lucide-react";

const SidebarItems: ISidebarItem[] = [
  { title: "Home", route: "/", icon: Home },
  { title: "Customer", route: "/customer", icon: Users2 },
  { title: "Kolektor", route: "/kolektor", icon: UserCog2 },
  { title: "Invoices", route: "/invoice", icon: FileText, gap: true },
  { title: "Penagihan", route: "/penagihan", icon: Receipt },
  { title: "Pembayaran", route: "/pembayaran", icon: Banknote },
  { title: "Retur", route: "/retur", icon: Undo2 },
  // { title: "Tanda Terima", route: "/tandaterima", icon: File },
];

export default SidebarItems;
