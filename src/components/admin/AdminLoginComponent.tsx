"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { AuthCookies } from "@/lib/cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import type { ApiError } from "@/types/api";

export default function AdminLoginComponent() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!executeRecaptcha) {
      setErrorMsg("Security system is initializing. Please wait.");
      return;
    }

    setIsLoading(true);

    try {
      const recaptchaToken = await executeRecaptcha("login_admin_action");

      const res = await AuthService.login({ 
        username: email, 
        password, 
        recaptchaToken 
      });
      
      const responseData = res.data as { token: string; userId: number; role: string };

      if (responseData.role !== "ADMIN") {
        setErrorMsg("Unauthorized access. Administrator privileges required.");
        setIsLoading(false);
        return;
      }

      AuthCookies.set(
        responseData.token, 
        responseData.userId, 
        responseData.role,
        false
      );

      toast.success("Login successful.");
      window.dispatchEvent(new Event("auth-change"));
      
      router.push("/admin"); 
      router.refresh();

    } catch (err: unknown) {
      const apiErr = err as ApiError;
      const msg = (apiErr?.message ?? "").toLowerCase();

      if (msg.includes("invalid") || msg.includes("incorrect")) {
        setErrorMsg("Invalid email or password.");
      } else if (msg.includes("recaptcha")) {
        setErrorMsg("Security verification failed. Please try again.");
      } else {
        setErrorMsg("System error encountered. Please try again later.");
      }
    } finally {
      if (!errorMsg && !isLoading) setIsLoading(false);
    }
  }, [email, password, executeRecaptcha, router, errorMsg, isLoading]);

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700 font-medium">Administrator username</Label>
        <Input
          id="email"
          type="text"
          placeholder="admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
        />
      </div>

      {errorMsg && (
        <p className="text-sm font-medium text-red-500">{errorMsg}</p>
      )}

      {/* Nút bấm bo tròn 12px, dùng màu xanh của hệ thống quản trị */}
      <Button 
        type="submit" 
        className="w-full h-12 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium text-base transition-colors shadow-md shadow-pink-500/20" 
        disabled={isLoading || !executeRecaptcha}
      >
        {isLoading ? "Authenticating..." : "Log in"}
      </Button>
    </form>
  );
}