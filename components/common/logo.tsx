
import Image from "next/image";

export default function AcmeLogo() {
  return (
    <div
      className={`font-serif flex flex-row items-center leading-none text-white`}>
      <p className="text-[40px] mr-2">Modex</p>
      <Image src="/logo.png" alt="Modex Logo" width={40} height={40} />
    </div>
  );
}
