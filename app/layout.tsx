import type { Metadata } from "next";
import { inter, lusitana } from "@/config/fonts";
import "./globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: "%s | " + siteConfig.name,
  },
  description: siteConfig.description,
  icons: {
    icon: siteConfig.icons.logo,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${lusitana.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
