import Link from 'next/link';
import AcmeLogo from "../common/logo";
import NavLinks from "./nav-links";
import LogoutForm from "../auth/logout-form";
import ThemeSwitch from "../common/theme-switch";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/">
        <div className="w-32 md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-custom-muted md:block"></div>
        <div className="flex flex-row items-center justify-end space-x-2 md:mt-4 md:flex-col md:space-x-0 md:space-y-2">
          <ThemeSwitch />
          <LogoutForm />
        </div>
      </div>
    </div>
  );
}