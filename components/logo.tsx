
import Image from "next/image";

export default function AcmeLogo() {
  return (
    <div
      className={`font-serif flex flex-row items-center leading-none text-white`}>
      <Image src="/logo.png" alt="Zenova Admin Logo" width={50} height={40} />
      <p className="text-[40px]">Zenova Admin</p>
    </div>
  );
}
