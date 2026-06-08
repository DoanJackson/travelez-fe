import { Metadata } from "next";
import AdminLoginComponent from "@/components/admin/AdminLoginComponent";
import { RecaptchaProvider } from "@/components/auth/recaptcha-provider";

export const metadata: Metadata = {
  title: "Admin Portal | TravelEZ",
  robots: { index: false, follow: false },
};

export default function AdminHiddenLoginPage() {
  return (
    <RecaptchaProvider>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
          
          <div className="hidden md:flex md:w-1/2 flex-col justify-center p-12 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 relative overflow-hidden">
            
            <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-pink-200/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-purple-200/40 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                TravelEZ <br /> Admin Portal
              </h1>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">
            <div className="w-full max-w-md">
              <div className="space-y-3 mb-10">
                <h2 className="text-3xl font-bold text-slate-900">System Login</h2>
                <p className="text-slate-500 text-sm">Please sign in with your administrator credentials.</p>
              </div>
              
              <AdminLoginComponent />
            </div>
          </div>

        </div>
      </div>
    </RecaptchaProvider>
  );
}