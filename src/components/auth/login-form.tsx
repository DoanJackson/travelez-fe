"use client";

import { useState, useCallback, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { AuthLayoutShell } from "./auth-layout-shell";
import { AuthService } from "@/services/auth.service";
import { AuthCookies } from "@/lib/cookie";
import { userService } from "@/services/userService";
import { syncNavUser } from "@/lib/nav-user";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";
import { ArrowLeft } from "lucide-react";

// ─── Error state type ──────────────────────────────────────────────────────

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Component ─────────────────────────────────────────────────────────────

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // ── Detect registration redirect ─────────────────────────────────────────
  // RegisterForm redirects to /login?registered=true on success
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success("Account created! Please log in.");
    }
  }, [searchParams]);

  // ── Client-side validation ────────────────────────────────────────────────
  function validate(): FormErrors {
    const errs: FormErrors = {};

    if (!email) {
      errs.email = "Email or username is required";
    } else if (email.includes("@") && !isValidEmail(email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!password) {
      errs.password = "Password is required";
    }

    return errs;
  }

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors({});

      // 1. Client-side validation
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);

      try {
        // 2. Get reCAPTCHA v3 token (same pattern as RegisterForm)
        if (!executeRecaptcha) {
          setErrors({ general: "reCAPTCHA not ready. Please try again." });
          return;
        }
        const recaptchaToken = await executeRecaptcha("login");

        // 3. Call API — map email → username per backend contract
        const result = await AuthService.login({
          username: email,
          password,
          recaptchaToken,
        });

        if (result.data.role === "ADMIN") {
          setErrors({ 
            general: "Administrator accounts are not permitted to log in through this portal." 
          });
          return;
        }

        // 4. Persist session in cookies
        //    rememberMe=true  → 7-day persistent cookie
        //    rememberMe=false → session cookie (cleared on browser close)
        AuthCookies.set(
          result.data.token,
          result.data.userId,
          result.data.role,
          rememberMe,
        );

        // 4b. Fetch full profile to get real name + avatar for nav header.
        //     Fallback to email as display name if the profile fetch fails.
        try {
          const profile = await userService.getUserProfile();
          syncNavUser(profile.fullName, profile.avatar?.url ?? null);
        } catch {
          syncNavUser(email, null);
        }

        // 5. Redirect to home / dashboard
        toast.success("Welcome back!");
        setPassword("");
        router.push("/");
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        // Safely lower-case — handles undefined / null / empty-body 500 cases
        const msg = (apiErr?.message ?? "").toLowerCase();

        if (
          msg.includes("invalid") ||
          msg.includes("not found") ||
          msg.includes("incorrect")
        ) {
          setErrors({ general: "Invalid email or password." });
        } else if (msg.includes("recaptcha")) {
          setErrors({
            general: "reCAPTCHA verification failed. Please try again.",
          });
        } else {
          setErrors({ general: "Server error. Please try again later." });
        }
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [email, password, rememberMe, executeRecaptcha, router],
  );

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const handleGoogleLogin = () => {
    window.location.href = AuthService.getGoogleAuthUrl();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 transition-colors group"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        Back to Home
      </Link>
      <AuthLayoutShell
        title="Welcome back to TravelEZ"
        subtitle="Continue your journey and discover amazing destinations"
      >
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* General / server error */}
          {errors.general && (
            <div
              role="alert"
              className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md"
            >
              {errors.general}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email or Username</Label>
            <Input
              id="email"
              type="text"
              placeholder="Enter email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-600" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-600" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                disabled={isLoading}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-normal cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            <Button
              type="button"
              variant="link"
              className="text-sm text-pink-600 hover:text-pink-700 p-0 h-auto"
              disabled={isLoading}
            >
              Forgot password?
            </Button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Logging in…
              </span>
            ) : (
              "Log in"
            )}
          </Button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            New here?{" "}
            <Link
              href="/register"
              className="text-pink-600 hover:text-pink-700 font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>

          {/* Social Login */}
          <div className="space-y-4">
            <div className="relative py-1">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-sm text-gray-500">
                  or continue with
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              disabled={isLoading}
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.81c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.3 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </form>
      </AuthLayoutShell>
    </>
  );
}
