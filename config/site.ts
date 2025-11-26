import { House, SaveAll, Users } from "lucide-react";

export const siteConfig = {
  name: "Modex",
  description: "Admin dashboard for Modex invoicing platform",
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
  { name: "Customers", href: "/dashboard/customers", icon: Users },
];
