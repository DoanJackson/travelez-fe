"use client";

import { useState, FormEvent, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthLayoutShell } from "./auth-layout-shell";
import { AuthService } from "@/services/auth.service";
import type { ApiError } from "@/types/auth";
import { toast } from "sonner";

// ─── Types ─────────────────────────────────────────────────────────────────

type Role = "TRAVELER" | "PROVIDER";
type Gender = "MALE" | "FEMALE" | "OTHER";

type FormErrors = {
  fullName?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  secretCode?: string;
  general?: string;
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function isValidPassword(password: string) {
  return password.length >= 8 && /\d/.test(password);
}

// ─── Component ─────────────────────────────────────────────────────────────

export function RegisterForm() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("TRAVELER");
  const [gender, setGender] = useState<Gender | "">("");
  const [dob, setDob] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // ── Validation ────────────────────────────────────────────────────────────
  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!fullName.trim()) errs.fullName = "Required";
    if (!username.trim()) errs.username = "Required";
    else if (username.trim().length < 3) errs.username = "Min 3 characters";
    if (!password) errs.password = "Required";
    else if (!isValidPassword(password)) errs.password = "8+ chars, include a number";
    if (!confirmPassword) errs.confirmPassword = "Required";
    else if (password !== confirmPassword) errs.confirmPassword = "Passwords don't match";
    if (role === "PROVIDER" && !secretCode.trim()) errs.secretCode = "Required for providers";
    return errs;
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors({});
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setIsLoading(true);
      try {
        if (!executeRecaptcha) {
          setErrors({ general: "reCAPTCHA not ready. Please try again." });
          return;
        }
        const recaptchaToken = await executeRecaptcha("register");
        await AuthService.register({
          username: username.trim(),
          password,
          role,
          fullName: fullName.trim() || null,
          gender: (gender as Gender) || null,
          dob: dob ? new Date(dob).toISOString() : null,
          recaptchaToken,
          ...(role === "PROVIDER" && secretCode.trim()
            ? { secretCode: secretCode.trim() }
            : {}),
        });
        router.push("/login?registered=true");
        toast.success("Registration successful!");
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        const msg = (apiErr?.message ?? "").toLowerCase();
        if (msg.includes("already") || msg.includes("exists")) {
          setErrors({ username: "Username is already taken." });
        } else if (msg.includes("invalid") || msg.includes("required")) {
          setErrors({ general: "Invalid registration data. Please try again." });
        } else {
          setErrors({ general: msg || "Server error. Please try again later." });
        }
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [username, password, confirmPassword, fullName, role, gender, dob, secretCode, executeRecaptcha, router],
  );

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
        title="Create your TravelEZ account"
        subtitle="Plan smarter trips with AI-powered itineraries"
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-2 gap-3.5">

            {/* General error */}
            {errors.general && (
              <div
                role="alert"
                className="col-span-2 p-2.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md"
              >
                {errors.general}
              </div>
            )}

            {/* Row 1 — Full Name | Username (merged) */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                autoComplete="name"
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-xs text-red-600" role="alert">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="e.g. john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                autoComplete="username"
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && (
                <p className="text-xs text-red-600" role="alert">{errors.username}</p>
              )}
            </div>

            {/* Row 2 — Password | Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="8+ chars, 1 number"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-xs text-red-600" role="alert">{errors.password}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-600" role="alert">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Row 3 — Gender | Date of Birth */}
            <div className="space-y-1.5">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={gender}
                onValueChange={(v) => setGender(v as Gender)}
                disabled={isLoading}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* <div className="space-y-1.5">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={isLoading}
                max={new Date().toISOString().split("T")[0]}
              />
            </div> */}

            {/* Row 4 — Provider checkbox (low-profile) */}
            <div className="col-span-2 flex items-center gap-2.5 py-0.5">
              <input
                type="checkbox"
                id="isProvider"
                checked={role === "PROVIDER"}
                onChange={(e) => {
                  setRole(e.target.checked ? "PROVIDER" : "TRAVELER")
                  if (!e.target.checked) setSecretCode("")
                }}
                disabled={isLoading}
                className="size-4 rounded border-slate-300 accent-pink-600 cursor-pointer"
              />
              <Label
                htmlFor="isProvider"
                className="font-normal text-slate-600 cursor-pointer select-none"
              >
                Registering as a Provider?
              </Label>
            </div>

            {/* Row 4b — Secret Code (Provider only) */}
            {role === "PROVIDER" && (
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="secretCode">Provider Secret Code</Label>
                <Input
                  id="secretCode"
                  type="text"
                  placeholder="Enter your provider access code"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  disabled={isLoading}
                  className={errors.secretCode ? "border-red-500" : ""}
                />
                {errors.secretCode && (
                  <p className="text-xs text-red-600" role="alert">{errors.secretCode}</p>
                )}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="col-span-2 w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Signing up…
                </span>
              ) : (
                "Sign up"
              )}
            </Button>

            {/* Login link */}
            <p className="col-span-2 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-pink-600 hover:text-pink-700 font-medium hover:underline"
              >
                Log in
              </Link>
            </p>

            {/* Google OAuth */}
            <div className="col-span-2 space-y-3">
              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-2 text-sm text-gray-500">or continue with</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                  <path fill="#EA4335" d="M12 4.81c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.3 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
            </div>

          </div>
        </form>
      </AuthLayoutShell>
    </>
  );
}
