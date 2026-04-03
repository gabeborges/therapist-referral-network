"use server";

import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requestDeletion } from "@/features/account/request-deletion";

export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await requestDeletion(prisma, session.user.id);
  } catch {
    return { success: false, error: "Failed to delete account. Please try again." };
  }

  // signOut clears the JWT cookie and redirects — throws a redirect internally
  await signOut({ redirectTo: "/" });

  return { success: true };
}
