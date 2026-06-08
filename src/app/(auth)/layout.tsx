import { RecaptchaProvider } from "@/components/auth/recaptcha-provider";
import { AuthLeftPanel } from "@/components/auth/auth-left-panel";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RecaptchaProvider>
      {/* Outer centering wrapper */}
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-4 sm:p-6 md:p-8">
        {/* Central auth card */}
        <div className="grid grid-cols-1 md:grid-cols-12 w-full max-w-7xl h-[85vh] max-h-[720px] bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-2 overflow-hidden">
          {/* Left: image slider — col-span-5, hidden on mobile */}
          <div className="hidden md:flex md:col-span-6">
            <AuthLeftPanel />
          </div>

          {/* Right: auth form — full width on mobile, col-span-7 on md+ */}
          <div className="col-span-12 md:col-span-6 flex flex-col justify-center p-6 sm:p-8 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </RecaptchaProvider>
  );
}
