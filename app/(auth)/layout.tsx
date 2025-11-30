import AcmeLogo from "@/components/common/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex items-center justify-center min-h-screen py-8">
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Logo*/}
        <div className="flex justify-center mb-3">
          <div className="flex h-20 w-full max-w-md items-end rounded-lg bg-blue-500 p-3 md:h-24">
            <div className="w-32 text-white mx-auto">
              <AcmeLogo />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </main>
  );
}
