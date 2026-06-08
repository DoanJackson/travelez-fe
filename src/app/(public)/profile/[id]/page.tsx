import { Suspense } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getUserById } from "@/services/userService";
import { AUTH_COOKIE_KEYS } from "@/lib/auth-constants";
import ProfileTemplate from "@/components/profile/ProfileTemplate";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const viewedId = parseInt(id, 10);

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_KEYS.TOKEN)?.value;
  const cookieUserId = cookieStore.get(AUTH_COOKIE_KEYS.USER_ID)?.value;
  const loggedInId = cookieUserId ? parseInt(cookieUserId, 10) : undefined;
  const isOwnProfile = loggedInId !== undefined && loggedInId === viewedId;

  let initialData;
  try {
    initialData = await getUserById(viewedId, token);
  } catch (err) {
    const status = (err as { status?: number }).status;
    console.error("[profile/[id]] getUserById error:", { viewedId, status, err });
    if (status === 404) notFound();
    throw err;
  }

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileTemplate
        viewedUserId={viewedId}
        isOwnProfile={isOwnProfile}
        loggedInUserId={loggedInId}
        initialData={initialData}
      />
    </Suspense>
  );
}
