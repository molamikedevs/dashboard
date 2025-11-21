import { House, Plus, SaveAll, Users } from "lucide-react";

export const siteConfig = {
  name: "Acme Dashboard",
  description: "A dashboard application built with Next.js",
  icons: {
    logo: "/logo.png",
  },
};

export const ROUTES = [
  { name: "Home", href: "/dashboard", icon: House },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: SaveAll,
  },
  {
    name: "Create Invoice",
    href: "/dashboard/invoices/create",
    icon: Plus,
  },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
];
