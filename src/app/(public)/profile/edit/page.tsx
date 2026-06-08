"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Info, Camera } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { userService } from "@/services/userService";
import { syncNavUser } from "@/lib/nav-user";
import { mockProfileUser } from "@/lib/mock-profile";
import type { EditFormState, UserProfileUpdateRequest } from "@/types/profile";

function deriveInitials(name: string, fallback: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + last).toUpperCase() || fallback;
}

export default function ProfileEditPage() {
  const router = useRouter();

  const [form, setForm] = useState<EditFormState>({
    fullName: mockProfileUser.fullName,
    username: mockProfileUser.username,
    dob: mockProfileUser.dob,
    gender: mockProfileUser.gender,
    email: mockProfileUser.email,
  });
  const [initials, setInitials] = useState(mockProfileUser.initials);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  // const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null);
  // const [avatarError, setAvatarError] = useState("");
  // const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getUserProfile();

        setForm((prev) => ({
          ...prev,
          fullName: data.fullName ?? "",
          username: data.username ?? "",
          dob: data.dob ? data.dob.slice(0, 10) : prev.dob,
          gender: data.gender ? data.gender.toLowerCase() : prev.gender,
          email: data.email ?? "",
        }));
        setInitials(deriveInitials(data.fullName, mockProfileUser.initials));
        setExistingAvatarUrl(data.avatar?.url ?? null);
      } catch {
        // getUserProfile failed — keep mock defaults silently
      }
    };

    fetchProfile();
  }, []);

  // Revoke object URL when preview changes or component unmounts
  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    };
  }, [avatarPreviewUrl]);

  // function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   if (!file.type.startsWith("image/")) {
  //     setAvatarError("Please select an image file.");
  //     e.target.value = "";
  //     return;
  //   }
  //   if (file.size > 5 * 1024 * 1024) {
  //     setAvatarError("Image must be smaller than 5 MB.");
  //     e.target.value = "";
  //     return;
  //   }

  //   setAvatarError("");
  //   if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
  //   setAvatarFile(file);
  //   setAvatarPreviewUrl(URL.createObjectURL(file));
  //   setIsDirty(true);
  //   // Reset so re-selecting the same file fires onChange again
  //   e.target.value = "";
  // }

  function setField<K extends keyof EditFormState>(
    key: K,
    value: EditFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  }

  function handleCancel() {
    if (isDirty) {
      setShowDiscard(true);
    } else {
      router.push("/profile");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      // TODO: upload avatarFile to API before saving form when endpoint is ready
      const payload: UserProfileUpdateRequest = {
        fullName: form.fullName.trim(),
        username: form.username.trim(),
        dob: form.dob ? new Date(form.dob).toISOString() : "",
        gender: form.gender.toUpperCase(),
      };
      const updatedProfile = await userService.updateUserProfile(payload);
      syncNavUser(updatedProfile.fullName, updatedProfile.avatar?.url ?? existingAvatarUrl);
      toast.success("Profile updated");
      router.push("/profile");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  // Avatar display priority: local preview → existing API avatar → initials fallback
  // const displayAvatarUrl = avatarPreviewUrl ?? existingAvatarUrl ?? null;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-20">
          {/* Header */}
          <header className="mb-8">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 text-slate-500 hover:text-pink-600 transition-colors group mb-4"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium text-sm">Back to Profile</span>
            </button>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Edit Profile
            </h1>
          </header>

          {/* Form card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Section: Personal Information */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-pink-600 rounded-full" />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Personal Information
                  </h2>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={form.fullName}
                      placeholder="Enter your full name"
                      onChange={(e) => {
                        setField("fullName", e.target.value);
                        setInitials(
                          deriveInitials(e.target.value, mockProfileUser.initials),
                        );
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium select-none">
                        @
                      </span>
                      <Input
                        id="username"
                        type="text"
                        className="pl-7"
                        value={form.username}
                        onChange={(e) => setField("username", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={form.dob}
                        onChange={(e) => setField("dob", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={form.gender}
                        onValueChange={(v) => setField("gender", v)}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section: Contact Settings */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-pink-600 rounded-full" />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Contact Settings
                  </h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      disabled
                      className="pr-10 cursor-not-allowed"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 ml-0.5">
                    <Info className="h-3.5 w-3.5 shrink-0" />
                    Email changes must be verified through account security
                    settings.
                  </p>
                </div>
              </section>

              {/* Footer actions */}
              <div className="pt-6 flex justify-end items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg px-8"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Discard changes confirmation */}
      <AlertDialog open={showDiscard} onOpenChange={setShowDiscard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/profile")}>
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
